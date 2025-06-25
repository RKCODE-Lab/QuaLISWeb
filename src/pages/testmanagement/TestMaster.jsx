import React, { Component } from 'react';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import rsapi from '../../rsapi';

import {
    callService, crudMaster, getTestMaster, addTest, updateStore, getTestDetails, formulaChangeFunction, filterColumnData,
    addParameter, validateEsignCredential, addCodedResult, addParameterSpecification, getAvailableData, addFormula,addClinicalSpecification,
    changeTestCategoryFilter, addTestFile, viewAttachment, getActiveTestContainerTypeById, addContainerType, ReportInfoTest, getUnitConversion,
    getConversionOperator,addPredefinedModal
} from '../../actions'
import TestView from './TestView';
import { injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import AddParameter from './AddParameter';
import AddTest from '../../pages/testmanagement/AddTest';
import TestReportInfo from "../../pages/testmanagement/TestReportInfo";
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { getControlMap, showEsign, constructOptionList } from '../../components/CommonScript';
import TestCategoryFilter from './TestCategoryFilter';
import ListMaster from '../../components/list-master/list-master.component';
import { faTrashAlt, faPencilAlt, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as ReportEdit } from '../../assets/image/report-edit.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText, ContentPanel, MediaLabel } from '../../components/App.styles';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { parameterType, transactionStatus } from '../../components/Enumeration';
import 'react-perfect-scrollbar/dist/css/styles.css';
// import { Tooltip } from '@progress/kendo-react-tooltip';

import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
//ALPD-4652 Saravanan
import { process } from '@progress/kendo-data-query';
// import ReactTooltip from 'react-tooltip';

class TestMaster extends Component {

    constructor(props) {
        super(props);
        const clinicalspecDataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5, group: [{ field: 'sgendername' }] };
        this.state = ({
            selectedRecord: {},
            error: "",
            userRoleControlRights: [],
            controlMap: new Map(),
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[3] : 10,
            sidebarview:false,clinicalspecDataState
        });
        this.searchRef = React.createRef();
        this.searchFieldList = ["stestname", "stestsynonym", "sdescription", "saccredited", "stestcategoryname", "ncost", "stransactionstatus"]
    }
    
    sidebarExpandCollapse = () => {
      //  alert('ss');
       // this.setState({sidebarviewstate: !this.state.sidebarviewstate}) 
       this.setState({
        sidebarview: true
    })          
       // sidebarviewstate:true
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
    render() {

        //console.log("render in test:", this.props.Login);
        this.confirmMessage = new ConfirmMessage();

        const { TestMaster, SelectedTest, searchedData } = this.props.Login.masterData;
        const { masterData, userInfo, testData, parameterData, otherTestData, linkMaster, editFiles } = this.props.Login;
        const addId = this.state.controlMap.has("AddTest") && this.state.controlMap.get("AddTest").ncontrolcode;
        const editId = this.state.controlMap.has("EditTest") && this.state.controlMap.get("EditTest").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteTest") && this.state.controlMap.get("DeleteTest").ncontrolcode;
        const copyId = this.state.controlMap.has("CopyTest") && this.state.controlMap.get("CopyTest").ncontrolcode;
        const reportdetailId= this.state.controlMap.has("ReportInfoTest")  && this.state.controlMap.get("ReportInfoTest").ncontrolcode;

        const filterParam = {
            inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode",
            fetchUrl: "testmaster/getTestById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };
        if (this.props.Login.openModal) {
            this.mandatoryFields = this.findMandatoryFields(this.props.Login.screenName, this.state.selectedRecord, this.props.Login.operation)
        }
        const breadCrumbData = this.state.filterData || [];
        return (
            <>
                {/* Start of get display */}
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                masterData={masterData}
                                screenName={this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                masterList={searchedData || TestMaster}
                                getMasterDetail={(test) => this.props.getTestMaster(test, userInfo, masterData)}
                                selectedMaster={SelectedTest}
                                primaryKeyField="ntestcode"
                                mainField="stestname"
                                firstField="stestcategoryname"
                                secondField="stransactionstatus"
                                openModal={() => this.props.addTest("create", SelectedTest, userInfo, addId, this.state.nfilterTestCategory)}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                addId={addId}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                needAccordianFilter={false}
                                //skip={this.state.skip}
                                //take={this.state.take}
                                //handlePageChange={this.handlePageChange}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_TESTFILTER":
                                            <TestCategoryFilter
                                                filterTestCategory={this.state.filterTestCategory || []}
                                                nfilterTestCategory={this.state.nfilterTestCategory || {}}
                                                onComboChange={this.onComboChange}
                                            />
                                    }
                                ]}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div>
                            {TestMaster && TestMaster.length > 0 && SelectedTest && Object.values(SelectedTest).length > 0 ?
                                <ContentPanel className="panel-main-content">
                                    <Card className="border-0">
                                        <Card.Header>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                            <Card.Title className="product-title-main">
                                                {SelectedTest.stestname}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                {/* <Row>
                                                <Col md={8}> */}
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        <MediaLabel className={`btn btn-outlined ${SelectedTest.ntransactionstatus === 1 ? "outline-success" : "outline-secondary"} btn-sm ml-3`}>
                                                            {SelectedTest.ntransactionstatus === 1 && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
                                                            {SelectedTest.stransactionstatus}
                                                        </MediaLabel>
                                                        <MediaLabel className={`btn-normal ${SelectedTest.naccredited === transactionStatus.ACCREDITED ? "outline-success" : "normal-danger"} btn-sm mr-3`}>
                                                            {SelectedTest.saccredited}
                                                        </MediaLabel>
                                                    </h2>
                                                    {/* </Col>
                                                <Col md="4"> */}
                                                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                    <div className="d-inline">
                                                        {/* Don't delete these commented lines because additional info feature is needed for Agaram LIMS */}
                                                        {/* Start Here */}
                                                        {/* <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" href="" >  
                                                            <FontAwesomeIcon icon={faEye} className="ActionIconColor" onClick={(e)=>this.viewAdditionalInfo(e)} />
                                                        </Nav.Link> */}
                                                        {/* End Here */}

                                                        { 
                                                        parseInt(this.props.Login.settings[34]) === transactionStatus.YES ?
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2" name="reportdetailstestname"
                                                            hidden={this.state.userRoleControlRights.indexOf(reportdetailId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REPORTINFOTEST" })}
                                                            //data-for="tooltip_list_wrap"
                                                            onClick={(e) => this.props.ReportInfoTest("", "reportinfotest", "ntestcode", this.props.Login.masterData, this.props.Login.userInfo, reportdetailId)}>
                                                            <ReportEdit className="custom_icons" width="20" height="20" />
                                                        </Nav.Link>     
                                                        : ""}

                                                        <Nav.Link className="btn btn-circle outline-grey mr-2" name="edittestname"
                                                            hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //data-for="tooltip_list_wrap"
                                                            onClick={() => this.props.addTest("update", SelectedTest, userInfo, editId, this.state.nfilterTestCategory)}>
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap" name="deletetestname"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                         //   data-for="tooltip_list_wrap"
                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                            onClick={() => this.ConfirmDelete(SelectedTest, "delete", deleteId, "TestMaster", "openModal")}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                            {/* <ConfirmDialog
                                                                    name="deleteMessage"
                                                                    message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                    doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                    doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                    icon={faTrashAlt}
                                                                    // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    handleClickDelete={() => this.deleteAction(SelectedTest, "delete", deleteId, "TestMaster", "openModal")}
                                                                /> */}
                                                        </Nav.Link>
                                                        <Nav.Link className="btn btn-circle outline-grey mr-2 " name="copytestname"
                                                            hidden={this.state.userRoleControlRights.indexOf(copyId) === -1}
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_COPY" })}
                                                           // data-for="tooltip_list_wrap"
                                                            onClick={() => this.props.addTest("copy", SelectedTest, userInfo, copyId, this.state.nfilterTestCategory)}>
                                                            <FontAwesomeIcon icon={faCopy} />
                                                        </Nav.Link>
                                                    </div>
                                                    {/* </Tooltip> */}
                                                </div>
                                                {/* </Col>
                                            </Row> */}
                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="form-static-wrap">
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTest.stestsynonym}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_SHORTNAME" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTest.sshortname}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                        <FormGroup>
                                                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PRICE" })}</FormLabel>
                                                            <ReadOnlyText>{SelectedTest.ncost}</ReadOnlyText>
                                                        </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                        <FormGroup>
                                                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TAT" })}</FormLabel>
                                                            <ReadOnlyText>{SelectedTest.ntat !== -1 ? SelectedTest.ntat : '-'} 
                                                                    {SelectedTest.ntat !== 0  && SelectedTest.ntatperiodcode !== -1 ? " ".concat(SelectedTest.statperiodname) : "" }</ReadOnlyText>
                                                        </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                        <FormGroup>
                                                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TRAININGNEEDED" })}</FormLabel>
                                                            <ReadOnlyText>{SelectedTest.strainingneed} </ReadOnlyText>
                                                        </FormGroup>
                                                </Col>
                                                <Col md="4">
                                                        <FormGroup>
                                                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_INTERFACETYPE" })}</FormLabel>
                                                            <ReadOnlyText>{SelectedTest.sinterfacetypename} </ReadOnlyText>
                                                        </FormGroup>
                                                </Col>
                                                <Col md="12">
                                                        <FormGroup>
                                                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TESTPLATFORM" })}</FormLabel>
                                                            <ReadOnlyText>{SelectedTest.stestplatform}</ReadOnlyText>
                                                        </FormGroup>
                                                </Col>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TESTPROCEDURE" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTest.sdescription}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                                {/* {this.props.Login.masterData.TestParameter && this.props.Login.masterData.TestParameter.length > 0 && this.props.Login.masterData.TestParameter[0].nparametertypecode === 1 && */}
                                                    {/* <Col md="6">
                                                        <FormGroup>
                                                            <FormLabel>{this.props.intl.formatMessage({ id: "IDS_PRICE" })}</FormLabel>
                                                            <ReadOnlyText>{SelectedTest.ncost}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col> */}
                                                {/* } */}
                                                {/* Don't delete these commented lines because additional info feature is needed for Agaram LIMS */}
                                                {/* Start Here */}
                                                {/* <Col md="6">
                                                <FormGroup>
                                                    <FormLabel>{ this.props.intl.formatMessage({id: "IDS_ADDITIONALINFO"}) }</FormLabel>
                                                    <ReadOnlyText>{ selectedTest.schecklistname }</ReadOnlyText>
                                                </FormGroup>
                                            </Col> */}
                                                {/* End Here */}
                                            </Row>
                                            <TestView
                                                isFormulaOpen={this.props.Login.isFormulaOpen}
                                                linkMaster={linkMaster}
                                                editFiles={editFiles}
                                                userInfo={this.props.Login.userInfo}
                                                parameterData={parameterData || []}
                                                otherTestData={otherTestData || []}
                                                formulaData={this.props.Login.formulaData || {}}
                                                preDefinedFormula={this.props.Login.preDefinedFormula || {}}
                                                dataState={this.props.Login.dataState}
                                                masterData={masterData}
                                                inputParam={this.props.Login.inputParam}
                                                controlMap={this.state.controlMap}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                esignRights={this.props.Login.userRoleControlRights}
                                                screenData={this.props.Login.screenData}
                                                openChildModal={this.props.Login.openChildModal}
                                                showSaveContinue={this.props.Login.showSaveContinue}
                                                operation={this.props.Login.operation}
                                                screenName={this.props.Login.screenName}
                                                selectedRecord={this.props.Login.selectedRecord}
                                                loadEsign={this.props.Login.loadEsign}
                                                ncontrolCode={this.props.Login.ncontrolCode}
                                                crudMaster={this.props.crudMaster}
                                                addParameterSpecification={this.props.addParameterSpecification}
                                                getAvailableData={this.props.getAvailableData}
                                                addCodedResult={this.props.addCodedResult}
                                                addSubCodedResult={this.addSubCodedResult}
                                                addFormula={this.props.addFormula}
                                                openPredefinedModal={this.props.addPredefinedModal}
                                                formulaChangeFunction={this.props.formulaChangeFunction}
                                                addParameter={this.props.addParameter}
                                                addContainerType={this.props.addContainerType}
                                                deleteAction={this.deleteAction}
                                                getTestDetails={this.props.getTestDetails}
                                                updateStore={this.props.updateStore}
                                                validateEsignCredential={this.props.validateEsignCredential}
                                                addTestFile={this.props.addTestFile}
                                                viewAttachment={this.props.viewAttachment}
                                                settings = {this.props.Login.settings}
                                                getActiveTestContainerTypeById={this.props.getActiveTestContainerTypeById}
                                                hideQualisForms={this.props.Login.hideQualisForms}
                                                getUnitConversion = {this.props.getUnitConversion}
                                                getConversionOperator = {this.props.getConversionOperator}
                                                DestinationUnit = {this.props.Login.DestinationUnit}
                                                onFocus={this.handleFocus}
                                                grade={this.props.Login.grade}
                                                addClinicalSpecification={this.props.addClinicalSpecification}
                                                clinicalspecDataState={this.state.clinicalspecDataState}
                                                dataStateChange={this.specDataStateChange}
                                                
                                            ></TestView>
                                        </Card.Body>
                                    </Card>
                                </ContentPanel>
                                : ""
                            }
                        </Col>
                    </Row>
                </div>
                {/* End of get display */}

                {/* Start of Modal Sideout for Test Creation */}
                {this.props.Login.openModal && this.props.Login.operation && this.props.Login.inputParam &&
                    <SlideOutModal
                        show={this.props.Login.openModal}
                        //size={this.props.Login.operation==="create" ? "xl" : "lg" }
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                        showSaveContinue={this.props.Login.operation==="copy"?false:
                            this.props.Login.loadEsign && this.props.Login.loadEsign===true ? false :true}
                        onSaveClick={this.onSaveTest}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.mandatoryFields || []}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                             /> 
                             :this.props.Login.operation ==="reportinfotest" ?
                                <TestReportInfo
                                    userInfo={this.props.Login.userInfo}
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onNumericInputChange={this.onNumericInputChange}
                                />
                            : <Row>
                                {/* <Col md={this.props.Login.needOtherTest ? "8" : "12"}> */}
                                <Col md={this.props.Login.needOtherTest ? "6" : "12"}>
                                    <AddTest
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        // onActiveStatusChange={this.onActiveStatusChange}
                                        onNumericInputChange={this.onNumericInputChange}
                                        onComboChange={this.onComboChange}
                                        testData={testData}
                                        otherTestData={otherTestData}
                                        needOtherTest={this.props.Login.needOtherTest}
                                        parameterData={parameterData}
                                        hideQualisForms={this.props.Login.hideQualisForms}
                                    ></AddTest>
                                </Col>                               
                                {this.props.Login.needOtherTest &&
                                    <Col md={6}>
                                        <AddParameter
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onNumericInputChange={this.onNumericInputChange}
                                            onComboChange={this.onComboChange}
                                            parameterData={parameterData}
                                            userInfo={this.props.Login.userInfo}
                                            onFocus={this.handleFocus}
                                            DestinationUnit={this.props.Login.DestinationUnit}                                                          
                                        ></AddParameter>
                                    </Col>
                                }                                
                            </Row>
                           
                        }
                    />
                }
                {/* End of Modal Sideout for Test Creation */}
            </>
        );
    }

    handlePageChange = (event) => {
        this.setState({
            skip: event.skip,
            take: event.take
        });
    }

    ConfirmDelete = (item, operation, ncontrolCode, methodUrl, modalName) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteAction(item, operation, ncontrolCode, methodUrl, modalName));
    }

    findMandatoryFields(screenName, selectedRecord, operation) {
        if (screenName === "IDS_TEST") {
            let mandatoryFields = [
                { "idsName": "IDS_TESTCATEGORY", "dataField": "ntestcategorycode", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_TESTNAME", "dataField": "stestname", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                
            ]
            if (operation === "create") {
                mandatoryFields.push(
                    { "idsName": "IDS_SECTION", "dataField": "nsectioncode", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametername", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_PARAMETERTYPE", "dataField": "nparametertypecode", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
                );
                if (selectedRecord && Object.values(selectedRecord).length > 0 && selectedRecord["nparametertypecode"]) {
                    if (selectedRecord["nparametertypecode"].value === parameterType.NUMERIC) {
                        mandatoryFields.push(
                            { "idsName": "IDS_ROUNDINGDIGITS", "dataField": "nroundingdigits", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                            { "idsName": "IDS_UNIT", "dataField": "nunitcode", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                        );
                    } else if (selectedRecord["nparametertypecode"].value === parameterType.PREDEFINED) {
                        mandatoryFields.push(
                            { "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                            { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                            { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},

                        );
                    }
                }

            }
            mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
            return mandatoryFields;
        } else  if(operation ==="reportinfotest") {
            let mandatoryFields = [];
            mandatoryFields.push(
                { "idsName": "IDS_CONFIRMSTATEMENT", "dataField": "sconfirmstatement", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_DECISIONRULE", "dataField": "sdecisionrule", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_SOPDESCRIPTION", "dataField": "ssopdescription", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_TESTCONDITION", "dataField": "stestcondition", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_DEVIATIONCOMMENTS", "dataField": "sdeviationcomments", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_METHODSTANDARD", "dataField": "smethodstandard", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_REFERENCE", "dataField": "sreference", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            );
            return mandatoryFields;

        }
        else {
            return [];
        }
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        let selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (fieldName === "sparametername") {
                    selectedRecord[fieldName] = comboData;
                    selectedRecord["sparametersynonym"] = comboData ? comboData.value : "";
                } else if(fieldName  === "nunitcode") {
                    selectedRecord["nunitcode"] = comboData;
                    this.props.getUnitConversion(this.state.selectedRecord.nunitcode.value,this.props.Login.masterData,this.props.Login.userInfo, selectedRecord);
                } else  if(fieldName === "ndestinationunitcode") {
                    if(comboData !==null){
                        selectedRecord["ndestinationunitcode"] = comboData;
                        this.props.getConversionOperator(this.state.selectedRecord.nunitcode.value,this.state.selectedRecord.ndestinationunitcode.value,this.props.Login.masterData,this.props.Login.userInfo, selectedRecord);

                    }else {
                        delete selectedRecord["ndestinationunitcode"];
						//ALPD-3521
                        delete selectedRecord["soperator"];
                        delete selectedRecord["nconversionfactor"];
                        selectedRecord["noperatorcode"]=-1;
                    }
                    
                }
                else {
                    selectedRecord[fieldName] = comboData;
                }
                this.setState({ selectedRecord });
                break;

            case 2:
                let item = comboData['item'];
                let needUnit = true;
                let needRoundingDigit = true;
                let needCodedResult = true;
                let needActualResult = true;
                let npredefinedcode = transactionStatus.NO;
                const parameterData = this.props.Login.parameterData;
                if (item["nunitrequired"] === transactionStatus.YES) {
                    needUnit = false;
                    selectedRecord["nunitcode"] = this.props.Login.parameterData.defaultUnit;
                } else {
                    selectedRecord["nunitcode"] = "";
					//ALPD-3521
                    selectedRecord["ndestinationunitcode"] = [];
                    selectedRecord["soperator"] = [];
                    //Added by sonia on 02 june 2025 for jira id:ALPD-5958
                    selectedRecord["nconversionfactor"] = "";
                    selectedRecord["nresultaccuracycode"] = [];
                    delete selectedRecord["noperatorcode"];
                }
                if (item["nroundingrequired"] === transactionStatus.YES) {
                    needRoundingDigit = false;
                } else {
                   selectedRecord["nroundingdigit"] = "";
                    selectedRecord["nroundingdigits"] = "";
                    selectedRecord["ndeltacheck"] = 4;
                    selectedRecord["ndeltacheckframe"] = "";
                    selectedRecord["ndeltaunitcode"] = "";
                    selectedRecord["ndeltachecklimitcode"] = "";
                }
                if (item["npredefinedrequired"] === transactionStatus.YES) {
                    needCodedResult = false;
                    npredefinedcode = item["npredefinedrequired"];
                } else {
                    selectedRecord["spredefinedname"] = "";
                }
                if (item["ngraderequired"] === transactionStatus.YES) {
                    needActualResult = false;
                    selectedRecord["ngradecode"] = this.props.Login.parameterData.defaultGrade;
                } else {
                    selectedRecord["ngradecode"] = "";
                }


                selectedRecord[fieldName] = comboData;
                const parameterInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        parameterData: {
                            ...parameterData, needUnit, needRoundingDigit, needCodedResult, needActualResult, npredefinedcode
                        }, selectedRecord
                    }
                }
                this.props.updateStore(parameterInfo);

                break;

            case 3:
                let nfilterTestCategory = this.state.nfilterTestCategory || {}
                nfilterTestCategory = comboData;
                this.searchRef.current.value = "";
                this.setState({ nfilterTestCategory })
                break;

            default:
                break;
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

    closeFilter = () => {
console.log("Hello Close Filter");
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    onFilterSubmit = () => {
        if (this.state.nfilterTestCategory.value) {
            let inputParam = {
                inputData: {
                    ntestcategorycode: this.state.nfilterTestCategory.value,
                    userinfo: this.props.Login.userInfo,
                    nfilterTestCategory: this.state.nfilterTestCategory
                },
                classUrl: "testmaster",
                methodUrl: "TestMasterByCategory"
            }
            this.props.changeTestCategoryFilter(inputParam, this.props.Login.masterData.filterTestCategory);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TESTCATEGORYNOTAVAILABLE" }));
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

    // onActiveStatusChange =(event, optional)=>{
    //     const selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
    //     this.setState({ selectedRecord });
    //     if (event.target.checked === false){
    //        this.validateTestExistenceInTestGroup();
    //     }
    // }

    onInputOnChange = (event, caseNo, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (event.target.type === 'checkbox') {
                    selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
                    if (selectedRecord['ndeltacheck']===transactionStatus.YES) {
                        selectedRecord['ndeltaunitcode'] = this.props.Login.parameterData && this.props.Login.parameterData.deltaperiod.filter(x =>
                            x.item.ndefaultstatus === transactionStatus.YES)[0];
                    }
                    else {
                        delete selectedRecord['ndeltaunitcode'];
                    }
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
                this.setState({ selectedRecord });
                break;

            case 2:
                selectedRecord[event.target.name] = selectedRecord["stestsynonym"] =
                    selectedRecord["sparametersynonym"] = event.target.value;
                selectedRecord["sparametername"] = { label: event.target.value, value: event.target.value };
                this.setState({ selectedRecord });
                break;

            case 3:
                selectedRecord[event.target.name] = selectedRecord["sparametersynonym"] = event.target.value;
                this.setState({ selectedRecord });
                break;

        case 6:
          //selectedRecord[event.target.name] = selectedRecord["sresultparacomment"] = event.target.value;
          selectedRecord[event.target.name] = selectedRecord["spredefinedsynonym"] = event.target.value;

           this.setState({ selectedRecord });
                    break;

            default:
                break;
        }
    }

    // onNumericInputChange = (value, name) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[name] = value;
    //     this.setState({ selectedRecord });
    // }

    onNumericInputChange = (value, name) => {
       // console.log("value:", value, name);
        const selectedRecord = this.state.selectedRecord || {};
        if (name === "nroundingdigits" || name === "nconversionfactor") {
           // if(/^\-/.test(value.target.value)){
           // if (/^-?\d*?$/.test(value.target.value) || value.target.value === "") {
                if (/^\d*?$/.test(value.target.value) || value.target.value === "") {

              //  console.log("val:", value.target.value);
                selectedRecord[name] = value.target.value;
            }
            
        }
        else {
            selectedRecord[name] = value;
        }

        this.setState({ selectedRecord });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        } else {
            openModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

    closeFormulaModal = () => {
        this.setState({ addformula: false });
    }

    addSubCodedResult = () => {
    }

    deleteAction = (item, operation, ncontrolCode, methodUrl, modalName) => {
        const selected = item["dataItem"] ? item["dataItem"] : item;
        const inputParam = {
            inputData: {
                [methodUrl.toLowerCase()]: selected,
                userinfo: this.props.Login.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.Login.settings && parseInt(this.props.Login.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

            },
            classUrl: "testmaster",
            operation: operation,
            methodUrl: methodUrl,
            screenName: "IDS_TEST",
            selectedRecord: {...this.state.selectedRecord},
            postParam: {
                inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode",
                primaryKeyValue: selected.ntestcode,
                fetchUrl: "testmaster/getTestById", fecthInputObject: { userinfo: this.props.Login.userInfo },
                masterData: this.props.Login.masterData
            }
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    [modalName]: true, screenName: "IDS_TEST", operation: operation
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, modalName, {});
        }
    }

    validateTestExistenceInTestGroup = () => {

        const operation = this.props.Login.operation;
        if (operation === "update") {
            return rsapi.post("testmaster/validateTestExistenceInTestGroup", {
                ntestcode: this.props.Login.masterData.SelectedTest["ntestcode"],
                "userinfo": this.props.Login.userInfo
            })
                .then(response => {
                    if (response.data === true) {
                        this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                            this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                            this.props.intl.formatMessage({ id: "IDS_TESTEXISTSINTESTGROUP" }),
                            this.props.intl.formatMessage({ id: "IDS_OK" }),
                            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                            () => this.onSaveTest(null, null),
                            false,
                            undefined);
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
    }

    onSaveTest = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        const selectedRecord = this.state.selectedRecord;

        if(operation ==="reportinfotest"){
            this.onSaveReportInfoTest(null,null);
        }


        else if (operation === "update") {
            if (selectedRecord["ntransactionstatus"] === transactionStatus.DEACTIVE) {
                return rsapi.post("testmaster/validateTestExistenceInTestGroup", {
                    ntestcode: this.props.Login.masterData.SelectedTest["ntestcode"],
                    "userinfo": this.props.Login.userInfo
                })
                    .then(response => {
                        if (response.data === true) {
                            this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                                this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                                this.props.intl.formatMessage({ id: "IDS_TESTEXISTSINTESTGROUP" }),
                                this.props.intl.formatMessage({ id: "IDS_OK" }),
                                this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                                () => this.onSaveValidatedTest(null, null),
                                false,
                                undefined);
                        }
                        else {
                            this.onSaveValidatedTest(null, null);
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
                this.onSaveValidatedTest(null, null);
            }
        }
        else {
            if(saveType===2)
            {
                this.onSaveValidatedTest(saveType, null);
            }
            else
            {
               this.onSaveValidatedTest(null, null);
            }
        }
    }

    // onSaveTest1 = (saveType, formRef) => {
    //     const operation = this.props.Login.operation;
    //     let inputData = {};
    //     let customobject = null;
    //     const userInfo = this.props.Login.userInfo;
    //     const selectedRecord = this.state.selectedRecord;
    //     let testColumns = [{
    //         "testmaster": [{ "ntestcode": "int" }, { "ntestcategorycode": "input" }, { "nchecklistversioncode": "input" }, { "naccredited": "int" },
    //         { "ntransactionstatus": "int" }, { "stestname": "string" }, { "stestsynonym": "string" }, { "sdescription": "string" }, { "ncost": "float" }]
    //     }]
    //     if (operation === "create") {
    //         testColumns.push({
    //             "testparameter": [{ "ntestcode": "int" }, { "nparametertypecode": "input" }, { "nunitcode": "input" }, { "sparametername": "input" },
    //             { "sparametersynonym": "string" }, { "nroundingdigits": "int" }, { "objPredefinedParameter": "customobject" }]
    //         });
    //         inputData = {
    //             "testmaster": {},
    //             "testparameter": {
    //                 nisadhocparameter: transactionStatus.NO,
    //                 nisvisible: transactionStatus.YES,
    //                 nstatus: transactionStatus.ACTIVE
    //             },
    //             "testsection": {},
    //             "testmethod": {},
    //             "testinstrumentcategory": {}
    //         };
    //         if (this.props.Login.parameterData.npredefinedcode === transactionStatus.YES) {
    //             customobject = {};
    //             customobject["spredefinedname"] = selectedRecord["spredefinedname"].trim();
    //             customobject["nstatus"] = transactionStatus.ACTIVE;
    //             customobject["ndefaultstatus"] = transactionStatus.YES;
    //             customobject["ngradecode"] = selectedRecord["ngradecode"] ? selectedRecord["ngradecode"].value ? selectedRecord["ngradecode"].value : -1 : -1;
    //         }
    //     } else {
    //         inputData = {
    //             "testmaster": {}
    //         };
    //     }
    //     inputData["userinfo"] = userInfo;
    //     inputData["testmaster"]["nstatus"] = transactionStatus.ACTIVE;
    //     inputData["testmaster"]["nsitecode"] = userInfo.nmastersitecode;
    //     testColumns.forEach(function (items) {
    //         const mapkey = Object.keys(items)[0];
    //         const columns = Object.values(items)[0];
    //         columns.map(item => {
    //             const key = Object.keys(item)[0];
    //             const value = Object.values(item)[0];
    //             if (value === "input") {
    //                 return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key].value ? selectedRecord[key].value : -1 : -1;
    //             } else if (value === "int") {
    //                 return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key] : 0;
    //             } else if (value === "string") {
    //                 return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key].trim() : "";
    //             } else if (value === "float") {
    //                 return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key] : 0;
    //             } else if (value === "customobject") {
    //                 return inputData[mapkey][key] = customobject;
    //             } else {
    //                 return null;
    //             }
    //         });
    //     });
    //     let postParam = undefined;
    //     if (operation === "create") {
    //         if (selectedRecord["nsectioncode"]) {
    //             inputData["testsection"]["nsectioncode"] = selectedRecord["nsectioncode"].value;
    //             inputData["testsection"]["ndefaultstatus"] = transactionStatus.YES;
    //             inputData["testsection"]["nstatus"] = transactionStatus.ACTIVE;
    //         }
    //         if (selectedRecord["nmethodcode"]) {
    //             inputData["testmethod"]["nmethodcode"] = selectedRecord["nmethodcode"].value;
    //             inputData["testmethod"]["ndefaultstatus"] = transactionStatus.YES;
    //             inputData["testmethod"]["nstatus"] = transactionStatus.ACTIVE;
    //         }

    //         if (selectedRecord["ninstrumentcatcode"]) {
    //             inputData["testinstrumentcategory"]["ninstrumentcatcode"] = selectedRecord["ninstrumentcatcode"].value;
    //             inputData["testinstrumentcategory"]["ndefaultstatus"] = transactionStatus.YES;
    //             inputData["testinstrumentcategory"]["nstatus"] = transactionStatus.ACTIVE;
    //         }
    //     } else if (operation === "copy") {
    //         inputData["testmaster"]["ntestcode"] = this.props.Login.masterData.SelectedTest["ntestcode"]
    //     } else if (operation === "update") {
    //         postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
    //     }       

    //    // this.setState({ nfilterTestCategory: { "label": selectedRecord.ntestcategorycode.label, "value": selectedRecord.ntestcategorycode.value } });
    //     if (operation !== "update") {
    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: { defaultkeyname: "parametereventkey" }
    //         };
    //         this.props.updateStore(updateInfo);
    //     }
    //     let valid = true;
    //     // if (operation === "update" && (validateTest === undefined || validateTest === true)){


    //     if (valid){
    //         const inputParam = {
    //             inputData :{...inputData, validatetest:false},
    //             classUrl: "testmaster",
    //             operation: operation,
    //             methodUrl: "TestMaster",
    //             saveType, 
    //             formRef, postParam, searchRef: this.searchRef
    //         }
    //         const masterData = this.props.Login.masterData;
    //         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
    //             const updateInfo = {
    //                 typeName: DEFAULT_RETURN,
    //                 data: {
    //                     loadEsign: true, screenData: { inputParam, masterData }, saveType, formRef
    //                 }
    //             }
    //             this.props.updateStore(updateInfo);
    //         } else {
    //             this.props.crudMaster(inputParam, masterData, "openModal", {});
    //         }
    //     }
    // }

    onSaveValidatedTest = (saveType, formRef) => {
        const operation = this.props.Login.operation;
        let inputData = {};
        let customobject = null;
        const userInfo = this.props.Login.userInfo;
        const selectedRecord = this.state.selectedRecord;
        let testColumns = [{
            "testmaster": [{ "ntestcode": "int" }, { "ntestcategorycode": "input" }, { "nchecklistversioncode": "input" }, { "naccredited": "int" },{ "ntrainingneed": "int" },
            { "ntransactionstatus": "int" }, { "stestname": "string" }, { "stestsynonym": "string" }, { "sshortname": "string" },{ "sdescription": "string" }, { "ncost": "float" },
            { "stestplatform": "string" },{ "ntat": "int" },{ "ntatperiodcode": "input" },{ "ninterfacetypecode": "input" }]
        }]
        if (operation === "create") {
            testColumns.push({
                "testparameter": [{ "ntestcode": "int" }, { "nparametertypecode": "input" }, { "nunitcode": "input" }, { "ndestinationunitcode":"input" }, 
                //{ "sconversionoperator":"string" },
                {"noperatorcode":"int"}, { "nconversionfactor":"float" }, { "sparametername": "input" },
                    { "sparametersynonym": "string" }, { "nroundingdigits": "int" }, { "objPredefinedParameter": "customobject" }, { "ndeltachecklimitcode": "float" }, { "ndeltacheck": "int" },
                    { "ndeltaunitcode": "input" }, { "ndeltacheckframe": "int" },{"nresultaccuracycode":"input"}]
            });
            inputData = {
                "testmaster": {},
                "testparameter": {
                    nisadhocparameter: transactionStatus.NO,
                    nisvisible: transactionStatus.YES,
                    nstatus: transactionStatus.ACTIVE
                },
                "testsection": {},
                "testmethod": {},
                "testinstrumentcategory": {},
                "testpackagetest":{}
            };
            if (this.props.Login.parameterData.npredefinedcode === transactionStatus.YES) {
                customobject = {};
                customobject["spredefinedname"] = selectedRecord["spredefinedname"].trim();
                customobject["nstatus"] = transactionStatus.ACTIVE;
                customobject["ndefaultstatus"] = transactionStatus.YES;
                customobject["ngradecode"] = selectedRecord["ngradecode"] ? selectedRecord["ngradecode"].value ? selectedRecord["ngradecode"].value : -1 : -1;
            //     if (selectedRecord["sresultparacomment"]) {
            //     customobject["sresultparacomment"] = selectedRecord["sresultparacomment"].trim();}
            // }
            if (selectedRecord["spredefinedsynonym"]) {
                customobject["spredefinedsynonym"] = selectedRecord["spredefinedsynonym"].trim();}
            }
        } else {
            inputData = {
                "testmaster": {}
            };
        }
        inputData["userinfo"] = userInfo;
        inputData["testmaster"]["nstatus"] = transactionStatus.ACTIVE;
        inputData["testmaster"]["nsitecode"] = userInfo.nmastersitecode;
		//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
        inputData["isQualisLite"]=(this.props.Login.settings && parseInt(this.props.Login.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO;
        ;

        testColumns.forEach(function (items) {
            const mapkey = Object.keys(items)[0];
            const columns = Object.values(items)[0];
            columns.map(item => {
                const key = Object.keys(item)[0];
                const value = Object.values(item)[0];
                if (value === "input") {
                    return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key].value ? selectedRecord[key].value : -1 : -1;
                } else if (value === "int") {
                    return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key] : 0;
                } else if (value === "string") {
                    return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key].trim() : "";
                } else if (value === "float") {
                    return inputData[mapkey][key] = selectedRecord[key] ? selectedRecord[key] : 0;
                } else if (value === "customobject") {
                    return inputData[mapkey][key] = customobject;
                } else {
                    return null;
                }
            });
        });
        let postParam = undefined;
        if (operation === "create") {
            if (selectedRecord["nsectioncode"]) {
                inputData["testsection"]["nsectioncode"] = selectedRecord["nsectioncode"].value;
                inputData["testsection"]["ndefaultstatus"] = transactionStatus.YES;
                inputData["testsection"]["nstatus"] = transactionStatus.ACTIVE;
            }
            if (selectedRecord["nmethodcode"]) {
                inputData["testmethod"]["nmethodcode"] = selectedRecord["nmethodcode"].value;
                inputData["testmethod"]["ndefaultstatus"] = transactionStatus.YES;
                inputData["testmethod"]["nstatus"] = transactionStatus.ACTIVE;
            }

            if (selectedRecord["ninstrumentcatcode"]) {
                inputData["testinstrumentcategory"]["ninstrumentcatcode"] = selectedRecord["ninstrumentcatcode"].value;
                inputData["testinstrumentcategory"]["ndefaultstatus"] = transactionStatus.YES;
                inputData["testinstrumentcategory"]["nstatus"] = transactionStatus.ACTIVE;
            }


            if (selectedRecord["ntestpackagecode"]) {
                inputData["testpackagetest"]["ntestpackagecode"] = selectedRecord["ntestpackagecode"].value;
                inputData["testpackagetest"]["ndefaultstatus"] = transactionStatus.YES;
                inputData["testpackagetest"]["nstatus"] = transactionStatus.ACTIVE;
            }
        } else if (operation === "copy") {
            inputData["testmaster"]["ntestcode"] = this.props.Login.masterData.SelectedTest["ntestcode"]
        } else if (operation === "update") {
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
        }
        if((operation === "create" || operation === "update") && inputData["testparameter"]){
            inputData["testparameter"]["sdisplaystatus"] = selectedRecord["nparametertypecode"] && selectedRecord["nparametertypecode"].label;
        }

        this.setState({ nfilterTestCategory: { "label": selectedRecord.ntestcategorycode.label, "value": selectedRecord.ntestcategorycode.value } });
        if (operation !== "update") {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { defaultkeyname: "parametereventkey" }
            };
            this.props.updateStore(updateInfo);
        }
        //  let valid = true;
        // if (operation === "update" && (validateTest === undefined || validateTest === true)){       
        // if (valid){
        //ATE234 Janakumar -> ALPD-5518 Test Master-->Copy the test in test master and do save continue loading issue occurs
        //ATE234 Janakumar -> ALPD-5599 Test Master-->can't be able to copy the test
        let clearSelectedRecordField = [
                { "controlType": "textbox", "idsName":"IDS_TESTNAME", "dataField": "stestname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_SHORTNAME", "dataField": "sshortname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_PRICE", "dataField": "ncost", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_TESTPROCEDURE", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_TAT", "dataField": "ntat", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_TESTPLATFORM", "dataField": "stestplatform", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                
                { "controlType": "checkbox", "idsName": "IDS_ACCREDITED", "dataField": "naccredited", "width": "200px", "controlName": "ncategorybasedflow","isClearField":true,"preSetValue":63 },
                { "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "ntransactionstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":1 },
                { "controlType": "checkbox", "idsName": "IDS_TRAININGNEEDED", "dataField": "ntrainingneed", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                // { "controlType": "checkbox", "idsName": "IDS_DELTACHECK", "dataField": "ndeltacheck", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                // { "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "nneedresultentryalert", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                // { "controlType": "checkbox", "idsName": "IDS_SUBCODERESULTNEED", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 }
            ]
        if(operation === "create")
        {
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_ROUNDINGDIGITS", "dataField": "nroundingdigits", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true  });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_CONVERSIONOPERATOR", "dataField": "soperator", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_CONVERSIONFACTOR", "dataField": "nconversionfactor", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true  });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_DELTACHECKTIMEFRAME", "dataField": "ndeltacheckframe", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true  });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_DELTACHECKLIMIT", "dataField": "ndeltachecklimitcode", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true  });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_RESULTPARAMETERCOMMENTS", "dataField": "spredefinedcomments", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true  });
            clearSelectedRecordField.push({ "controlType": "textarea", "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true });
            clearSelectedRecordField.push({ "controlType": "checkbox", "idsName": "IDS_DELTACHECK", "dataField": "ndeltacheck", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 });
            clearSelectedRecordField.push({ "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "nneedresultentryalert", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4  });
            clearSelectedRecordField.push({ "controlType": "checkbox", "idsName": "IDS_SUBCODERESULTNEED", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4  });
           
        }
       if(operation === "copy")
        {
            clearSelectedRecordField = [];
        }
        const inputParam = {
            inputData: { ...inputData, validatetest: false },
            classUrl: "testmaster",
            operation: operation,
            methodUrl: "TestMaster",
            saveType,
            formRef, postParam, searchRef: this.searchRef,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData,clearSelectedRecordField }, saveType, formRef
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openModal", {},"",clearSelectedRecordField);
        }
        // }
    }


    onSaveReportInfoTest =(saveType,formRef) => {
        let postParam = undefined;
        let inputData =[];
        const selectedRecord = this.state.selectedRecord;
        postParam = {
            inputListName: "TestMaster",
            selectedObject: "SelectedTest",
            primaryKeyField: "ntestcode",
        };
        inputData["reportinfotest"] = {};
        inputData["reportinfotest"]["ntestcode"] =this.props.Login.masterData.SelectedTest.ntestcode;
        inputData["reportinfotest"]["sconfirmstatement"] =selectedRecord.sconfirmstatement;
        inputData["reportinfotest"]["sdecisionrule"] =selectedRecord.sdecisionrule;
        inputData["reportinfotest"]["ssopdescription"] =selectedRecord.ssopdescription;
        inputData["reportinfotest"]["stestcondition"] =selectedRecord.stestcondition;
        inputData["reportinfotest"]["sdeviationcomments"] =selectedRecord.sdeviationcomments;
        inputData["reportinfotest"]["smethodstandard"] =selectedRecord.smethodstandard;
        inputData["reportinfotest"]["sreference"] =selectedRecord.sreference;
        
        inputData["userinfo"]=  this.props.Login.userInfo;
        let dataState = this.state.dataState;
    
    
        const inputParam = {
          classUrl: this.props.Login.inputParam.classUrl,
          methodUrl: "ReportInfoTest",
          displayName: this.props.Login.screenName,
          inputData: inputData,
          selectedId: this.state.selectedRecord["ntestcode"],
          operation: "update", saveType, formRef, dataState,
          searchRef: this.searchRef,
          postParam: postParam
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_REPORTINFOTEST" }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

   handleFocus(e){
        e.target.select();
    }
    specDataStateChange = (event) => {
        this.setState({
            //TestMasterClinicalSpec
            //dataResult: process(this.props.Login.masterData.TestGroupTestClinicalSpec || [], event.dataState),
            dataResult: process(this.props.Login.masterData.TestMasterClinicalSpec || [], event.dataState),
            clinicalspecDataState: event.dataState
        });
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

    reloadData = () => {
        // this.searchRef.current.value = "";
        // const inputParam = {
        //     inputData: { "userinfo": this.props.Login.userInfo },
        //     classUrl: "testmaster",
        //     methodUrl: "TestMaster",
        //     userInfo: this.props.Login.userInfo,
        //     displayName: "IDS_TESTMASTER"
        // };
        // this.props.callService(inputParam);
         //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }        
        if (this.state.nfilterTestCategory.value) {
            let inputParam = {
                inputData: {
                //    ntestcategorycode: this.state.nfilterTestCategory.value,
                   ntestcategorycode:this.props.Login.masterData.SelectedTestCat&&this.props.Login.masterData.SelectedTestCat.ntestcategorycode,
                    userinfo: this.props.Login.userInfo,
                    nfilterTestCategory: this.state.nfilterTestCategory
                },
                classUrl: "testmaster",
                methodUrl: "TestMasterByCategory"
            }
            this.props.changeTestCategoryFilter(inputParam, this.props.Login.masterData.filterTestCategory);
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TESTCATEGORYNOTAVAILABLE" }));
        }
    }

    componentDidUpdate(previousProps) {
        let isComponentUpdated = false;
        let selectedRecord = this.state.selectedRecord || {};
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            isComponentUpdated = true;
        }

        let userRoleControlRights = this.state.userRoleControlRights || [];
        let controlMap = this.state.controlMap || new Map();
        if (this.props.Login.userInfo && this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const nformCode = this.props.Login.userInfo.nformcode;
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[nformCode] && Object.values(this.props.Login.userRoleControlRights[nformCode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode));
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, nformCode);
            isComponentUpdated = true;
        }
        let nfilterTestCategory = this.state.nfilterTestCategory || {};
        let filterTestCategory = this.state.filterTestCategory || {};

        if (this.props.Login.masterData.filterTestCategory !== previousProps.Login.masterData.filterTestCategory) {
            const testCategoryMap = constructOptionList(this.props.Login.masterData.filterTestCategory || [], "ntestcategorycode",
                "stestcategoryname", 'ntestcategorycode', 'ascending', false);
            filterTestCategory = testCategoryMap.get("OptionList");
            if (testCategoryMap.get("DefaultValue")) {
                nfilterTestCategory = testCategoryMap.get("DefaultValue");
            } else if (filterTestCategory && filterTestCategory.length > 0) {
                nfilterTestCategory = filterTestCategory[0];
            }
            isComponentUpdated = true;
        } else if (this.props.Login.masterData.nfilterTestCategory !== previousProps.Login.masterData.nfilterTestCategory) {
            nfilterTestCategory = this.props.Login.masterData.nfilterTestCategory;
            isComponentUpdated = true;
        }
        if (isComponentUpdated) {
            this.setState({ nfilterTestCategory, userRoleControlRights, controlMap, selectedRecord, filterTestCategory });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.filterTestCategory) {

            breadCrumbData.push(
                {
                    "label": "IDS_TESTCATEGORY",
                    "value": this.props.Login.masterData.SelectedTestCat ? this.props.Login.masterData.SelectedTestCat.stestcategoryname : "NA"
                }
            );
        }
        return breadCrumbData;
    }


    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined,
                testData: {}, parameterData: {}, otherTestData: {}, formulaData: {}
            }
        }
        this.props.updateStore(updateInfo);
    }

}

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStateToProps, {
    callService, crudMaster, getTestMaster, addTest, updateStore, formulaChangeFunction,
    filterColumnData, getTestDetails, addParameter, validateEsignCredential, addCodedResult, addParameterSpecification,addClinicalSpecification,
    getAvailableData, addFormula, changeTestCategoryFilter, addTestFile, viewAttachment, getActiveTestContainerTypeById, addContainerType,
    ReportInfoTest, getUnitConversion, getConversionOperator,addPredefinedModal
})(injectIntl(TestMaster));