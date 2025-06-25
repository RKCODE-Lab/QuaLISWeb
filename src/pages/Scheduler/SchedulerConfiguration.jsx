import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    callService, updateStore, onSampleTypeChange, onRegTypeChange, onRegSubTypeChange, changeApprovalConfigVersionChange,
    getSchedulerConfigSample, filterTransactionList, getSchedulerConfigSubSampleDetail, getPreviewTemplate,getSchedulerTestDetail,
    ReloadDataSchedulerConfig,getTestChildTabDetailSchedulerConiguration,addsubSampleSchedulerConfiguration,testSectionTest,
    saveSchedulerSubSample,getEditSchedulerSubSampleComboService,updateSchedulerConfigSubSample,deleteSchedulerSubSample,
    addMoreSchedulerConfigTest,createSchedulerTest,deleteSchedulerConfigTest,getEditSchedulerConfigComboService,validateEsignforSchedulerConfig,
    openModal,approveSchedulerConfig,deleteSchedulerConfig,updateActiveStatusSchedulerConfig,getSchedulerMasteDetails
} from '../../actions';
import { ListWrapper } from '../../components/client-group.styles';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Button, Card, Col, Row ,Nav} from 'react-bootstrap';
import SplitterLayout from "react-splitter-layout";
import {  convertDateValuetoString, rearrangeDateFormat, getControlMap, comboChild ,getSameRecordFromTwoArrays,
    sortDataForDate,childComboClear,ageCalculate,Lims_JSON_stringify,showEsign
} from '../../components/CommonScript'
import TransactionListMasterJsonView from '../../components/TransactionListMasterJsonView';
import SchedulerConfigurationFilter from './SchedulerConfigurationFilter';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
    faFileInvoice, faEye, faPlus, faTrashAlt, faThumbsUp, faLink, faCommentDots, faChevronRight, faComments, faComment, faPaperclip,
    faFlask, faMicroscope, faHistory, faArrowRight, faBoxOpen, faBox, faLocationArrow, faFolderOpen, faFolder, faPrint, faFileImport, faCopy

} from '@fortawesome/free-solid-svg-icons';
import { ProductList } from '../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { constructOptionList } from '../../components/CommonScript';
import { ContentPanel } from '../../components/App.styles';
import { transactionStatus,checkBoxOperation,SideBarTabIndex,SideBarSeqno,designProperties,SampleType} from '../../components/Enumeration';
import { toast } from 'react-toastify';
import PreRegisterSlideOutModal from '../registration/PreRegisterSlideOutModal';
import PortalModal from '../../PortalModal';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ReactComponent as FullviewExpand } from '../../assets/image/fullview-expand.svg';
import { ReactComponent as FullviewCollapse } from '../../assets/image/fullview-collapse.svg';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import SampleInfoView from '../approval/SampleInfoView';
import SchedulerParameterTab from './SchedulerParameterTab';
import SampleGridTab from '../registration/SampleGridTab';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import AddSubSampleConfiguration from './AddSubSampleConfiguration';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { getRegistrationSubSample } from './SchedulerValidation';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import AddTestSchedulerConfig from './AddTestSchedulerConfig';
import { ReactComponent as ActiveStatusIcon } from '../../assets/image/circle-play-regular.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

// ALPD-4914 created SchedulerConfiguration.jsx file for scheduler configuration screen
class SchedulerConfiguration extends React.Component {
    constructor(props) {
        super(props);
        this.searchSampleRef = React.createRef();
        this.searchSubSampleRef = React.createRef();
        this.searchTestRef = React.createRef();
        this.state = {
            splitChangeWidthPercentage: 28.6,
            enablePropertyPopup: false,
            addSchedulerConfigurationId: -1,
            approveSchedulerConfigurationId:-1,
            deleteSchedulerConfigurationId:-1,
            activeInactiveSchedulerConfigurationId:-1,
            addSubSampleSchedulerConfigurationId:-1,
            editSubSampleSchedulerConfigurationId:-1,
            deleteSubSampleSchedulerConfigurationId:-1,
            deleteTestSchedulerConfigurationId:-1,
            addTestSchedulerConfigurationId:-1,
            stateSampleType: [],
            stateRegistrationType: [],
            stateRegistrationSubType: [],
            stateSchedulerConfigType: [],
            stateFilterStatus: [],
            stateApprovalConfigVersion: [],
            stateDynamicDesign: [],
            userRoleControlRights: [],
            skip: 0,
            take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
            subsampleskip: 0,
            subsampletake: this.props.Login.settings && this.props.Login.settings[12],
            testskip: 0,
            testtake: this.props.Login.settings && this.props.Login.settings[12],
            filterSampleParam: {},
            selectedRecord: {},
            columnList: [],
            childColumnList: [],
            withoutCombocomponent: [],
            comboComponents: [],
            subSampleGetParam:{},
            testGetParam:{},
            editSubSampleSchedulerParam:{},
            DynamicSampleColumns: [],
            sampleSearchFied: [],
            subsampleSearchFied: [],
            testSearchFied: [],
            testMoreField: [],
            testListColumns: [],
            SubSampleDynamicGridItem: [],
            SubSampleDynamicGridMoreField: [],
            SubSampleSingleItem: [],
            sampleCombinationUnique: [], subsampleCombinationUnique: [],
            DynamicTestColumns: [],
            SingleItem: [],
            DynamicGridItem: [],
            DynamicGridMoreField: [],
            sampleGridDataState: { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 },
            resultDataState: {
                skip: 0, take: this.props.Login.settings ?
                    parseInt(this.props.Login.settings[14]) : 5 
            },
            enableAutoClick: false,
            sampleSearchField:{},
            filterTestParam:{},
            testSearchField:[],
            filterSubSampleParam:{},
            subsampleSearchField: [],
            editSchedulerConfigId:-1,
            editSchedulerSampleParam:{},
            approveSchedulerSampleParam:{},
            deleteSchedulerSampleParam:{},
            activeInactiveSchedulerSampleParam:{}



        };
        this.breadCrumbData = [];
        this.PrevoiusLoginData = undefined;
        this.sinstrumentid=undefined;

        this.confirmMessage = new ConfirmMessage();

    }

    render() {
            let data = [];
           let comboComponents;
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
                                    } 
                                    return null;
                                })
                                : component.inputtype === "combo" || component.inputtype === "backendsearchfilter"
                                    || component.inputtype === "frontendsearchfilter" ?
                                    data.push(component) : ""
                        })
                    })

                })
                 comboComponents = data
            }
               
            
        // let sinstrumentid;
        this.props.Login&& comboComponents&&comboComponents.forEach(item => {
            if (item.name === 'Instrument') {
                this.sinstrumentid = item.label;
            }
        });

         console.log("this.state.subsampletake", this.state.subsampleskip);
         console.log("this.state.subsampletake", this.state.subsampletake);

         console.log("this.props.Login.masterData.RealRegSubTypeValue", this.props.Login.masterData.RealRegSubTypeValue);

        //let sampleList = this.props.Login.masterData.SchedulerConfigGetSample ? this.props.Login.masterData.SchedulerConfigGetSample : [];
        let sampleList = this.props.Login.masterData.SchedulerConfigGetSample ? this.props.Login.regSampleExisted ? sortDataForDate(this.props.Login.masterData.SchedulerConfigGetSample, 'dtransactiondate', 'nschedulersamplecode') :
        sortDataForDate(this.props.Login.masterData.SchedulerConfigGetSample, 'dtransactiondate', 'nschedulersamplecode') : [];
        let subSampleList = this.props.Login.masterData.SchedulerConfigGetSubSample ? this.props.Login.masterData.SchedulerConfigGetSubSample : [];
        let testList = this.props.Login.masterData.SchedulerConfigGetTest ? this.props.Login.masterData.SchedulerConfigGetTest : [];
        this.breadCrumbData = [
            {
                "label": "IDS_REGTYPE",
                "value": this.props.Login.masterData && this.props.Login.masterData.RealRegTypeValue
                    && this.props.Login.masterData.RealRegTypeValue.sregtypename
            },
            {
                "label": "IDS_REGSUBTYPE",
                "value": this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue
                    && this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename
            },
            {
                "label": "IDS_SCHEDULERCONFIGTYPE",
                "value": this.props.Login.masterData && this.props.Login.masterData.RealSchedulerConfigTypeValue
                    && this.props.Login.masterData.RealSchedulerConfigTypeValue.sschedulerconfigtypename
            },
            {
                "label": "IDS_STATUS",
                "value": this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue
                    && this.props.Login.masterData.RealFilterStatusValue.stransdisplaystatus
            }
        ];

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
                        splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                        masterList={this.props.Login.masterData.searchedTest || testList}
                        selectedMaster={this.props.Login.masterData.selectedTest}
                        primaryKeyField="nschedulertestcode"
                        filterColumnData={this.props.filterTransactionList}
                        getMasterDetail={(event, status) => { this.props.getTestChildTabDetailSchedulerConiguration(event, status); this.changePropertyView(1, event, "click") }}
                        inputParam={{
                            ...this.state.testChildGetParam, 
                            resultDataState: this.state.resultDataState,
                            // testCommentDataState: this.state.testCommentDataState,
                            // testAttachmentDataState: this.state.testAttachmentDataState,
                            // registrationTestHistoryDataState: this.state.registrationTestHistoryDataState,
                            // activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,
                            // activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ?
                            //     this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE ? 1 : 0 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ?
                            //         this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE ? 1 : 0 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                            activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 0 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 0 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                        }}
                        selectionList={this.props.Login.masterData.RealFilterStatusValue
                            && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                        selectionColorField="scolorhexcode"
                        mainField={"stestsynonym"}
                        showStatusLink={true}
                        showStatusName={true}
                        statusFieldName="stransdisplaystatus"
                        statusField="ntransactionstatus"
                        selectedListName="selectedTest"
                        searchListName="searchedTest"
                        searchRef={this.searchTestRef}
                        objectName="test"
                        listName="IDS_TEST"
                        pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}

                        selectionField="ntransactionstatus"
                        selectionFieldName="stransdisplaystatus"
                        showFilter={this.props.Login.showFilter}
                        // openFilter={this.openFilter}
                       closeFilter={this.closeFilter}
                      //onFilterSubmit={this.onFilterSubmit}
                        subFields={this.state.testListColumns||[]}
                        moreField={this.state.testMoreField}

                        // needMultiValueFilter={true}
                        clearAllFilter={undefined}
                        onMultiFilterClick={undefined}
                        // jsonField={'jsondata'}
                        //jsonDesignFields={true}
                        needMultiSelect={true}
                        showStatusBlink={true}
                        callCloseFunction={true}
                        filterParam={this.state.filterTestParam}
                        subFieldsLabel={true}
                        handlePageChange={this.handleTestPageChange}
                       // buttonCount={5}
                        skip={this.state.testskip}
                        take={this.state.testtake}
                        childTabsKey={["SchedulerConfigurationParameter"]}
                        actionIcons={undefined}
                        needFilter={false}
                        commonActions={<>
                        <ProductList className="d-flex justify-content-end icon-group-wrap">
                                    {/* <ReactTooltip place="bottom" /> */}
                                    <Nav.Link name="addtest" className="btn btn-circle outline-grey ml-2"
                                      
                                        data-tip={this.props.intl.formatMessage({ id: "IDS_ADDTEST" })}
                                        hidden={this.state.userRoleControlRights.indexOf(this.state.addTestSchedulerConfigurationId) === -1}
                                        onClick={() => this.addMoreSchedulerConfigTest({
                                            ...this.state.addTestParam,
                                            skip: this.state.skip,
                                            take: (this.state.skip + this.state.take)
                                        },
                                            this.state.addTestSchedulerConfigurationId)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Nav.Link>
                                    <Nav.Link name="adddeputy" className="btn btn-circle outline-grey ml-2"
                                            //title={"Add Test"}
                                            //  data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETETEST" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.deleteTestSchedulerConfigurationId) === -1}
                                            // onClick={() => this.addSubSample(this.state.addSubSampleId, this.state.subsampleskip, this.state.subsampletake)}
                                            onClick={() => this.ConfirmTestDelete(this.state.deleteTestSchedulerConfigurationId, this.state.skip, this.state.take, this.state.subsampleskip, this.state.subsampletake)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Nav.Link>
                                </ProductList>
                        </>}
                        // filterComponent={[]}
                    />
                </Card.Body>
            </Card>
        </ContentPanel>;

        let mainDesign = "";

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
                            clickIconGroup={true}
                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                            masterList={this.props.Login.masterData.searchedSubSample || subSampleList}
                            selectedMaster={this.props.Login.masterData.selectedSubSample}
                            primaryKeyField="nschedulersubsamplecode"
                            filterColumnData={this.props.filterTransactionList}
                            getMasterDetail={(event, status) => { this.props.getSchedulerTestDetail(event, status) }}
                            inputParam={{
                                 ...this.state.testGetParam,
                                 searchTestRef: this.searchTestRef,
                                searchSubSampleRef: this.searchSubSampleRef,
                                subsampleskip: this.state.subsampleskip,
                                subsampletake: this.state.subsampletake,
                                testskip: this.state.testskip,
                                testtake: this.state.testtake,
                            }}
                            selectionList={this.props.Login.masterData.RealFilterStatusValue
                                && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                            selectionColorField="scolorhexcode"
                            mainField={'ssamplearno'}
                            showStatusLink={true}
                            showStatusName={true}
                            statusFieldName="stransdisplaystatus"
                            statusField="ntransactionstatus"
                            selectedListName="selectedSubSample"
                            searchListName="searchedSubSample"
                            searchRef={this.searchSubSampleRef}
                            objectName="subsample"
                            listName="IDS_SUBSAMPLE"
                            selectionField="ntransactionstatus"
                            selectionFieldName="stransdisplaystatus"
                            showFilter={this.props.Login.showFilter}
                            needValidation={true}
                            pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}                           

                            // openFilter={this.openFilter}
                            // closeFilter={this.closeFilter}
                            // onFilterSubmit={this.onFilterSubmit}
                            subFields={this.state.DynamicSubSampleColumns}
                            // needMultiValueFilter={true}
                           // clearAllFilter={undefined}
                            //onMultiFilterClick={undefined}
                            // jsonField={'jsondata'}
                            //jsonDesignFields={true}
                            needMultiSelect={true}
                            showStatusBlink={true}
                            callCloseFunction={true}
                            filterParam={{
                                ...this.state.filterSubSampleParam,
                                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }]
                            }}
                            subFieldsLabel={true}
                           handlePageChange={this.handleSubSamplePageChange}
                            skip={this.state.subsampleskip}
                            take={this.state.subsampletake}
                           // pageSize={this.props.Login.settings && this.props.Login.settings[13].split(",").map(setting => parseInt(setting))}                           
                            childTabsKey={["SchedulerConfigGetTest"]}
                            actionIcons={
                                
                                this.props.Login.masterData && this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample === true ?
                                    [
                                        
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                            controlname: "faPencilAlt",
                                            objectName: "mastertoedit",
                                            hidden: this.state.userRoleControlRights.indexOf(this.state.editSubSampleSchedulerConfigurationId) === -1,
                                            onClick: this.editSubSampleScheduler,
                                            inputData: {
                                                primaryKeyName: "nschedulersubsamplecode",
                                                operation: "update",
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                searchTestRef:this.searchTestRef,
                                                ncontrolCode:this.state.editSubSampleSchedulerConfigurationId,
                                                editSubSampleSchedulerParam: { ...this.state.editSubSampleSchedulerParam, ncontrolCode: this.state.editSubSampleId }
                                            },
                                        }
                                        
                                      

                                    ]
                                    :
                                    [
                                        {
                                            title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                            controlname: "faPencilAlt",
                                            objectName: "mastertoedit",
                                            hidden: this.state.userRoleControlRights.indexOf(this.state.editSubSampleId) === -1,
                                            onClick: this.editSubSampleScheduler,
                                            inputData: {
                                                primaryKeyName: "ntransactionsamplecode",
                                                operation: "update",
                                                masterData: this.props.Login.masterData,
                                                userInfo: this.props.Login.userInfo,
                                                searchTestRef:this.searchTestRef,
                                                ncontrolCode:this.state.editSubSampleSchedulerConfigurationId,
                                                editSubSampleSchedulerParam: { ...this.state.editSubSampleSchedulerParam, ncontrolCode: this.state.editSubSampleId }
                                            },
                                        }
                                      


                                    ]
                            }
                            needFilter={false}
                            commonActions={<>
                                                                <ProductList className="d-flex justify-content-end icon-group-wrap">
                                                                <Nav.Link name="adddeputy" className="btn btn-circle outline-grey ml-2"
                                            //title={"Add Test"}
                                            //  data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADDSUBSAMPLE" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.addSubSampleSchedulerConfigurationId) === -1}
                                            // onClick={() => this.addSubSample(this.state.addSubSampleId, this.state.subsampleskip, this.state.subsampletake)}
                                            onClick={() => this.addSubSample(this.state.addSubSampleSchedulerConfigurationId, this.state.skip, this.state.take)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Nav.Link>

                                        <Nav.Link name="adddeputy" className="btn btn-circle outline-grey ml-2"
                                            //title={"Add Test"}
                                            //  data-for="tooltip-common-wrap"
                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETESUBSAMPLE" })}
                                            hidden={this.state.userRoleControlRights.indexOf(this.state.deleteSubSampleSchedulerConfigurationId) === -1}
                                            // onClick={() => this.addSubSample(this.state.addSubSampleId, this.state.subsampleskip, this.state.subsampletake)}
                                            onClick={() => this.ConfirmDelete(this.state.deleteSubSampleSchedulerConfigurationId, this.state.skip, this.state.take, this.state.subsampleskip, this.state.subsampletake)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Nav.Link>
                                                                </ProductList>
                            </>}
                        // filterComponent={[]}
                        />
                    </Card.Body>
                </Card>
                {testDesign}
            </SplitterLayout>;
        } else {
            mainDesign = testDesign;
        }
        
       
    

        this.postParamList = [
            {
                filteredListName: "searchedSample",
                clearFilter: "no",
                searchRef: this.searchSampleRef,
                primaryKeyField: "nschedulersamplecode",
                fetchUrl: "schedulerconfiguration/getSchedulerConfigSubSample",
                fecthInputObject: {
                    ...this.state.subSampleGetParam, 
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    // resultDataState: this.state.resultDataState,
                    // testCommentDataState: this.state.testCommentDataState,
                    // testAttachmentDataState: this.state.testAttachmentDataState,
                    // sampleGridDataState: this.state.sampleGridDataState
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
                primaryKeyField: "nschedulersubsamplecode",
                fetchUrl: "schedulerconfiguration/getSchedulerConfigTest",
                fecthInputObject: {
                    ...this.state.testGetParam, 
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchTestRef: this.searchTestRef,
                    // resultDataState: this.state.resultDataState,
                    // testCommentDataState: this.state.testCommentDataState,
                    // testAttachmentDataState: this.state.testAttachmentDataState,
                    // sampleGridDataState: this.state.sampleGridDataState
                },
                childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                selectedObject: "selectedSubSample",
                inputListName: "selectedSubSample",
                updatedListname: "SchedulerConfigGetSubSample",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            },
            {
                filteredListName: "searchedTest",
                updatedListname: "SchedulerConfigGetTest",
                clearFilter: "no",
                searchRef: this.searchTestRef,
                primaryKeyField: "nschedulertestcode",
                fetchUrl: "approval/getApprovalTest",
                fecthInputObject: {
                    ...this.state.testGetParam,
                    searchTestRef: this.searchTestRef,
                    testskip: this.state.testskip,
                    subsampleskip: this.state.subsampleskip,
                    // resultDataState: this.state.resultDataState
                },
                selectedObject: "selectedTest",
                inputListName: "selectedTest",
                unchangeList: ["realSampleTypeValue", "SampleTypeValue", "realRegTypeValue", "RegTypeValue", "realRegSubTypeValue", "RegSubTypeValue",
                    "realApprovalVersionValue", "ApprovalVersionValue", "realFilterStatusValue", "FilterStatusValue", "fromDate", "toDate",
                    "UserSectionValue", "SampleType", "RegType", "RegSubType", "ApprovalVersion", "JobStatus", "JobStatusValue", "FilterStatus"]
            }
        ];

        return (
            <>
                <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters={true} className="toolbar-top">
                        <Col md={12} className="parent-port-height">
                            <ListWrapper className={`vertical-tab-top ${this.state.enablePropertyPopup ? 'active-popup' : ""}`}>
                                 <div className={`tab-left-area ${this.state.activeTabIndex ? 'active' : ""}`}> 
                                <SplitterLayout borderColor="#999"
                                    primaryIndex={1} percentage={true}
                                    secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                    // onSecondaryPaneSizeChange={this.paneSizeChange}
                                    primaryMinSize={30}
                                    secondaryMinSize={20}
                                >
                                    <div className='toolbar-top-inner'>
                                        <TransactionListMasterJsonView
                                            listMasterShowIcon={1}
                                            clickIconGroup={true}
                                            splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                            masterList={this.props.Login.masterData.searchedSample || sampleList}
                                            selectedMaster={this.props.Login.masterData.selectedSample}
                                            primaryKeyField="nschedulersamplecode"
                                            filterColumnData={this.props.filterTransactionList}
                                            getMasterDetail={this.props.getSchedulerConfigSubSampleDetail}
                                            inputParam={{
                                               
                                                ...this.state.subSampleGetParam,
                                                searchTestRef: this.searchTestRef,
                                                searchSubSampleRef: this.searchSubSampleRef,
                                                testskip: this.state.testskip,
                                                subsampleskip: this.state.subsampleskip,
                                                 resultDataState: this.state.resultDataState,
                                                 activeTabIndex: this.state.enableAutoClick && this.state.activeTabIndex == undefined ? 4 : this.state.enableAutoClick && this.state.activeTabIndex == 0 ? 4 : this.state.enableAutoClick ? this.state.activeTabIndex : 0,
                                            }}
                                            selectionList={this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus === transactionStatus.ALL ? this.props.Login.masterData.FilterStatus : []}
                                            selectionColorField="scolorhexcode"
                                            mainField={this.sinstrumentid}
                                            showStatusLink={true}
                                            showStatusName={true}
                                            statusFieldName="stransdisplaystatus"
                                            statusField="ntransactionstatus"
                                            //ALPD-4941--Added by vignesh R(07-02-2025)-->this prop is passed to TransactionListMaster to display the second status color.
                                           //start
                                            secondaryFieldname="nactivestaus"
                                            secondaryField="sactiveststaus"
                                            statusColor="ssecondcolorhexcode"
                                            //end
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
                                            //needMultiValueFilter={true}
                                            clearAllFilter={undefined}
                                            onMultiFilterClick={undefined}
                                           
                                            needMultiSelect={false}
                                            showStatusBlink={true}
                                            callCloseFunction={true}
                                            filterParam={{
                                                ...this.state.filterSampleParam,
                                                childRefs: [{ ref: this.searchSubSampleRef, childFilteredListName: "searchedSubSample" },
                                                { ref: this.searchTestRef, childFilteredListName: "searchedTest" }],
                                            }}
                                            subFieldsLabel={true}
                                            handlePageChange={this.handlePageChange}
                                            skip={this.state.skip}
                                            take={this.state.take}
                                            childTabsKey={["SchedulerConfigGetTest","SchedulerConfigGetSubSample",]}
                                            actionIcons={
                                                [
                                                  
                                                    {
                                                        title: this.props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                        controlname: "faPencilAlt",
                                                        objectName: "mastertoedit",
                                                        hidden: this.state.userRoleControlRights.indexOf(this.state.editSchedulerConfigId) === -1,
                                                        onClick: this.editSchedulerConfiguration,
                                                        inputData: {
                                                            primaryKeyName: "nschedulersamplecode",
                                                            operation: "update",
                                                            masterData: this.props.Login.masterData,
                                                            userInfo: this.props.Login.userInfo,
                                                            editSchedulerSampleParam: {
                                                                ...this.state.editSchedulerSampleParam,
                                                                ncontrolCode: this.state.editSchedulerConfigId,
                                                                nneedsubsample: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample //=== true ? transactionStatus.YES:transactionStatus.NO
                                                            }
                                                        },
                                                    },
                                                    {
                                                        title: this.props.intl.formatMessage({ id: "IDS_APPROVE" }),
                                                        hidden: this.state.userRoleControlRights.indexOf(this.state.approveSchedulerConfigurationId) === -1,
                                                        objectName: "mastertoapprove",
                                                        onClick: this.approveSchedulerConfiguration,
                                                        controlname: "faThumbsUp",
                                                        inputData: {
                                                            primaryKeyName: "nschedulersamplecode",
                                                            operation: "approve",
                                                            masterData: this.props.Login.masterData,
                                                            userInfo: this.props.Login.userInfo,
                                                            approveSchedulerSampleParam: {
                                                                ...this.state.approveSchedulerSampleParam,
                                                                ncontrolCode: this.state.approveSchedulerConfigurationId,
                                                                nneedsubsample: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
                                                            }
                                                        },
                                                    },
                                                    {
                                                        title: this.props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                        hidden: this.state.userRoleControlRights.indexOf(this.state.deleteSchedulerConfigurationId) === -1,
                                                        objectName: "mastertodelete",
                                                        onClick: this.ConfirmSampleDelete,
                                                        controlname: "faTrashAlt",
                                                        inputData: {
                                                            primaryKeyName: "nschedulersamplecode",                                                            masterData: this.props.Login.masterData,
                                                            userInfo: this.props.Login.userInfo,
                                                            deleteSchedulerSampleParam: {
                                                                ...this.state.deleteSchedulerSampleParam,
                                                                ncontrolCode: this.state.deleteSchedulerConfigurationId,
                                                                nneedsubsample: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
                                                            }
                                                        },
                                                    },
                                                    {
                                                        title: this.props.intl.formatMessage({ id: "IDS_INACTIVEACTIVE" }),
                                                        hidden: this.state.userRoleControlRights.indexOf(this.state.activeInactiveSchedulerConfigurationId) === -1,
                                                        objectName: "mastertoupdateactivestatus",
                                                        onClick: this.onInactiveActive,
                                                        controlname: "faActiveStatus",
                                                        inputData: {
                                                            primaryKeyName: "nschedulersamplecode",
                                                            operation: "updateactive",
                                                            masterData: this.props.Login.masterData,
                                                            userInfo: this.props.Login.userInfo,
                                                            activeInactiveSchedulerSampleParam: {
                                                                ...this.state.activeInactiveSchedulerSampleParam,
                                                                ncontrolCode: this.state.activeInactiveSchedulerConfigurationId ,
                                                                nneedsubsample: this.props.Login.masterData && this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample
                                                            }
                                                        },
                                                    }
                                                ]}
                                               
                                                   

                                                  

                                            
                                            needFilter={true}
                                            commonActions={
                                                <ProductList className="d-flex product-category float-right icon-group-wrap">
                                                    <Button className="btn btn-icon-rounded btn-circle solid-blue ml-2" role="button"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                                                            //  data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.addSchedulerConfigurationId) === -1}
                                                            onClick={() => this.getSchedulerConfigComboService("SchedulerConfig", "create", "nschedulersamplecode",
                                                                this.props.Login.masterData, this.props.Login.userInfo, this.state.addSchedulerConfigurationId, false, true, true)}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Button>

                                                        <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                                            //   data-for="tooltip-common-wrap"

                                                            onClick={() => this.onReload()} >
                                                            <RefreshIcon className='custom_icons' />
                                                        </Button>
                                                        {/*<Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                            //   data-for="tooltip-common-wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.deleteSchedulerConfigurationId) === -1}

                                                            onClick={() => this.ConfirmSampleDelete(this.state.deleteSchedulerConfigurationId, this.state.skip, this.state.take)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                            </Button>*/}
                                                          {/*  <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_INACTIVEACTIVE" })}
                                                            hidden={this.state.userRoleControlRights.indexOf(this.state.activeInactiveSchedulerConfigurationId) === -1}

                                                            //   data-for="tooltip-common-wrap"
                                                            onClick={() => this.onInactiveActive(this.state.activeInactiveSchedulerConfigurationId, this.state.skip, this.state.take)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                            </Button>*/}
                                                </ProductList>
                                            }
                                            filterComponent={[
                                                {
                                                    "Scheduler Configuration Filter": <SchedulerConfigurationFilter
                                                        SampleType={this.state.stateSampleType || []}
                                                        RegistrationType={this.state.stateRegistrationType || []}
                                                        RegistrationSubType={this.state.stateRegistrationSubType || []}
                                                        SchedulerConfigType={this.state.stateSchedulerConfigType || []}
                                                        FilterStatus={this.state.stateFilterStatus || []}
                                                        ApprovalConfigVersion={this.state.stateApprovalConfigVersion || {}}
                                                        DynamicDesignMapping={this.state.stateDynamicDesign || []}
                                                        userInfo={this.props.Login.userInfo || {}}
                                                        SampleTypeValue={this.props.Login.masterData.SampleTypeValue || {}}
                                                        RegTypeValue={this.props.Login.masterData.RegTypeValue || {}}
                                                        RegSubTypeValue={this.props.Login.masterData.RegSubTypeValue || {}}
                                                        SchedulerConfigTypeValue={this.props.Login.masterData.SchedulerConfigTypeValue || {}}
                                                        FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                                                        ApprovalConfigVersionValue={this.props.Login.masterData.ApprovalConfigVersionValue || {}}
                                                        DesignTemplateMappingValue={this.props.Login.masterData.DesignTemplateMappingValue || {}}
                                                        onSampleTypeChange={this.onSampleTypeChange}
                                                        onRegTypeChange={this.onRegTypeChange}
                                                        onRegSubTypeChange={this.onRegSubTypeChange}
                                                        onSchedulerConfigTypeChange={this.onSchedulerConfigTypeChange}
                                                        onFilterChange={this.onFilterChange}
                                                        onApprovalConfigVersionChange={this.onApprovalConfigVersionChange}
                                                        onDesignTemplateChange={this.onDesignTemplateChange}
                                                    />
                                                }
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <div style={
                                            // this.state.showTest === true || this.state.showSubSample === true ?
                                            { display: "block" }
                                            // : 
                                            // { display: "none" }
                                        } >
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
                                                {this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}
                                            </h4>
                                            {this.state.activeTabIndex && this.state.activeTabIndex === 1 ? this.sideNavDetail("IDS_PARAMETERS") : ""}
                                        </div>
                                        {/* } */}
                                      
                                   
            
                                     
                                    </div>
                                    <div className='tab-head'>
                                        <ul>
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 4 ? 'active' : ""}`} onClick={() => this.changePropertyView(4)}>
                                                <FontAwesomeIcon icon={faEye} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_SAMPLEDETAILS" })}
                                                </span>
                                            </li>
                                         
                                            {/* {this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE && */}
                                            <li className={`${this.state.activeTabIndex && this.state.activeTabIndex === 1 ? 'active' : ""}`} onClick={() => this.changePropertyView(1)}>
                                                <FontAwesomeIcon icon={faFileInvoice}
                                                    //   data-for="tooltip-common-wrap"
                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })} />
                                                <span>
                                                    {this.props.intl.formatMessage({ id: "IDS_PARAMETERS" })}
                                                </span>
                                            </li>
                                            {/* } */}
                                        
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
                </ListWrapper>

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
                                siteList={this.props.Login.siteList ||[]}
                                schedulerList={this.props.Login.schedulerList ||[]}
                                scheduleMasterDetails={this.props.Login.masterData.ScheduleMasterDetails ||[]}                                
                                nschedulerconfigtypecode={this.props.Login.masterData.RealSchedulerConfigTypeValue&&this.props.Login.masterData.RealSchedulerConfigTypeValue.nschedulerconfigtypecode || -1}                                   
                                //  specBasedComponent={this.state.specBasedComponent}
                                mandatoryFields={[
                                    { "idsName": "IDS_PRODUCTCATEGORY", "dataField": "nproductcatcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                                    { "idsName": "IDS_PRODUCTNAME", "dataField": "sproductname", "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }]}
                            />
                        </PortalModal>
                        : ""
                }

{
                    (this.props.Login.openModal) &&
                    <SlideOutModal show={this.props.Login.openModal }
                        //|| this.props.Login.loadEsign}
                        closeModal={
                          
                                this.props.Login.loadScheduleSubSample||this.props.Login.loadChildTest
                                ? this.closeChildModal
                                    : this.closeModal}
                        hideSave={ false}
                        size={this.props.Login.parentPopUpSize}
                        loginoperation={false}
                        buttonLabel={ undefined}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={ this.props.Login.screenName}
                        esign={this.props.Login.loadEsign}
                        innerPopup={this.props.Login.loadComponent}
                        onSaveClick={this.props.Login.loadScheduleSubSample ?   this.onSaveSubSampleClick :this.props.Login.loadChildTest ? this.onSaveChildTestClick: this.onSaveClick}
                        validateEsign={this.validateEsign}
                        showSaveContinue={this.props.Login.showSaveContinue}
                        selectedRecord={this.state.selectedRecord}
                        mandatoryFields={
                             this.mandatoryList(this.props.Login.loadScheduleSubSample)}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.loadScheduleSubSample ?
                                                <AddSubSampleConfiguration
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
                                               :this.props.Login.loadChildTest ?
                                               <AddTestSchedulerConfig
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
                                                   />
                                                 : ""
                            //  End of ALPD-4130 Additional Filter Component -ATE-241
                        }
                    />
                }
            </>
        );
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
        if (this.props.Login !== previousProps.Login) {
            this.PrevoiusLoginData = previousProps
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

            const addSchedulerConfigurationId = controlMap.has("AddSchedulerConfiguration") ? controlMap.get("AddSchedulerConfiguration").ncontrolcode : -1;
            const addSubSampleSchedulerConfigurationId = controlMap.has("AddSubSampleSchedulerConfiguration") ? controlMap.get("AddSubSampleSchedulerConfiguration").ncontrolcode : -1;
            const editSubSampleSchedulerConfigurationId = controlMap.has("EditSubSampleSchedulerConfiguration") ? controlMap.get("EditSubSampleSchedulerConfiguration").ncontrolcode : -1;
            const deleteSubSampleSchedulerConfigurationId = controlMap.has("DeleteSubSampleSchedulerConfiguration") ? controlMap.get("DeleteSubSampleSchedulerConfiguration").ncontrolcode : -1;
            const addTestSchedulerConfigurationId = controlMap.has("AddTestSchedulerConfiguration") ? controlMap.get("AddTestSchedulerConfiguration").ncontrolcode : -1;
            const deleteTestSchedulerConfigurationId = controlMap.has("DeleteTestSchedulerConfiguration") ? controlMap.get("DeleteTestSchedulerConfiguration").ncontrolcode : -1;
            const editSchedulerConfigId = controlMap.has("EditSchedulerConfiguration") ? controlMap.get("EditSchedulerConfiguration").ncontrolcode : -1;
            const approveSchedulerConfigurationId = controlMap.has("ApproveSchedulerConfiguration") ? controlMap.get("ApproveSchedulerConfiguration").ncontrolcode : -1;
            const deleteSchedulerConfigurationId = controlMap.has("DeleteSchedulerConfiguration") ? controlMap.get("DeleteSchedulerConfiguration").ncontrolcode : -1;
            const activeInactiveSchedulerConfigurationId = controlMap.has("ActiveInActiveSchedulerConfiguration") ? controlMap.get("ActiveInActiveSchedulerConfiguration").ncontrolcode : -1;

            this.setState({
                activeInactiveSchedulerConfigurationId,deleteSchedulerConfigurationId,approveSchedulerConfigurationId,editSchedulerConfigId,deleteTestSchedulerConfigurationId,addTestSchedulerConfigurationId,deleteSubSampleSchedulerConfigurationId,userRoleControlRights, controlMap, addSchedulerConfigurationId,addSubSampleSchedulerConfigurationId,editSubSampleSchedulerConfigurationId
            });

        }
        let activeTabIndex = this.state.activeTabIndex || undefined;
        let activeTabId = this.state.activeTabId || undefined;
        if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex || this.props.Login.masterData !== previousProps.Login.masterData) {
             let { skip, take, testskip, testtake, subsampleskip, subsampletake,DynamicSampleColumns, DynamicSubSampleColumns,
                DynamicTestColumns, DynamicGridItem, DynamicGridMoreField, SingleItem, testMoreField, testListColumns,
                SubSampleDynamicGridItem, SubSampleDynamicGridMoreField, SubSampleSingleItem, sampleSearchField, subsampleSearchField,
                testSearchField, testAttachmentDataState, registrationTestHistoryDataState, sampleCommentDataState,
                sampledateconstraints, subsampledateconstraints, activeTabIndex,
                activeTabId, sampleCombinationUnique, subsampleCombinationUnique,
                addedOrderSampleList, sampleexportfields, subsampleexportfields, samplefilteritem, sampledisplayfields} = this.state

            let stateSampleType = this.state.stateSampleType;
            let stateRegistrationType = this.state.stateRegistrationType;
            let stateRegistrationSubType = this.state.stateRegistrationSubType;
            let stateSchedulerConfigType = this.state.stateSchedulerConfigType;
            let stateFilterStatus = this.state.stateFilterStatus;
            let stateApprovalConfigVersion = this.state.stateApprovalConfigVersion;
            let stateDynamicDesign = this.state.stateDynamicDesign;


            if (this.props.Login.activeTabIndex !== previousProps.Login.activeTabIndex) {
                activeTabIndex = this.props.Login.activeTabIndex;
                activeTabId = this.props.Login.activeTabId;
            }
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

            if (this.props.Login.masterData.SchedulerConfigType !== previousProps.Login.masterData.SchedulerConfigType) {
                const schedulerConfigTypeMap = constructOptionList(this.props.Login.masterData.SchedulerConfigType || [], "nschedulerconfigtypecode",
                    "sschedulerconfigtypename", "nschedulerconfigtypecode", "ascending", false);
                stateSchedulerConfigType = schedulerConfigTypeMap.get("OptionList")
            }

            if (this.props.Login.masterData.FilterStatus !== previousProps.Login.masterData.FilterStatus) {
                const filterStatusMap = constructOptionList(this.props.Login.masterData.FilterStatus || [], "ntransactionstatus",
                    "stransdisplaystatus", "ntransactionstatus", "ascending", false);
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
            const subSampleGetParam = {
                masterData: this.props.Login.masterData,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
                activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
              
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedsubsample
            }
            if (this.props.Login.masterData.DynamicDesign && this.props.Login.masterData.DynamicDesign !== previousProps.Login.masterData.DynamicDesign) {
                const dynamicColumn = JSON.parse(this.props.Login.masterData.DynamicDesign.jsondata.value)
                DynamicSampleColumns = dynamicColumn.samplelistitem ? dynamicColumn.samplelistitem : [];
                DynamicSampleColumns.push({
                    [designProperties.LABEL]: { 'en-US': 'Scheduler' }, [designProperties.VALUE]: 'SchedulerMaster' }
                );
                DynamicSampleColumns = DynamicSampleColumns.filter(item => item[designProperties.VALUE] !== this.sinstrumentid);
                if(this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode==2){
                    DynamicSampleColumns.unshift({ [designProperties.LABEL]: { 'en-US': 'Site' },[designProperties.VALUE]: 'SchedulerSite' });

                }
                DynamicSubSampleColumns = dynamicColumn.subsamplelistitem ? dynamicColumn.subsamplelistitem : [];
                DynamicTestColumns = dynamicColumn.testlistitem ? dynamicColumn.testlistitem : []
                DynamicGridItem = dynamicColumn.samplegriditem ? dynamicColumn.samplegriditem : [];
                DynamicGridMoreField = dynamicColumn.samplegridmoreitem ? dynamicColumn.samplegridmoreitem : [];
                SingleItem = dynamicColumn.sampledisplayfields ? dynamicColumn.sampledisplayfields : [];
                SingleItem= SingleItem.filter(item => item[2] !== 'sarno'&&item[2] !== 'dregdate');
                

                SingleItem.push({
                    [designProperties.LABEL]: { 'en-US': 'Scheduler' }, [designProperties.VALUE]: 'SchedulerMaster' }
                );
                if(this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode==2){
                    SingleItem.unshift({ [designProperties.LABEL]: { 'en-US': 'Site' }, [designProperties.VALUE]: 'SchedulerSite' });

                }
                
                SubSampleDynamicGridItem = dynamicColumn.subsamplegriditem ? dynamicColumn.subsamplegriditem : [];
                SubSampleDynamicGridMoreField = dynamicColumn.subsamplegridmoreitem ? dynamicColumn.subsamplegridmoreitem : [];
                SubSampleSingleItem = dynamicColumn.subsampledisplayfields ? dynamicColumn.subsampledisplayfields : [];
                testMoreField = dynamicColumn.testListFields.testlistmoreitems ? dynamicColumn.testListFields.testlistmoreitems : [];
                testListColumns = dynamicColumn.testListFields.testlistitem ? dynamicColumn.testListFields.testlistitem : [];
                testListColumns=testListColumns.filter(item=>item[designProperties.VALUE]!=='ssamplearno'&&item[designProperties.VALUE]!=='sarno'&&item[designProperties.VALUE]!=='AnalyserName');
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



            }

            const editSchedulerSampleParam = {
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
                    this.props.Login.masterData.RegSubTypeValue.nneedsubsample, 
               
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
                checkBoxOperation: checkBoxOperation.SINGLESELECT

            }

            const deleteSchedulerSampleParam={
                //nschedulersamplecode:addSampleList && addSampleList.map(sample => sample.nschedulersamplecode).join(","),
                userinfo: this.props.Login.userInfo,
                nneedsubsamp:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                ndesigntemplatemappingcode :this.props.Login.masterData.DesignTemplateMappingValue &&this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue&&this.props.Login.masterData.RealRegTypeValue.nregtypecode||-1,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue&&this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode ||-1,
                nregsubtypeversioncode:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode,
                nfilterstatus:this.props.Login.masterData?.RealFilterStatusValue?.ntransactionstatus === 0
                ? this.props.Login.masterData?.FilterStatus?.map(item => item.ntransactionstatus).join(",")
                : this.props.Login.masterData?.FilterStatusValue?.ntransactionstatus || -1,
                nsampleschedulerconfigtypecode:this.props.Login.masterData.SchedulerConfigTypeValue&&this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode,
                napproveconfversioncode:this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode
            }

            const activeInactiveSchedulerSampleParam={
                userinfo: this.props.Login.userInfo,
                nneedsubsamp:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                ndesigntemplatemappingcode :this.props.Login.masterData.DesignTemplateMappingValue &&this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue&&this.props.Login.masterData.RealRegTypeValue.nregtypecode||-1,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue&&this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode ||-1,
                nregsubtypeversioncode:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode,
                nfilterstatus:this.props.Login.masterData?.RealFilterStatusValue?.ntransactionstatus === 0
                ? this.props.Login.masterData?.FilterStatus?.map(item => item.ntransactionstatus).join(",")
                : this.props.Login.masterData?.FilterStatusValue?.ntransactionstatus || -1,
                nsampleschedulerconfigtypecode:this.props.Login.masterData.SchedulerConfigTypeValue&&this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode,
                napproveconfversioncode:this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode
                
           
            }

            const approveSchedulerSampleParam = {
               // nfilterstatus: this.props.Login.masterData && this.props.Login.masterData.RealFilterStatusValue&&this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus&& this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus==0 ? this.props.Login.masterData.FilterStatus.map(item =>item.ntransactionstatus).join(",") :this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus,
               nfilterstatus:this.props.Login.masterData?.RealFilterStatusValue?.ntransactionstatus === 0
    ? this.props.Login.masterData?.FilterStatus?.map(item => item.ntransactionstatus).join(",")
    : this.props.Login.masterData?.FilterStatusValue?.ntransactionstatus || -1,

               filterStatus:this.props.Login.masterData.FilterStatus&&this.props.Login.masterData.FilterStatus,
               userinfo: this.props.Login.userInfo,
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                sfromdate: this.props.Login.masterData.RealFromDate,
                stodate: this.props.Login.masterData.RealToDate,
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                    && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                nneedsubsample: this.props.Login.masterData.RegSubTypeValue &&
                    this.props.Login.masterData.RegSubTypeValue.nneedsubsample, 
                nregsubtypeversioncode:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode,
                nsampleschedulerconfigtypecode: this.   props.Login.masterData && this.props.Login.masterData.RealSchedulerConfigTypeValue
                    && this.props.Login.masterData.RealSchedulerConfigTypeValue.nsampleschedulerconfigtypecode,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
                checkBoxOperation: checkBoxOperation.SINGLESELECT,
                sinstrumentidLabel:this.sinstrumentid,
// ALPD-5332 Added by Abdul for Material Scheduler
                nschedulerconfigtypecode: this.props.Login.masterData && this.props.Login.masterData.RealSchedulerConfigTypeValue
                && this.props.Login.masterData.RealSchedulerConfigTypeValue.nschedulerconfigtypecode,
                
       // ALPD-5332 End        
 //sinstrumentid:this.props.Login.masterData.selectedSample[0][this.sinstrumentid]


            }

            const testGetParam = {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
                activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
                nschedulersamplecode: this.props.Login.masterData.selectedSample &&
                    this.props.Login.masterData.selectedSample.map(sample => sample.nschedulersamplecode).join(","),
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

                 const editSubSampleSchedulerParam = {
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
    
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
                    activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
                    activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
                }

            const testChildGetParam = {
                masterData: this.props.Login.masterData,
                userinfo: this.props.Login.userInfo,
                ntransactionstatus: String(this.props.Login.masterData.RealFilterStatusValue && this.props.Login.masterData.RealFilterStatusValue.ntransactionstatus),
                nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
               // activeSampleTab: this.props.Login.activeTestTab || "IDS_SAMPLEATTACHMENTS",
                //activeSubSampleTab: this.props.Login.activeTestTab || "IDS_SUBSAMPLEATTACHMENTS",
                nschedulersamplecode: this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.map(sample => sample.nschedulersamplecode).join(","),
                nschedulersubsamplecode: this.props.Login.masterData.selectedSubSample &&
                    this.props.Login.masterData.selectedSubSample.map(sample => sample.nschedulersubsamplecode).join(","),
                nschedulertestcode: this.props.Login.masterData.selectedTest &&
                    this.props.Login.masterData.selectedTest.map(sample => sample.nschedulertestcode).join(","),
             
              
                ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                    && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                activeTabIndex: this.state.enableAutoClick ? 1 : this.state.activeTabIndex ? this.state.activeTabIndex : undefined,

            }

            const addTestParam = {
                selectedSample: this.props.Login.masterData.selectedSample,
                selectedSubSample: this.props.Login.masterData.selectedSubSample,
                // skip: skip, take: (skip + take),
                userinfo: this.props.Login.userInfo,
                sampleList: this.props.Login.masterData.SchedulerConfigGetSample,
                subsampleList: this.props.Login.masterData.SchedulerConfigGetSubSample,
                nspecsampletypecode: this.props.Login.masterData.selectedSubSample &&
                    [...new Set(this.props.Login.masterData.selectedSubSample.map(x => x.nspecsampletypecode))].join(",")
            };
            const filterSubSampleParam = {
                inputListName: "SchedulerConfigGetSubSample",
                selectedObject: "selectedSubSample",
                primaryKeyField: "nschedulersubsamplecode",
                fetchUrl: "schedulerconfiguration/getSchedulerConfigTest",

                skip: this.state.skip,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: 0,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 5,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 5,

                isMultiSort: true,
                multiSortData: [{ pkey: 'nschedulertestcode', list: 'SchedulerConfigGetTest' }],
                //childRefs: [{ ref: this.searchTestRef, childFilteredListName: "searchedSubSample" }],
                fecthInputObject: {
                    
                    masterData: this.props.Login.masterData,
                    userinfo: this.props.Login.userInfo,
                    nsampletypecode: this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
                    nregtypecode: this.props.Login.masterData.RealRegTypeValue && this.props.Login.masterData.RealRegTypeValue.nregtypecode,
                    nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue && this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    nschedulersamplecode: this.props.Login.masterData.selectedSample &&
                        this.props.Login.masterData.selectedSample.map(x => x.nschedulersamplecode).join(",")

                },
                masterData: this.props.Login.masterData,
                searchFieldList: subsampleSearchField,
                changeList: [
                    "SchedulerConfigGetTest", "SchedulerConfigurationParameter",
                  
                    "selectedSubSample", "selectedTest"
                ]
            };
            const filterTestParam = {
                inputListName: "SchedulerConfigGetTest",
                selectedObject: "selectedTest",

                primaryKeyField: "nschedulertestcode",
                fetchUrl: this.getActiveTestURL(),
                skip: this.state.skip,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: this.state.subsampleskip,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 5,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 5,

                fecthInputObject: {
                    nschedulertestcode: this.props.Login.masterData && this.props.Login.masterData.selectedTest && this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.nschedulertestcode).join(",") : "-1",
                   
                   
                    userinfo: this.props.Login.userInfo,
                    ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                        && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
                    nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
                    nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                        && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
                    // checkBoxOperation: 3,
                    checkBoxOperation: checkBoxOperation.SINGLESELECT,
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS"
                },
                masterData: this.props.Login.masterData,
                searchFieldList: testSearchField,
                changeList: ["SchedulerConfigurationParameter"],
                childTabsKey: ["SchedulerConfigurationParameter"]

            }

            const filterSampleParam = {
                inputListName: "SchedulerConfigGetSample",
                selectedObject: "selectedSample",
                primaryKeyField: "nschedulersamplecode",
                fetchUrl: "schedulerconfiguration/getSchedulerConfigSubSample",

                // isSortable: true,
                // sortValue: 'ntransactionsamplecode',
                // sortList: ['RegistrationGetSubSample'],
                isMultiSort: true,
                multiSortData: [{ pkey: 'nschedulersubsamplecode', list: 'SchedulerConfigGetSubSample' },
                { pkey:'nschedulertestcode', list: 'SchedulerConfigGetTest' }],

                //ALPD-1518
                skip: 0,
                take: this.props.Login.settings && parseInt(this.props.Login.settings[3]),
                subsampleskip: 0,
                subsampletake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 5,
                testskip: 0,
                testtake: this.props.Login.settings && this.props.Login.settings[12] ? this.props.Login.settings[12] : 5,

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
                    activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
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
                    "SchedulerConfigGetSubSample", "SchedulerConfigGetTest",
                    "selectedSample", "selectedSubSample",
                    "selectedTest", "SchedulerConfigurationParameter"
                ]
            };

            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take
            testskip = this.props.Login.testskip === undefined ? testskip : this.props.Login.testskip
            testtake = this.props.Login.testtake || testtake
            subsampleskip = this.props.Login.subsampleskip === undefined ? subsampleskip : this.props.Login.subsampleskip
            subsampletake = this.props.Login.subsampletake || subsampletake
            this.setState({
                activeInactiveSchedulerSampleParam, deleteSchedulerSampleParam,approveSchedulerSampleParam, editSchedulerSampleParam,addTestParam,editSubSampleSchedulerParam,testGetParam, subSampleGetParam,stateSampleType, stateRegistrationType, stateRegistrationSubType, stateSchedulerConfigType, stateFilterStatus, stateApprovalConfigVersion, stateDynamicDesign,
                 skip, take, testskip,sampleSearchField,filterSampleParam,filterTestParam,testSearchField,subsampleSearchField,filterSubSampleParam,
                subsampleskip, subsampletake,testtake,DynamicSampleColumns,testListColumns,testMoreField,DynamicSubSampleColumns,SingleItem,activeTabIndex,activeTabId,DynamicGridMoreField,DynamicGridItem,testChildGetParam
            });
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
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

        this.props.validateEsignforSchedulerConfig(inputParam, "openModal");

    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

       
            selectedRecord[event.target.name] = event.target.value;
        
        this.setState({ selectedRecord });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openPortal = this.props.Login.openPortal;
        let selectedRecord = this.props.Login.selectedRecord;
       let openModal=this.props.Login.openModal;
       let loadPreregister = this.props.Login.loadPreregister;


        if (this.props.Login.loadEsign) {
            
             if((this.props.Login.screenData && this.props.Login.screenData.inputParam && this.props.Login.screenData.inputParam.operation==="approve")
                ||this.props.Login.screenData && this.props.Login.screenData.inputParam && this.props.Login.screenData.inputParam.operation==="deleteSample"
            ||(this.props.Login.screenData && this.props.Login.screenData.inputParam && this.props.Login.screenData.inputParam.operation==="activeInactive")
        
        //ALPD-5496--Vignesh R(28-02-2025)--->Scheduler Configuration-->While Cancel the Esign popup Blank popup Screen Appears
        ||(this.props.Login.screenData && this.props.Login.screenData.inputParam && this.props.Login.screenData.inputParam.action==="deleteSchedulerTest")
        ||(this.props.Login.screenData && this.props.Login.screenData.inputParam && this.props.Login.screenData.inputParam.action==="deleteSubSample")
        ){
                loadEsign = false;
                openModal=false;
                selectedRecord["esigncomments"] = "";
                selectedRecord["esignpassword"] = "";
                selectedRecord['esignreason'] = '';

             
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign, openModal, selectedRecord
                    }
                }
                this.props.updateStore(updateInfo); 
            }
         
            else {
                loadEsign = false;
                selectedRecord["esigncomments"] = "";
                selectedRecord["esignpassword"] = "";
                selectedRecord['esignreason'] = '';

             
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign, openPortal, selectedRecord
                    }
                }
                this.props.updateStore(updateInfo);
            }
        }
        else {
            openPortal = false;
            selectedRecord = {};
            loadPreregister=false;

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openPortal,selectedRecord,loadPreregister
                }
            }
            this.props.updateStore(updateInfo);
        }
    }

    editSchedulerConfiguration = (inputParam) => {
 if(this.props.Login.masterData.selectedSample[0].ntransactionstatus===transactionStatus.DRAFT){

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

            this.props.getEditSchedulerConfigComboService(inputParam,
                data, this.state.selectedRecord, childColumnList,
                comboComponents, withoutCombocomponent, editablecombo)
        } else {
            toast.info("Configure the preregister template for this registrationtype")
        }
    }else{

        toast.warn(this.props.intl.formatMessage({ id: "IDS_DRAFTTOEDITSAMPLE" }))

    }

    }
    approveSchedulerConfiguration = (inputParam) => {
        
     
            if(this.props.Login.masterData.selectedSample.length>0){
                if((this.props.Login.masterData.selectedSample[0].ntransactionstatus!==transactionStatus.APPROVED)&&(this.props.Login.masterData.selectedSample[0].ntransactionstatus!==transactionStatus.RETIRED)){
 
                  
      /* if(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.INSTRUMENT ){            
                let nschedulersamplecodeberfore = inputParam.masterData.SchedulerConfigGetSample
                .filter(item => {
                    return item[this.sinstrumentid] === inputParam.masterData.selectedSample[0][this.sinstrumentid] &&
                        item.ntransactionstatus === transactionStatus.APPROVED;
                })
                .map(item => item.nschedulersamplecode) 
                .join(","); 
                    inputParam={...inputParam,approveSchedulerSampleParam:{
                        
                        ...inputParam.approveSchedulerSampleParam,
                        "nschedulersamplecodeberfore":nschedulersamplecodeberfore
                        
                    },
                action:"approveSample",
                inputData:{
                    "userinfo":this.props.Login.userInfo,
                }
                }
            }*/

           //ALPD-5389--Added by vignesh R(12-02-2025)--Scheduler Configuration--status not updated as 'Retired' in left list until refresh
          //start-ALPD-5389
           let check=false;
           let nprimarykey;
           if(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.INSTRUMENT){
             check=true;
            nprimarykey='ninstrumentcatcode';
           }
           else if(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.MATERIAL){
            check=true;
            nprimarykey='nmaterialcode';
           }
           let nschedulersamplecodeberfore="";
            if(check){
                nschedulersamplecodeberfore= inputParam.masterData.SchedulerConfigGetSample.filter(item => {
                    return item[nprimarykey] === inputParam.masterData.selectedSample[0][nprimarykey] &&
                        item.ntransactionstatus === transactionStatus.APPROVED;
                })
                .map(item => item.nschedulersamplecode) 
                .join(","); 
            }
           // Added by Abdul to fix approve error with esign
                let inputData={
                    "userinfo":this.props.Login.userInfo,
                }
                inputParam= {...inputParam, inputData}
            //  End

            inputParam={...inputParam,approveSchedulerSampleParam:{                       
                    ...inputParam.approveSchedulerSampleParam,"nschedulersamplecodeberfore":nschedulersamplecodeberfore,
                    "napproveconfversioncode":this.props.Login.masterData.RealApprovalConfigVersionValue
                    && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode
                    
                },action:"approveSample",inputData:{
                "userinfo":this.props.Login.userInfo,
            }

            }

         //end-ALPD-5389

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputParam.approveSchedulerSampleParam.ncontrolCode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                                openModal:true,
                                 parentPopUpSize: "lg",
                            }
                        }
                        this.props.updateStore(updateInfo);
                    }
                    else{

                this.props.approveSchedulerConfig(inputParam,this.props.Login.masterData)
                    }    
            }else{
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }))

                }

            }
         else {
            toast.info("Configure the preregister template for this registrationtype")
        }

    }
    getActiveTestURL() {

        let url = "schedulerconfiguration/getSchedulerConfigParameter"

        return url;
    }

    addMoreSchedulerConfigTest = (inputParam, ncontrolCode) => {
        if(this.props.Login.masterData.selectedSample.length>0){
        
        if(this.props.Login.masterData.selectedSample&&this.props.Login.masterData.selectedSample[0].ntransactionstatus===transactionStatus.DRAFT){
        let sampleList = [];
        const skip = this.state.skip;
        const take = this.state.take;
        if (this.props.Login.masterData.searchedSample !== undefined) {

            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.SchedulerConfigGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.SchedulerConfigGetSample &&this.props.Login.masterData.SchedulerConfigGetSample.slice(skip, skip + take);
        }
        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "nschedulersamplecode");

        if (addSubSampleList && addSubSampleList.length > 0) {

            inputParam["sampleList"] = sampleList;
            this.props.addMoreSchedulerConfigTest(inputParam, ncontrolCode);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLETOADDTEST" }));
        }
    }
    else {
        toast.info(this.props.intl.formatMessage({ id: "IDS_DRAFTTOADDTEST" }));
    }
}else{
    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLE" }));

}
    }

    ConfirmDelete = (deleteId,skip, take, subsampleskip, subsampletake) => {
        if(this.props.Login.masterData.selectedSubSample&&this.props.Login.masterData.selectedSubSample.length>0){
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteSubSample(deleteId,skip,take,subsampleskip,subsampletake));
        }
        else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSUBSAMPLE" }));

        }
    }

    ConfirmTestDelete = (deleteId,skip, take, subsampleskip, subsampletake) => {

        if(this.props.Login.masterData.selectedTest&&this.props.Login.masterData.selectedTest.length>0){

        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteTest(deleteId,skip,take,subsampleskip,subsampletake));
        }
        else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
    
        }
    }
    ConfirmSampleDelete = (inputParam) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteSample(inputParam));
    }
    updateSchedulerConfigSubSample(saveType, formRef, operation, flag) {
        const inputData = { userinfo: this.props.Login.userInfo };

        let initialParam = {
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode,
          
            nflag: 2,
            ntype: 5,
            nschedulersamplecode: String(this.state.selectedRecord.nschedulersamplecode),
            nschedulersubsamplecode: String(this.state.selectedRecord.nschedulersubsamplecode),
            ndesigntemplatemappingcode: this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            // checkBoxOperation: 3,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",


            // activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            // activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS"
        }

        inputData["initialparam"] = initialParam;
        // inputData["samplebeforeedit"] = JSON.parse(JSON.stringify(this.props.Login.regRecordToEdit));
        //inputData["registration"] = JSON.parse(JSON.stringify(this.state.selectedRecord));
        const param = getRegistrationSubSample(
            this.state.selectedRecord,
            this.props.Login.masterData.SubSampleTemplate.jsondata,
            this.props.Login.userInfo, this.props.Login.defaulttimezone, false, this.props.Login.specBasedComponent,
            undefined, operation);

        inputData["schedulersample"] = param.sampleRegistration

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
        inputData["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERS";
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
            methodUrl: "SchedulerConfigSubSample",
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
                    openModal:true,
                    saveType, parentPopUpSize: "lg",
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            //this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            this.props.updateSchedulerConfigSubSample(inputParam,
                this.props.Login.masterData, "openModal");
        }
    }


    closeChildModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let loadScheduleSubSample = this.props.Login.loadScheduleSubSample;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.state.selectedRecord;
        let screenName = this.props.Login.screenName;
        let loadChildTest = this.props.Login.loadChildTest;
        let TestCombined = [];
        let TestPackage = [];
        let availableTest = [];
        let Test = this.props.Login.Test || [];
        if (this.props.Login.loadEsign) {
            loadEsign = false;
            selectedRecord["esigncomments"] = "";
            selectedRecord["esignpassword"] = "";
            selectedRecord['esignreason'] = '';
        }

         if (this.props.Login.loadScheduleSubSample) {
            loadScheduleSubSample = false;
            openModal = false;
            selectedRecord = {}
        }   else if (this.props.Login.loadChildTest) {
            loadChildTest = false;
            openModal = false;
            selectedRecord = {};
            TestCombined = [];
            TestPackage = [];
            availableTest = [];
            Test = [];

        }
      
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                loadScheduleSubSample, screenName, 
                openModal,
                selectedRecord,
                loadEsign,
                loadChildTest,
                TestCombined,
                TestPackage,
                availableTest ,
                Test
            }
        }
        this.props.updateStore(updateInfo);
    }

    editSubSampleScheduler = (inputParam) => {
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

                this.props.getEditSchedulerSubSampleComboService(inputParam,
                    data, this.state.selectedRecord, regSubSamplechildColumnList,
                    regSubSamplecomboComponents, regSubSamplewithoutCombocomponent,
                    sampleList[0].ncomponentrequired === 3 ? true : false)
            } else {
                toast.info("Configure the sub sample template for this registrationtype")
            }
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
                : this.props.Login.masterData.SchedulerConfigGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];
        } else {
            sampleList = this.props.Login.masterData.SchedulerConfigGetSample && this.props.Login.masterData.SchedulerConfigGetSample.slice(skip, skip + take);
        }
        const selectedSample = getSameRecordFromTwoArrays(masterData.selectedSample, sampleList, "nschedulersamplecode");


        let subsampleList = [];
        const subsampleskip = this.state.subsampleskip;
        const subsampletake = this.state.subsampletake;
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.GetSubSample;

            subsampleList = list ? list.slice(subsampleskip, subsampleskip + subsampletake) : [];
        } else {
            subsampleList = this.props.Login.masterData.SchedulerConfigGetSubSample && this.props.Login.masterData.SchedulerConfigGetSubSample.slice(subsampleskip, subsampleskip + subsampletake);
        }
        const selectedSubsample = getSameRecordFromTwoArrays(masterData.selectedSubSample, subsampleList, "nschedulersamplecode");


        //const selectedSubsample = getSameRecordFromTwoArrays(masterData.selectedSubSample, masterData.RegistrationGetSubSample.slice(this.state.subsampleskip, (this.state.subsampleskip + this.state.subsampletake)), "npreregno");
        //const selectedSample = getSameRecordFromTwoArrays(masterData.selectedSample, masterData.RegistrationGetSample.slice(this.state.skip, (this.state.skip + this.state.take)), "npreregno");
        ////  selectedSubsample =masterData.selectedSubSample.slice(this.state.skip, (this.state.skip + this.state.take));


        const nschedulersubsamplecode = selectedSubsample.map(x => x.nschedulersubsamplecode).join(",");
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
                data.push({ "npreregno": parseInt(item.npreregno), "nage": ageCal, "ngendercode": item.ngendercode })
            }
            )

        }
        const inputData = {
            testgrouptest: this.state.selectedRecord.ntestgrouptestcode.map(value => value.item),
            RegistrationSample: selectedSubsample.map(x => x.ntransactionsamplecode),
            nschedulersubsamplecode: nschedulersubsamplecode,
            userinfo: this.props.Login.userInfo,
            nregtypecode: masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: masterData.RealRegSubTypeValue.nregsubtypecode,
            nsampletypecode: masterData.RealSampleTypeValue.nsampletypecode,
            ntype: 3,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            nschedulersamplecode: selectedSample &&
            selectedSample.map(sample => sample.nschedulersamplecode).join(","),
            directAddTest:true,
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
            activeTestTab: this.props.Login.activeTestTab || "IDS_PARAMETERS",
            activeSampleTab: this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS",
            activeSubSampleTab: this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS",
            ageData: data,
            nsampletypecode: this.props.Login.masterData.RealSampleTypeValue.nsampletypecode,
            ntestpackagecode: this.state.selectedRecord['ntestpackagecode'] && this.state.selectedRecord['ntestpackagecode'],
            skipmethodvalidity: false,
            loadAdhocTest: false,
            isParameter:true

        }


        const inputParam = {
            inputData,
            classUrl: "schedulerconfiguration",
            operation: this.props.Login.operation,
            methodUrl: "Test",
            responseKeyList: [
                { "responseKey": "selectedSample", "masterDataKey": "SchedulerConfigGetSample", "primaryKey": "npreregno", "dataAction": "update" },
                { "responseKey": "selectedSubSample", "masterDataKey": "SchedulerConfigGetSubSample", "primaryKey": "ntransactionsamplecode", "dataAction": "update" },
                { "responseKey": "selectedTest", "masterDataKey": "SchedulerConfigGetSubSample", "primaryKey": "ntransactiontestcode", "dataAction": "add" }],
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
            this.props.createSchedulerTest(inputParam, masterData, "openModal");
        }
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
                    : sortDataForDate(this.props.Login.masterData.SchedulerConfigGetSample, 'dtransactiondate', 'nschedulersamplecode');

                sampleList = list ? list.slice(this.state.skip, this.state.skip + this.state.take) : [];
            } else {
                sampleList = this.props.Login.masterData.SchedulerConfigGetSample && sortDataForDate(this.props.Login.masterData.SchedulerConfigGetSample, 'dtransactiondate', 'nschedulersamplecode').slice(this.state.skip, this.state.skip + this.state.take);
            }
            sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.selectedSample, sampleList, 'nschedulersamplecode')

            const findSampleAlloSpec = [...new Set(sampleList.map(item => item.nallottedspeccode))];
            const findSampleAlloSpecSampleType = [...new Set(sampleList.map(item => item.nspecsampletypecode))];

            let selectedTestData = objSubSample["ntestgrouptestcode"];
            const selectedTestArray = [];
            selectedTestData && selectedTestData.map((item) => {
                return selectedTestArray.push(item.item);
            });

            
            const map = {}
            const param = getRegistrationSubSample(
                objSubSample,
                this.props.Login.masterData.SubSampleTemplate.jsondata,
                this.props.Login.userInfo, this.props.Login.defaulttimezone, false,
                this.props.Login.specBasedComponent, operation);

            map["SchedulerConfigurationSample"] = param.sampleRegistration
            if (this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
                map["SchedulerConfigurationSample"]['jsondata'] = { ...map["SchedulerConfigurationSample"]['jsondata'], externalorderid: sampleList[0]['Order'] }
                map["SchedulerConfigurationSample"]['jsonuidata'] = { ...map["SchedulerConfigurationSample"]['jsonuidata'], externalorderid: sampleList[0]['Order'] }
            }
            map["subsampleDateList"] = param.dateList
            map["SchedulerConfigurationSample"]["nallottedspeccode"] = findSampleAlloSpec[0] ? findSampleAlloSpec[0] : -1;
            map["SchedulerConfigurationSample"]["nspecsampletypecode"] = findSampleAlloSpecSampleType[0] ? findSampleAlloSpecSampleType[0] : -1;

            map["subsamplecombinationunique"] = this.state.subsampleCombinationUnique;
            map['subsampledateconstraints'] = this.state.subsampledateconstraints;
            map['testgrouptest'] = selectedTestArray
            map['nschedulersamplecode'] = sampleList.map(item => item.nschedulersamplecode).join(",")
            map['userinfo'] = userInfo;
            map['checkBoxOperation'] = checkBoxOperation.SINGLESELECT;
            map['ntype'] = 3;
            map["ndesigntemplatemappingcode"] = this.props.Login.masterData.RealDesignTemplateMappingValue
                && this.props.Login.masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
            map["napproveconfversioncode"] = this.props.Login.masterData.RealApprovalConfigVersionValue
                && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode;
            map["nregsubtypeversioncode"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode;

            map["nneedtemplatebasedflow"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow;
            map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
      

            map["masterData"] = this.props.Login.masterData;
            map["activeTestTab"] = this.props.Login.activeTestTab || "IDS_PARAMETERS";
            map["activeSampleTab"] = this.props.Login.activeSampleTab || "IDS_SAMPLEATTACHMENTS";
            map["activeSubSampleTab"] = this.props.Login.activeSubSampleTab || "IDS_SUBSAMPLEATTACHMENTS";
            map["specBasedComponent"] = this.props.Login.specBasedComponent;
            map["nsampletypecode"] = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
            map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
            map["nregsubtypecode"] = this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
          
            map["nfilterstatus"] = this.props.Login.masterData.FilterStatusValue.ntransactionstatus;

            map["isParameter"] = true;

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
                    data.push({ "npreregno": parseInt(item.npreregno), "nage": age, "ngendercode": item.ngendercode });
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

            this.props.saveSchedulerSubSample(inputParam);
        } else {
            this.updateSchedulerConfigSubSample(saveType, formRef, operation);
        }
    }

    






    onComboChange = (comboData, fieldName) => {
       
        const selectedRecord = this.state.selectedRecord || {};
      
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
       
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

    onInputOnSubSampleChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onComboSubSampleChange = (comboData, fieldName) => {
        // if (comboData !== null) {
        
        const selectedRecord = this.state.selectedRecord || {};
      
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord  });
        
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
    mandatoryList = ( regSubSample) => {
        let mandatory = [];
         if (regSubSample) {

            let sampleList = [];
            const skip = this.state.skip
            const take = this.state.take
            if (this.props.Login.masterData.searchedSample !== undefined) {
                //sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
                const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                    : this.props.Login.masterData.SchedulerConfigGetSample;

                sampleList = list ? list.slice(skip, skip + take) : [];
            } else {
                sampleList = this.props.Login.masterData.SchedulerConfigGetSample && this.props.Login.masterData.SchedulerConfigGetSample.slice(skip, skip + take);
            }

            let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "nschedulersamplecode");
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
          
        }
       
        return mandatory;
    }
    addSubSample = (controlcode, skip, take) => {
if(this.props.Login.masterData.selectedSample.length>0){
        if(this.props.Login.masterData.selectedSample&&this.props.Login.masterData.selectedSample[0].ntransactionstatus===transactionStatus.DRAFT){
        let Map = {};
        let sampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.SchedulerConfigGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];

        } else {
            sampleList = this.props.Login.masterData.SchedulerConfigGetSample && sortDataForDate(this.props.Login.masterData.SchedulerConfigGetSample, 'dtransactiondate',"nschedulersamplecode").slice(skip, skip + take);
        }

        let addSubSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "nschedulersamplecode");

        const nsampletypecode = this.props.Login.masterData.RealSampleTypeValue.nsampletypecode;
        let check = true;
        if (nsampletypecode === SampleType.CLINICALTYPE && addSubSampleList.length > 1) {
            check = false
        }
        
            const findTransactionStatus = [...new Set(addSubSampleList.map(item => item.ntransactionstatus))];

           // if (findTransactionStatus.length === 1) {
                // if (findTransactionStatus.indexOf(transactionStatus.REJECT) === -1
                //     && findTransactionStatus.indexOf(transactionStatus.CANCELLED) === -1
                //     && findTransactionStatus.indexOf(transactionStatus.RELEASED) === -1) {
                    // if (findTransactionStatus[0] === transactionStatus.PREREGISTER) {
                    //   const findApprovalVersion = [...new Set(addSubSampleList.map(item => item.napprovalversioncode))];
                    //   if (findApprovalVersion.length === 1) {
                    const findSampleSpec = [...new Set(addSubSampleList.map(item => item.nallottedspeccode))];
                    //const findComponentReqSpec = [...new Set(addSubSampleList.map(item => item.ncomponentrequired))];
                    const findSampleSpectemplate = [...new Set(addSubSampleList.map(item => item.ntemplatemanipulationcode))];
                    //const findComponent = [...new Set(selectsubsample.map(item => item.ncomponentcode))];
                    //if (findSampleSpec.length === 1)//&& findComponent.length === 1 
                   // {
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
                            Map["nregtypecode"] = this.props.Login.masterData.RealRegTypeValue.nregtypecode;
                            Map["nneedsubsample"] = this.props.Login.masterData.RegSubTypeValue
                                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
                            Map["nschedulersamplecode"] = addSubSampleList &&
                                addSubSampleList.map(sample => sample.nschedulersamplecode).join(",");
                            Map["schedulersubsample"] = addSubSampleList;
                            // console.log("spec jsx main:", findComponentReqSpec,findSampleSpec[0] );
                            this.props.addsubSampleSchedulerConfiguration(this.props.Login.masterData,
                                this.props.Login.userInfo, data, this.state.selectedRecord,
                                regchildColumnList, regSubSamplecomboComponents,
                                regSubSamplewithoutCombocomponent,
                                Map, controlcode, findComponentReqSpec === 3 ? true : false, this.state.specBasedTestPackage)
                        } else {
                            toast.info(this.props.intl.formatMessage({ id: "IDS_PLEASECONFIGURETHESUBSAMPLETEMPLATE" }));
                        }
                    }else{
                        toast.info(this.props.intl.formatMessage({ id: "IDS_DRAFTTOADDSUBSAMPLE" }));

                    }
                   // } 
                }
                // }
                 else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLES" }));
                 }
          //  }
            
       
    }
    deleteSample=(inputParam) => {

        if(this.props.Login.masterData.selectedSample!==undefined ){
            let valid=false;
             valid = this.props.Login.masterData&&this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.some(item => item.ntransactionstatus !== transactionStatus.DRAFT);

            if(!valid){
      /*  let Map = {};
        let sampleList = [];
        let subsampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.SchedulerConfigGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];

        } else {
            sampleList = this.props.Login.masterData.SchedulerConfigGetSample && this.props.Login.masterData.SchedulerConfigGetSample.slice(skip, skip + take);
        }
        
        
        let addSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "nschedulersamplecode");
        Map["nschedulersamplecode"]=addSampleList && addSampleList.map(sample => sample.nschedulersamplecode).join(",");
        Map["nneedsubsample"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
        Map["ndesigntemplatemappingcode"] =this.props.Login.masterData.DesignTemplateMappingValue &&this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["checkBoxOperation"]= checkBoxOperation.SINGLESELECT;
        Map["nregtypecode"]= this.props.Login.masterData.RealRegTypeValue.nregtypecode;
        Map["nregsubtypecode"]= this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
        Map["nregsubtypeversioncode"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode;
        Map["nfilterstatus"]= this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus==0 ? this.props.Login.masterData.FilterStatus.map(item =>item.ntransactionstatus).join(",") :this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
        Map["nsampleschedulerconfigtypecode"]=this.props.Login.masterData.SchedulerConfigTypeValue&&this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode
        */
        let inputParam1={
        action:"deleteSample",
        operation:"deleteSample",
        Map:inputParam,
        inputData:{
            "userinfo":this.props.Login.userInfo,
        },
        ncontrolCode:this.state.deleteSubSampleSchedulerConfigurationId
       };
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.deleteSubSampleSchedulerConfigurationId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam:inputParam1,masterData:this.props.Login.masterData },
                    openModal:true
                }
            }
            this.props.updateStore(updateInfo);
        }else{

        this.props.deleteSchedulerConfig(inputParam,this.props.Login.masterData);
        }
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_DRAFTTODELETESAMPLE" }));

    }
}else{
    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTSTATUSONLY" }));

}

    }

    onInactiveActive=(inputParam) => {

        if(this.props.Login.masterData.selectedSample!==undefined ){
          
        if(inputParam.selectedSample.length==1){

            if(inputParam.selectedSample[0].ntransactionstatus===transactionStatus.APPROVED){
       
     /*   let Map = {};
        
        
        
        
        Map["nschedulersamplecode"]=this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample[0].nschedulersamplecode;
        Map["ndesigntemplatemappingcode"] =this.props.Login.masterData.DesignTemplateMappingValue &&this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["checkBoxOperation"]= checkBoxOperation.SINGLESELECT;
        Map["nregtypecode"]= this.props.Login.masterData.RealRegTypeValue.nregtypecode;
        Map["nregsubtypecode"]= this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
        Map["nregsubtypeversioncode"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode;
        Map["nfilterstatus"]= this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus==0 ? this.props.Login.masterData.FilterStatus.map(item =>item.ntransactionstatus).join(",") :this.props.Login.masterData.FilterStatusValue.ntransactionstatus;
        Map["nsampleschedulerconfigtypecode"]=this.props.Login.masterData.SchedulerConfigTypeValue&&this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode
        Map["nactivestatus"]=this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample[0].nactivestatus;
        Map["nneedsubsample"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
 d
        let inputParam={
        action:"activeInactive",
        Map:Map,
        inputData:{
            "userinfo":this.props.Login.userInfo,
        },
        ncontrolCode:this.state.deleteSubSampleSchedulerConfigurationId
       };*/

       let inputParam1={
        action:"activeInactive",
        ...inputParam,
        inputData:{
            "userinfo":this.props.Login.userInfo,
        },
        operation:"activeInactive",
        ncontrolCode:this.state.activeInactiveSchedulerConfigurationId
       };
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputParam.activeInactiveSchedulerSampleParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam:inputParam1,masterData:this.props.Login.masterData },
                    openModal:true
                }
            }
            this.props.updateStore(updateInfo);
        }else{

        this.props.updateActiveStatusSchedulerConfig(inputParam);
        }
    }
    else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVERECORD" }));

    }
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONERECORD" }));

    }
}else{
    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" }));

}

    }

    deleteSubSample=(ncontrolcode, skip, take,subsampleskip,subsampletake) => {

        if(this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample[0].ntransactionstatus===transactionStatus.DRAFT){
        let Map = {};
        let sampleList = [];
        let subsampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.SchedulerConfigGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];

        } else {
            sampleList = this.props.Login.masterData.SchedulerConfigGetSample && this.props.Login.masterData.SchedulerConfigGetSample.slice(skip, skip + take);
        }
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.SchedulerConfigGetSubSample;

                subsampleList = list ? list.slice(subsampleskip, subsampleskip + subsampletake) : [];

        } else {
            subsampleList = this.props.Login.masterData.SchedulerConfigGetSubSample &&this.props.Login.masterData.SchedulerConfigGetSubSample.slice(subsampleskip, subsampleskip + subsampletake);
        }
        
        if(this.props.Login.masterData.SchedulerConfigGetSubSample.length==1){
            Map["nschedulersamplecodedelete"]=this.props.Login.masterData.SchedulerConfigGetSubSample["nschedulersamplecode"]
        }
        let addSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "nschedulersamplecode");
        let addSubSampleList = getSameRecordFromTwoArrays(subsampleList || [], this.props.Login.masterData.selectedSubSample, "nschedulersubsamplecode");
        Map["nschedulersamplecode"]=addSampleList && addSampleList.map(sample => sample.nschedulersamplecode).join(",");
        Map["nneedsubsample"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
        Map["ndesigntemplatemappingcode"] =this.props.Login.masterData.DesignTemplateMappingValue &&this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["checkBoxOperation"]= checkBoxOperation.SINGLESELECT;
        Map["nschedulersubsamplecode"]=addSubSampleList &&addSubSampleList.map(subample => subample.nschedulersubsamplecode).join(",");
        Map["nregtypecode"]= this.props.Login.masterData.RealRegTypeValue.nregtypecode;
        Map["nregsubtypecode"]= this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;
       
        let inputParam={
        action:"deleteSubSample",

        Map:Map,
        inputData:{
            "userinfo":this.props.Login.userInfo,
        },
        ncontrolCode:this.state.deleteSubSampleSchedulerConfigurationId
       };
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.deleteSubSampleSchedulerConfigurationId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam,masterData:this.props.Login.masterData },
                    openModal:true
                }
            }
            this.props.updateStore(updateInfo);
        }else{

        this.props.deleteSchedulerSubSample(Map,this.props.Login.userInfo,this.props.Login.masterData,this.state.deleteSubSampleSchedulerConfigurationId);
        }
    }else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_DRAFTTODELETESUBSAMPLE" }));

    }
    }

    deleteTest=(ncontrolcode, skip, take,subsampleskip,subsampletake) => {
        if(this.props.Login.masterData.selectedTest.length>0){
            if(this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample[0].ntransactionstatus===transactionStatus.DRAFT){

        let Map = {};
        let sampleList = [];
        let subsampleList = [];
        if (this.props.Login.masterData.searchedSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSample ? this.props.Login.masterData.searchedSample
                : this.props.Login.masterData.SchedulerConfigGetSample;

            sampleList = list ? list.slice(skip, skip + take) : [];

        } else {
            sampleList = this.props.Login.masterData.SchedulerConfigGetSample && this.props.Login.masterData.SchedulerConfigGetSample.slice(skip, skip + take);
        }
        if (this.props.Login.masterData.searchedSubSample !== undefined) {
            // sampleList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedSample, this.props.Login.masterData.RegistrationGetSample.slice(skip, skip + take), "npreregno");
            const list = this.props.Login.masterData.searchedSubSample ? this.props.Login.masterData.searchedSubSample
                : this.props.Login.masterData.SchedulerConfigGetSubSample;

                subsampleList = list ? list.slice(subsampleskip, subsampleskip + subsampletake) : [];

        } else {
            subsampleList = this.props.Login.masterData.SchedulerConfigGetSubSample &&this.props.Login.masterData.SchedulerConfigGetSubSample.slice(subsampleskip, subsampleskip + subsampletake);
        }
        
        let testList = this.props.Login.masterData.SchedulerConfigGetTest || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "nschedulertestcode");



        let addSampleList = getSameRecordFromTwoArrays(sampleList || [], this.props.Login.masterData.selectedSample, "nschedulersamplecode");
        let addSubSampleList = getSameRecordFromTwoArrays(subsampleList || [], this.props.Login.masterData.selectedSubSample, "nschedulersubsamplecode");
        Map["nschedulersamplecode"]=addSampleList && addSampleList.map(sample => sample.nschedulersamplecode).join(",");
        Map["nneedsubsample"]=this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedsubsample;
        Map["ndesigntemplatemappingcode"] =this.props.Login.masterData.DesignTemplateMappingValue &&this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode;
        Map["checkBoxOperation"]= checkBoxOperation.SINGLESELECT;
        Map["ntype"]= 3;
        Map["nschedulersubsamplecode"]=addSubSampleList &&addSubSampleList.map(subample => subample.nschedulersubsamplecode).join(",");
        Map["nschedulertestcode"]=selectedTestList &&selectedTestList.map(subample => subample.nschedulertestcode).join(",");
        Map["istestschedulerdelete"]=true;
        Map["isParameter"]=true;
        Map["nregtypecode"]= this.props.Login.masterData.RealRegTypeValue.nregtypecode;
        Map["nregsubtypecode"]= this.props.Login.masterData.RealRegSubTypeValue.nregsubtypecode;

        let inputParam={
            action:"deleteSchedulerTest",
            Map:Map,
            inputData:{
                "userinfo":this.props.Login.userInfo,
            },
            ncontrolCode:this.state.deleteTestSchedulerConfigurationId
           };
            if(showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.deleteTestSchedulerConfigurationId)){
                //if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.state.deleteSubSampleSchedulerConfigurationId)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam,masterData:this.props.Login.masterData },
                            openModal:true
                        }
                    }
                    this.props.updateStore(updateInfo);
                }else{
                this.props.deleteSchedulerConfigTest(Map,this.props.Login.userInfo,this.props.Login.masterData,ncontrolcode);
            }
        }else{
            toast.warn(this.props.intl.formatMessage({ id: "IDS_DRAFTTOADDTEST" }));

        }
    }
    else{
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));


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
    testDataStateChange = (event) => {
               
                this.setState({
                    resultDataState: event.dataState
                });

    }
    onTabChange = (tabProps) => {
        const activeTestTab = tabProps.screenName;
        const tabseqno = tabProps.tabSequence;
        if (tabseqno === SideBarSeqno.TEST) {
            let inputData = {
                masterData: this.props.Login.masterData,
                selectedTest: this.props.Login.masterData.selectedTest,
                nschedulertestcode: this.props.Login.masterData.selectedTest ?
                    String(this.props.Login.masterData.selectedTest.map(item => item.nschedulertestcode).join(",")) : "-1",
                    nschedulersamplecode: this.props.Login.masterData.selectedSample ?
                    this.props.Login.masterData.selectedSample.map(item => item.nschedulersamplecode).join(",") : "-1",
                userinfo: this.props.Login.userInfo,
                activeTestTab,
                screenName: activeTestTab,
                resultDataState: this.state.resultDataState,
                activeTabIndex: tabProps.activeTabIndex ? tabProps.activeTabIndex : this.state.activeTabIndex,
                activeTabId: tabProps.activeTabId ? tabProps.activeTabId : this.state.activeTabId,
                 ndesigntemplatemappingcode : this.props.Login.masterData.DesignTemplateMappingValue &&
                this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode
            }
            this.props.getTestChildTabDetailSchedulerConiguration(inputData, true)
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
    sideNavDetail = (screenName//, sampleGridSkip
    ) => {
        let testList = this.props.Login.masterData.SchedulerConfigGetTest || [];
        let { testskip, testtake } = this.state
        testList = testList.slice(testskip, testskip + testtake);
        let selectedTestList = getSameRecordFromTwoArrays(testList, this.props.Login.masterData.selectedTest, "ntransactiontestcode");
        let ntransactiontestcode = this.props.Login.masterData.selectedTest ? this.props.Login.masterData.selectedTest.map(test => test.ntransactiontestcode).join(",") : "-1";
        return (
            screenName == "IDS_PARAMETERS"
                //&& this.props.Login.masterData.RealSampleTypeValue && this.props.Login.masterData.RealSampleTypeValue.nsampletypecode !== SampleType.CLINICALTYPE 
                ? <SchedulerParameterTab
                    userInfo={this.props.Login.userInfo}
                    genericLabel={this.props.Login.genericLabel}
                    masterData={this.props.Login.masterData}
                    inputParam={this.props.Login.inputParam}
                    dataState={this.state.resultDataState}
                    dataStateChange={this.testDataStateChange}
                    screenName="IDS_PARAMETERS"
                    controlMap={this.state.controlMap}
                    userRoleControlRights={this.state.userRoleControlRights}
                />
                :
                
                           screenName == "IDS_SAMPLEDETAILS" ?
                                this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length === 1 ?
                                    <SampleInfoView
                                        data={(this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample.length > 0) ?
                                            this.props.Login.masterData.selectedSample[this.props.Login.masterData.selectedSample.length - 1] : {}}
                                        SingleItem={this.props.Login.masterData.selectedSample && this.props.Login.masterData.selectedSample ?
                                            this.state.SingleItem : []}
                                        screenName="IDS_SAMPLEINFO"
                                        userInfo={this.props.Login.userInfo}
                                       // viewFile={this.viewFile}

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
                                        primaryKeyField={"nschedulersamplecode"}
                                        expandField="expanded"
                                        screenName="IDS_SAMPLEINFO"
                                        //viewFile={this.viewFile}
                                        //jsonField={"jsondata"}
                                    />
                                :""
                               
                                    
        )
    }
    gridfillingColumn(data) {
        //  const tempArray = [];
        const temparray = data && data.map((option) => {
            return { "idsName": option[designProperties.LABEL][this.props.Login.userInfo.slanguagetypecode] || "-", "dataField": option[designProperties.VALUE], "width": "200px", "columnSize": "3", "dataType": [option[designProperties.LISTITEM]] };
        });
        return temparray;
    }

    sampleInfoDataStateChange = (event) => {
        this.setState({
            sampleGridDataState: event.dataState
        });
        //ALPD-657
        //this.changePropertyView(1)
    }
    getSchedulerConfigComboService = (ScreenName, operation,
        primaryKeyField, masterData, userInfo, editId, importData) => {
            const ndesigntemplatemappingcodefilter = this.props.Login.masterData.DesignTemplateMappingValue &&
            this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode;
            if (ndesigntemplatemappingcodefilter === this.props.Login.masterData.ndesigntemplatemappingcode) {
                let data = [];
            const withoutCombocomponent = []
            const Layout = this.props.Login.masterData.registrationTemplate
                && this.props.Login.masterData.registrationTemplate.jsondata
            }
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
                  /*  data.push({
                        "source":"userssite",
                        "templatemandatory":true,
                        "displaymember": "sproductcatname",
                        "componentname": "Combo Box",
                        "displayname":{
                            "en-US": "Sample Category",
                            "ru-RU": "Образец категории",
                            "tg-TG": "Категорияи намунавӣ"
                        },
                        "id": "L7BUKHDn3","inputtype": "combo",
                      "label": "Sample Category","mandatory": false,
                      "valuemember": "nproductcatcode"

                    })*/
                    const mapOfFilterRegData = {
                        nsampletypecode: parseInt(this.props.Login.masterData.RealSampleTypeValue.nsampletypecode),
                        sampletypecategorybasedflow: parseInt(this.props.Login.masterData.RealSampleTypeValue.ncategorybasedflowrequired),
                        nneedsubsample: this.props.Login.masterData.RealRegSubTypeValue.nneedsubsample === true ? transactionStatus.YES : transactionStatus.NO,
                        isQualisLite:(this.props.Login.settings && parseInt(this.props.Login.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO,
                      //ALPD-5392--Added by vignesh R(12-02-2025)--Scheduler Config--Default Spec loaded while Pre Reg
                      //start -ALPD-5392
                      ntestgroupspecrequired: this.props.Login.masterData.RealRegSubTypeValue.ntestgroupspecrequired === true ? transactionStatus.YES : transactionStatus.NO, 
                     //end-ALPD-5392

                      //ALPD-5530--Vignesh R(06-03-2025)--record allowing the pre-register when the approval config retired
                    napproveconfversioncode:this.props.Login.masterData.RealApprovalConfigVersionValue && this.props.Login.masterData.RealApprovalConfigVersionValue.napproveconfversioncode
                    }
                    this.props.getPreviewTemplate(masterData, userInfo, editId,
                        data, this.state.selectedRecord, childColumnList,
                        comboComponents, withoutCombocomponent, true, false,
                        mapOfFilterRegData, false, "create", this.props.Login.masterData.RealRegSubTypeValue.sregsubtypename, importData)
                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_CONFIGURETEMPLATE" }));
                }
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDDESIGNTEMPLATE" }));
            }
    }

    onSampleTypeChange = (event, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nsampletypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            Map['advfilterdata'] = true;
            this.props.onSampleTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }

    onRegTypeChange = (event, labelname) => {
        if (event !== null) {
            let Map = {};
            Map["nregtypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            Map['advfilterdata'] = true;
            this.props.onRegTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }

    onRegSubTypeChange = (event, labelname) => {
        if (event !== null) {
            let Map = {};
            Map['nregtypecode'] = this.props.Login.masterData.RegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = parseInt(event.value);
            Map['userinfo'] = this.props.Login.userInfo;
            Map['advfilterdata'] = true;
            this.props.onRegSubTypeChange(Map, this.props.Login.masterData, event, labelname);
        }
    }

    onApprovalConfigVersionChange = (event, labelname) => {
        if (event !== null) {
            let Map = {};
            Map['nregtypecode'] = this.props.Login.masterData.RegTypeValue.nregtypecode;
            Map["nregsubtypecode"] = this.props.Login.masterData.RegSubTypeValue.nregsubtypecode;
            Map["napproveconfversioncode"] = event.value;
            Map['userinfo'] = this.props.Login.userInfo;
            Map['advfilterdata'] = true;
            this.props.changeApprovalConfigVersionChange(Map, this.props.Login.masterData, event, labelname);
        }
    }

    onSchedulerConfigTypeChange = (event, labelname) => {
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
    onFilterChange = (event, labelname) => {
        let masterData = this.props.Login.masterData;
        // masterData[labelname] = {...event.item};
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
    onDesignTemplateChange = (event, labelname) => {
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

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
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
                    screenName: "IDS_PARAMETERS",
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

    onReload = () => {

        const obj = convertDateValuetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate, this.props.Login.userInfo);
        const RealFromDate = obj.fromDate;
        const RealToDate = obj.toDate;


        let RealSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue;
        let RealRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue;
        let RealRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue;
        let RealFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue;
        let RealDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue;
        let RealApprovalConfigVersionValue = this.props.Login.masterData.ApprovalConfigVersionValue && this.props.Login.masterData.ApprovalConfigVersionValue;
        let RealSampleTypeList = this.props.Login.masterData.SampleType || [];
        let RealRegTypeList = this.props.Login.masterData.RegistrationType || [];
        let RealRegSubTypeList = this.props.Login.masterData.RegistrationSubType || [];
        let RealFilterStatuslist = this.props.Login.masterData.FilterStatus || [];
        let RealDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping || [];
        let RealApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion || [];

        let SampleTypeValue = RealSampleTypeValue
        let RegTypeValue = RealRegTypeValue
        let RegSubTypeValue = RealRegSubTypeValue
        let FilterStatusValue = RealFilterStatusValue
        let DesignTemplateMappingValue = RealDesignTemplateMappingValue
        let ApprovalConfigVersionValue = RealApprovalConfigVersionValue
        const FromDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        const ToDate = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,FromDate,ToDate,
            RealFilterStatusValue, RealDesignTemplateMappingValue, RealApprovalConfigVersionValue,
            RealSampleTypeList, RealRegTypeList, RealRegSubTypeList, RealDesignTemplateMappingList, RealApprovalConfigVersionList,
            RealFilterStatuslist,SampleTypeValue,RegSubTypeValue,RegTypeValue,FilterStatusValue,DesignTemplateMappingValue,RealFromDate,RealToDate
        }

        let inputData = {
            nsampletypecode: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
            userinfo: this.props.Login.userInfo,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            napproveconfversioncode: this.props.Login.masterData.ApprovalConfigVersion
                && this.props.Login.masterData.ApprovalConfigVersionValue.napproveconfversioncode,
            ndesigntemplatemappingcode: this.props.Login.masterData.DesignTemplateMappingValue
                && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            flag: 1,
            "isParameter":true,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            nregsubtypeversioncode:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus==0 ? this.props.Login.masterData.FilterStatus.map(item =>item.ntransactionstatus).join(",") :this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            nsampleschedulerconfigtypecode:this.props.Login.masterData.SchedulerConfigTypeValue&&this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode

        
        }

        if (inputData.nsampletypecode) {
            // let obj = this.covertDatetoString(this.props.Login.masterData.RealFromDate, this.props.Login.masterData.RealToDate)
            inputData['FromDate'] = obj.fromDate;
            inputData['ToDate'] = obj.toDate;

            let inputParam = { masterData, inputData, searchSubSampleRef: this.searchSubSampleRef, searchSampleRef: this.searchSampleRef, searchTestRef: this.searchTestRef, selectedFilter: this.state.selectedFilter }
            this.props.ReloadDataSchedulerConfig(inputParam);
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
        }

           }

    onFilterSubmit = () => {
        
     //   const RealFromDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate);
        //const RealToDate = rearrangeDateFormat(this.props.Login.userInfo, this.state.selectedFilter.todate || this.props.Login.masterData.ToDate)
        
        let RealSampleTypeValue = this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue;
        let RealRegTypeValue = this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue;
        let RealRegSubTypeValue = this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue;
        let RealFilterStatusValue = this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue;
        let RealDesignTemplateMappingValue = this.props.Login.masterData.DesignTemplateMappingValue && this.props.Login.masterData.DesignTemplateMappingValue;
        let RealApprovalConfigVersionValue = this.props.Login.masterData.ApprovalConfigVersionValue && this.props.Login.masterData.ApprovalConfigVersionValue;
        let RealSampleTypeList = this.props.Login.masterData.SampleType || [];
        let RealRegTypeList = this.props.Login.masterData.RegistrationType || [];
        let RealRegSubTypeList = this.props.Login.masterData.RegistrationSubType || [];
        let RealFilterStatuslist = this.props.Login.masterData.FilterStatus || [];
        let RealDesignTemplateMappingList = this.props.Login.masterData.DesignTemplateMapping || [];
        let RealApprovalConfigVersionList = this.props.Login.masterData.ApprovalConfigVersion || [];
        let RealSchedulerConfigTypeValue= this.props.Login.masterData.SchedulerConfigTypeValue|| [];
        let RealSchedulerConfigType = this.props.Login.masterData.SchedulerConfigType || [];
        let masterData = {
            ...this.props.Login.masterData, RealSampleTypeValue, RealRegTypeValue, RealRegSubTypeValue,
            RealFilterStatusValue, RealDesignTemplateMappingValue, RealApprovalConfigVersionValue,
            RealSampleTypeList, RealRegTypeList, RealRegSubTypeList, RealDesignTemplateMappingList, RealApprovalConfigVersionList,
            RealFilterStatuslist,RealSchedulerConfigTypeValue,RealSchedulerConfigType
        }

        let inputData = {
            nsampletypecode: this.props.Login.masterData.SampleTypeValue && this.props.Login.masterData.SampleTypeValue.nsampletypecode,
            nregtypecode: this.props.Login.masterData.RegTypeValue && this.props.Login.masterData.RegTypeValue.nregtypecode,
            nregsubtypecode: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypecode,
            nfilterstatus: this.props.Login.masterData.FilterStatusValue && this.props.Login.masterData.FilterStatusValue.ntransactionstatus==0 ? this.props.Login.masterData.FilterStatus.map(item =>item.ntransactionstatus).join(",") :this.props.Login.masterData.FilterStatusValue.ntransactionstatus,
            userinfo: this.props.Login.userInfo,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            napproveconfversioncode: this.props.Login.masterData.ApprovalConfigVersion
                && this.props.Login.masterData.ApprovalConfigVersionValue.napproveconfversioncode,
            ndesigntemplatemappingcode: this.props.Login.masterData.DesignTemplateMappingValue
                && this.props.Login.masterData.DesignTemplateMappingValue.ndesigntemplatemappingcode,
            nneedtemplatebasedflow: this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nneedtemplatebasedflow,
            nneedsubsample: this.props.Login.masterData.RegSubTypeValue
                && this.props.Login.masterData.RegSubTypeValue.nneedsubsample,
            checkBoxOperation: checkBoxOperation.SINGLESELECT,
            nregsubtypeversioncode:this.props.Login.masterData.RegSubTypeValue && this.props.Login.masterData.RegSubTypeValue.nregsubtypeversioncode,
            nsampleschedulerconfigtypecode:this.props.Login.masterData.SchedulerConfigTypeValue&&this.props.Login.masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode
        }

        if (inputData.nsampletypecode) {
            if (inputData.ndesigntemplatemappingcode) {
                // const obj = convertDateValuetoString(this.state.selectedFilter.fromdate || this.props.Login.masterData.FromDate,
                //     this.state.selectedFilter.todate || this.props.Login.masterData.ToDate, this.props.Login.userInfo)
                // inputData['FromDate'] = obj.fromDate;
                // inputData['ToDate'] = obj.toDate;
                // ALPD-4130 to clear Additinal Filter config upon Filter Submit- ATE-241
                masterData['kendoFilterList'] = undefined;
                const selectedFilter = {};
               // selectedFilter["fromdate"] = RealFromDate;
               // selectedFilter["todate"] = RealToDate;
                const inputParam = {
                    masterData, inputData, 
                    searchSubSampleRef: this.searchSubSampleRef,
                    searchSampleRef: this.searchSampleRef,
                    searchTestRef: this.searchTestRef,
                     selectedFilter
                }
                this.props.getSchedulerConfigSample(inputParam);
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSCONFIGREGISTRATIONTEMPLATE" }));
            }
    }
    else {
        toast.info(this.props.intl.formatMessage({ id: "IDS_PLSSELECTALLTHEVALUEINFILTER" }));
    } 
    }
    onSaveClick = (saveType, formRef) => {
        let operation = this.props.Login.operation;
        if (operation === "update") {
            // this.onUpdateRegistration(saveType, formRef, operation);
        }
    }
}


export default connect(mapStateToProps, {
    callService, updateStore, onSampleTypeChange, onSampleTypeChange, onRegTypeChange, onRegSubTypeChange, getPreviewTemplate,
    changeApprovalConfigVersionChange, getSchedulerConfigSample, filterTransactionList, getSchedulerConfigSubSampleDetail,getSchedulerTestDetail,ReloadDataSchedulerConfig,
    getTestChildTabDetailSchedulerConiguration,addsubSampleSchedulerConfiguration,testSectionTest ,saveSchedulerSubSample,getEditSchedulerSubSampleComboService,
    updateSchedulerConfigSubSample,deleteSchedulerSubSample,addMoreSchedulerConfigTest,createSchedulerTest,deleteSchedulerConfigTest,getEditSchedulerConfigComboService,
    validateEsignforSchedulerConfig,approveSchedulerConfig,deleteSchedulerConfig,updateActiveStatusSchedulerConfig,getSchedulerMasteDetails
})(injectIntl(SchedulerConfiguration));