import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import TestGroupParameterTab from './TestGroupParameterTab';
import CustomTab from '../../components/custom-tabs/custom-tabs.component';
import { showEsign, sortData } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { parameterType, transactionStatus } from '../../components/Enumeration';
import EditTestGroupParameter from './EditTestGroupParameter';
import AddCodedResult from '../testmanagement/AddCodedResult';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import AddSpecification from '../testmanagement/AddSpecification';
import TemplateForm from '../checklist/checklist/TemplateForm';
import { toast } from 'react-toastify';
import TestGroupMaterialTab from './TestGroupMaterialTab';
import AddTestGroupTestMaterial from './AddTestGroupTestMaterial';
import AddTestGroupNumericSpecification from './AddTestGroupNumericSpecification';
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import TestGroupRulesEngineTab from './TestGroupRulesEngineTab';
import AddSubCodedResult from '../testmanagement/AddSubCodedResult';
import AddRulesCopy from '../testmanagement/AddRulesCopy';

class TestGroupTestTab extends Component  {

    constructor(props) {
        super(props);
        this.state = {
            selectedRecord: {}
        }
        this.confirmMessage = new ConfirmMessage();

        // this.codedResultMandatory = [{ "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true },
        // { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true },
        // { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true }];

        // this.clinicalSpecMandatory = [{ "idsName": "IDS_GENDER", "dataField": "ngendercode", "width": "200px", "mandatory": true },
        // { "idsName": "IDS_FROMAGE", "dataField": "nfromage", "width": "200px", "mandatory": true },
        // { "idsName": "IDS_TOAGE", "dataField": "ntoage", "width": "200px", "mandatory": true }];
    }

    render() {

        
        this.clinicalSpecMandatory = [{ "idsName": "IDS_GENDER", "dataField": "ngendercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
        { "idsName": "IDS_FROMAGE", "dataField": "nfromage", "width": "200px", "mandatory": true },
        { "idsName": "IDS_TOAGE", "dataField": "ntoage", "width": "200px", "mandatory": true }]
           

        let nneedresultentryalert = this.state.selectedRecord["nneedresultentryalert"] ;
        nneedresultentryalert === 3 ? 
        this.codedResultMandatory = [{ "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true },
        { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true },
        { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true },
        { "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatory": true }] 
        : 
        this.codedResultMandatory = [{ "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true },
        { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true },
        { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true }];
    //ALPD-4984
	//Added by Neeraj 
        this.copyRulesMandatory=[
            { "idsName": "IDS_PRODUCTCATEGORY", "dataField": "nproductcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_ROOT", "dataField": "ntemplatemanipulationcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_SPECIFICATION", "dataField": "nallottedspeccode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_RULESENGINENAME", "dataField": "ntestgrouprulesenginecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
        ]
        if(this.state.selectedRecord && this.state.selectedRecord["nproductcatcode"] && this.state.selectedRecord["nproductcatcode"].item &&
            this.state.selectedRecord["nproductcatcode"].item.ncategorybasedflow===transactionStatus.NO){
                this.copyRulesMandatory.push( {"idsName": "IDS_PRODUCT", "dataField": "nproductcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},) 
            }

        if(this.state.selectedRecord && this.state.selectedRecord["nallottedspeccode"] && this.state.selectedRecord["nallottedspeccode"].item &&
            this.state.selectedRecord["nallottedspeccode"].item.ncomponentrequired===transactionStatus.YES){
                this.copyRulesMandatory.push({"idsName": "IDS_COMPONENT", "dataField": "ncomponentcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"}) 
            }

        if (this.props.masterData.TestGroupTestClinicalSpec) {
            sortData(this.props.masterData.TestGroupTestClinicalSpec, "ascending", "nfromage");
        }


        this.paramColumnList = [
            { "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
            { "idsName": "IDS_PARAMETERTYPE", "dataField": "nparametertypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        ]
        if (this.state.selectedRecord["parameterTypeCode"] && this.state.selectedRecord["parameterTypeCode"] === parameterType.NUMERIC) {
            this.paramColumnList = [
                { "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_PARAMETERTYPE", "dataField": "nparametertypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                { "idsName": "IDS_ROUNDINGDIGITS", "dataField": "nroundingdigits", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_UNIT", "dataField": "nunitcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                
            ]
        }
        if (this.state.selectedRecord["parameterTypeCode"] && this.state.selectedRecord["parameterTypeCode"] === parameterType.PREDEFINED) {
            this.paramColumnList = [
                { "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_PARAMETERTYPE", "dataField": "nparametertypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
               // { "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
              //  { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        }
        const paramMandatoryFields = [];

        this.paramColumnList.forEach(item => item.mandatory === true ?
            paramMandatoryFields.push(item) : ""
        );
        this.materialColumnList = [
            { "idsName": "IDS_MATERIALTYPE", "dataField": "nmaterialtypecode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_MATERIALCATEGORY", "dataField": "nmaterialcatcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "idsName": "IDS_MATERIALNAME", "dataField": "nmaterialcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }

        ]
        return (
            <>
                    <div className='grouped-param-inner grouped-tab-inner'>
                        {!this.props.testView ?
                            <CustomTab paneHeight={this.props.paneHeight} tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                            :
                            <CustomTab paneHeight={this.props.paneHeight} tabDetail={this.testTabDetail()} onTabChange={this.onTabChange} />

                        }
                    </div>

                {this.props.openChildModal && this.props.screenName &&
                    <SlideOutModal
                        show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        showSaveContinue={this.props.screenName === "IDS_TESTGROUPMATERIAL" || this.props.screenName === "IDS_CODEDRESULT" || 
                                          this.props.screenName === "IDS_SUBCODEDRESULT" || this.props.screenName === "IDS_CLINICALSPEC"?true:false}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        onSaveClick={this.onSaveClick}
                        //showSaveContinue={this.props.screenName === "IDS_SUBCODEDRESULT"?true:false}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.screenName === "IDS_PARAMETER" ? paramMandatoryFields :
                            this.props.screenName === "IDS_CODEDRESULT" ? this.codedResultMandatory :
                             this.props.screenName === "IDS_CLINICALSPEC" ? this.clinicalSpecMandatory : 
                             this.props.screenName === "IDS_TESTGROUPMATERIAL" ? this.materialColumnList : 
                             this.props.screenName === "IDS_RULESFROM" ? this.copyRulesMandatory:[]}
                        addComponent={this.props.loadEsign ?
                            <Esign
                                operation={this.props.operation}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_PARAMETER" ?
                                <>
                                    <EditTestGroupParameter
                                        selectedRecord={this.state.selectedRecord || {}}
                                        testGroupInputData={this.props.testGroupInputData}
                                        onComboChange={this.onComboChange}
                                        onInputOnChange={this.onInputOnChange}
                                        onNumericInputChange={this.onNumericInputChange}
                                        onFocus={this.handleFocus}
                                    //TestGroupTestClinicalSpec={this.props.masterData.TestGroupTestClinicalSpec}
                                    />
                                    {this.state.selectedRecord["parameterTypeCode"] === parameterType.PREDEFINED ||
                                        this.state.selectedRecord["parameterTypeCode"] === parameterType.CHARACTER ||
                                        this.state.selectedRecord["parameterTypeCode"] === parameterType.NUMERIC ?
                                        <Row>
                                            <Col>
                                                <div className="horizontal-line"></div>
                                            </Col>
                                        </Row> : ""
                                    }

                                    {/* {this.state.selectedRecord["parameterTypeCode"] === parameterType.PREDEFINED &&
                                        <Row>
                                            <AddCodedResult
                                                onInputOnChange={this.onInputOnChange}
                                                parameterData={this.props.parameterData}
                                                selectedRecord={this.state.selectedRecord}
                                                onComboChange={this.onComboChange}
                                                addSubCodedResult={this.addSubCodedResult}
                                                deleteSubCodedResult={this.deleteSubCodedResult}
                                                selectedsubcodedresult={this.state.selectedsubcodedresult || []}
                                                selectsubcodedelete={this.state.selectsubcodedelete || []}
                                                controlMap={this.props.controlMap}
                                                userRoleControlRights={this.props.userRoleControlRights}

                                            />
                                        </Row>
                                        } */}
                                    {this.state.selectedRecord["parameterTypeCode"] === parameterType.CHARACTER &&
                                        <Row>
                                            <Col md="12">
                                                <FormTextarea
                                                    name={"scharname"}
                                                    label={this.props.intl.formatMessage({ id: "IDS_TESTCHARACTER" })}
                                                    onChange={(event) => this.onInputOnChange(event, 1)}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_TESTCHARACTER" })}
                                                    value={this.state.selectedRecord["scharname"]}
                                                    rows="2"
                                                    required={false}
                                                    maxLength={255}
                                                >
                                                </FormTextarea>
                                            </Col>
                                        </Row>}
                                    {this.state.selectedRecord["parameterTypeCode"] === parameterType.NUMERIC   && this.props.filterData  && this.props.filterData.nsampletypecode && this.props.filterData.nsampletypecode.item && this.props.filterData.nsampletypecode.item.nclinicaltyperequired ===transactionStatus.NO && //&& this.props.masterData.selectedNode.nsampletypecode !== SampleType.CLINICALTYPE &&
                                        <AddSpecification
                                               grade={this.props.testGroupInputData.grade}
                                            selectedRecord={this.state.selectedRecord}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            onFocus={this.handleFocus}
                                        />}
                                </> :
                                this.props.screenName === "IDS_CODEDRESULT" ?
                                    <AddCodedResult
                                        onInputOnChange={this.onInputOnChange}
                                        parameterData={this.props.parameterData}
                                        selectedRecord={this.state.selectedRecord}
                                        onComboChange={this.onComboChange}
                                        addSubCodedResult={this.addSubCodedResult}
                                        deleteSubCodedResult={this.deleteSubCodedResult}
                                        selectedsubcodedresult={this.state.selectedsubcodedresult || []}
                                        controlMap={this.props.controlMap}
                                        userRoleControlRights={this.props.userRoleControlRights}
                                        userInfo={this.props.userInfo}
                                    />
                                    :
                                    this.props.screenName === "IDS_SUBCODEDRESULT" ?
                                        <AddSubCodedResult
                                            onInputOnChange={this.onInputOnChange}
                                            parameterData={this.props.parameterData}
                                            selectedRecord={this.state.selectedRecord}
                                            onComboChange={this.onComboChange}
                                            addSubCodedResult={this.addSubCodedResult}

                                        />
                                        :
                                        this.props.screenName === "IDS_CLINICALSPEC" ?
                                            <AddTestGroupNumericSpecification
                                                //gradenew={this.props.testGroupInputData.grade||[]}
                                                onInputOnChange={this.onInputOnChange}
                                                parameterData={this.props.parameterData}
                                                selectedRecord={this.state.selectedRecord}
                                                onComboChange={this.onComboChange}
                                                onNumericInputChange={this.onNumericInputChange}
                                            />
                                           : this.props.screenName === "IDS_RULESFROM" ?
                                            <AddRulesCopy
                                                getProductCategory={this.props.getProductCategory}
                                                selectedRecord={this.state.selectedRecord}
                                                onComboChange={this.onRulesComboChange}
                                                getSpecificationList={this.props.getSpecificationList}
                                                getComponentList={this.props.getComponentList}
                                                getProductList={this.props.getProductList}
                                                getProfileRoot={this.props.getProfileRoot}
                                                getRulesList={this.props.getRulesList}
                                            />
                                            : <AddTestGroupTestMaterial
                                                materialType={this.props.materialType}
                                                selectedRecord={this.state.selectedRecord}
                                                materialCategoryList={this.props.materialCategoryList}
                                                materialList={this.props.materialList}
                                                onComboChange={this.onComboChange}
                                                onInputOnChange={this.onInputOnChange}
                                                onNumericInputChange={this.onNumericInputChange}

                                            />

                        }
                    />
                }
                {this.props.testGroupCheckList && this.props.testGroupCheckList.templateData &&
                    this.props.testGroupCheckList.templateData.length > 0 &&
                    <TemplateForm
                        templateData={this.props.testGroupCheckList.templateData}
                        handleClose={this.handleClose}
                        screenName="IDS_VIEWCHECKLIST"
                        needSaveButton={false}
                        viewScreen={this.props.openTemplateModal}
                        onTemplateInputChange={this.onTemplateInputChange}
                        onTemplateComboChange={this.onTemplateComboChange}
                        onTemplateDateChange={this.onTemplateDateChange}
                    />
                }
            </>
        );
    }

    handleFocus(e){
        e.target.select();
    }

    onTemplateInputChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }
    onTemplateComboChange = (comboData, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }
    onTemplateDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state.selectedRecord || {};
        if (dateValue === null) {
            dateValue = new Date();
        }
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    handleClose = () => {
        let updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {},
                testGroupCheckList: {},
                openTemplateModal: false
            }
        };
        this.props.updateStore(updateInfo);
    }

    closeModal = () => {
        if (this.props.screenName === "IDS_SUBCODEDRESULT") {
            //screenName = "IDS_CODEDRESULT";
            //operation = "update";
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    operation: "create", selectedId: null,
                    openChildModal: true, screenName: "IDS_CODEDRESULT"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            let loadEsign = this.props.loadEsign;
            let openChildModal = this.props.openChildModal;
            let selectedRecord = this.props.selectedRecord;
            let selectedsubcodedresult = this.state.selectedsubcodedresult;
            if (this.props.loadEsign) {
                if (this.props.operation === "delete" || this.props.operation === "Default") {
                    loadEsign = false;
                    openChildModal = false;
                    selectedRecord = {};
                } else {
                    loadEsign = false;
                    // selectedRecord["agree"] = 4;
                    selectedRecord['esignpassword'] = ""
                    selectedRecord['esigncomments'] = ""
                    selectedRecord['esignreason'] = ""
                }
            } else {
                openChildModal = false;
                selectedRecord = {};

            }
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { openChildModal, loadEsign, selectedRecord, selectedsubcodedresult }
            }
            this.props.updateStore(updateInfo);
            //this.setState({selectedsubcodedresult: []}); 
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

    EditSpecDetails = (viewdetails, ncontrolCode) => {

        this.props.addTestGroupNumericTab("update", viewdetails, this.props.userInfo, { testgroupspecification: this.props.masterData.SelectedSpecification }, this.props.masterData, ncontrolCode)
    };

    DeleteSpecDetails = (viewdetails, ncontrolCode) => {
        this.SpecConfirmDelete("delete", 1, viewdetails, ncontrolCode)
    };


    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_PARAMETER",
            <TestGroupParameterTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                masterData={this.props.masterData}
                deleteAction={this.deleteAction}
                onSwitchChange={this.onSwitchChange}
                addTestFile={this.props.addTestFile}
                viewTestFile={this.viewTestFile}
                defaultRecord={this.defaultRecord}
                filterData={this.props.filterData}
                getTestGroupParameter={this.props.getTestGroupParameter}
                editTestGroupParameter={this.props.editTestGroupParameter}
                addTestGroupCodedResult={this.props.addTestGroupCodedResult}
                addTestGroupNumericTab={this.props.addTestGroupNumericTab}
                viewTestGroupCheckList={this.props.viewTestGroupCheckList}
                EditSpecDetails={this.EditSpecDetails}
                DeleteSpecDetails={this.DeleteSpecDetails}
                dataState={this.props.dataState}
                dataStateChange={this.props.dataStateChange}

            />);
        return tabMap;
    }
    testTabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_PARAMETER",
            <TestGroupParameterTab
                paneHeight={this.props.paneHeight}
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                masterData={this.props.masterData}
                deleteAction={this.deleteAction}
                onSwitchChange={this.onSwitchChange}
                addTestFile={this.props.addTestFile}
                viewTestFile={this.viewTestFile}
                defaultRecord={this.defaultRecord}
                filterData={this.props.filterData}
                getTestGroupParameter={this.props.getTestGroupParameter}
                editTestGroupParameter={this.props.editTestGroupParameter}
                addTestGroupCodedResult={this.props.addTestGroupCodedResult}
                subCodedResultView={this.props.subCodedResultView}
                addTestGroupNumericTab={this.props.addTestGroupNumericTab}
                viewTestGroupCheckList={this.props.viewTestGroupCheckList}
                EditSpecDetails={this.EditSpecDetails}
                DeleteSpecDetails={this.DeleteSpecDetails}
                hasDynamicColSize={true}
                dataState={this.props.dataState}
                dataStateChange={this.props.dataStateChange}
            />);
        tabMap.set("IDS_MATERIAL",
            <TestGroupMaterialTab
                paneHeight={this.props.paneHeight}
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                masterData={this.props.masterData}
                ConfirmDelete={this.ConfirmDelete}
                getDataForTestMaterial={this.props.getDataForTestMaterial}
                getTestGroupMaterial={this.props.getTestGroupMaterial}
                getDataForEditTestMaterial={this.props.getDataForEditTestMaterial}
                selectedRecord={this.state.selectedRecord}

            />);
            this.props.isrulesenginerequired &&
                tabMap.set("IDS_RULESENGINE",
                <TestGroupRulesEngineTab
                    paneHeight={this.props.paneHeight}
                    getTestGroupRulesEngineAdd={this.props.getTestGroupRulesEngineAdd}
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.props.userRoleControlRights}
                    userInfo={this.props.userInfo}
                    selectedRecord={this.state.selectedRecord}
                    masterData={this.props.masterData}
                    settings={this.props.settings}
                    skipRulesEngine={this.props.skipRulesEngine}
                    takeRulesEngine={this.props.takeRulesEngine}
                    getEditTestGroupRulesEngine={this.props.getEditTestGroupRulesEngine}
                    getSelectedTestGroupRulesEngine={this.props.getSelectedTestGroupRulesEngine}
                    ConfirmDeleteRule={this.props.ConfirmDeleteRule}
                    approveVersion={this.props.approveVersion}
                    openflowview={this.props.openflowview}
                    handlePageChangeRuleEngine={this.props.handlePageChangeRuleEngine}
                    viewOutcome={this.props.viewOutcome}
                    filterParamRulesEngine={this.props.filterParamRulesEngine}
                    filterTransactionList={this.props.filterTransactionList}
                    saveExecutionOrder={this.props.saveExecutionOrder}
                    copyVersion={this.props.copyVersion}
    
                />);           
      
        return tabMap;
    }
    ConfirmDelete = (operation, deleteId, selectedRecord) => {
        this.confirmMessage.confirm(
            "deleteMessage",
            this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () =>
                this.DeleteTestMaterial(
                    operation,
                    deleteId, selectedRecord
                )
        );
    };

    SpecConfirmDelete = (operation, deleteId, selectedRecord, ncontrolCode) => {
        this.confirmMessage.confirm(
            "deleteMessage",
            this.props.intl.formatMessage({ id: "IDS_DELETE" }),
            this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }),
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () =>
                this.deleteAction(selectedRecord, "delete", ncontrolCode, "TestGroupAddSpecification", "openChildModal")
        );
    };
    DeleteTestMaterial = (operation, ncontrolCode) => {
        let selectedSpecification = this.props.masterData.SelectedSpecification;
        if (selectedSpecification.napprovalstatus === transactionStatus.DRAFT
            || selectedSpecification.napprovalstatus === transactionStatus.CORRECTION) {
            let selectedRecord = this.state.selectedRecord
            let inputData = [];
            inputData = { ntreeversiontempcode: this.props.masterData.selectedNode.ntreeversiontempcode }

            inputData["testgrouptestmaterial"] = {
                ntestgrouptestmaterialcode: this.props.masterData.selectedMaterial.ntestgrouptestmaterialcode,
                ntestgrouptestcode: this.props.masterData.selectedMaterial.ntestgrouptestcode,

            };

            inputData["userinfo"] = this.props.userInfo;
            const inputParam = {
                methodUrl: "TestGroupTestMaterial",
                classUrl: this.props.inputParam.classUrl,
                inputData: inputData,
                operation: "delete",
                selectedRecord:{...this.state.selectedRecord}

            };
            const masterData = this.props.masterData;
            if (
                showEsign(
                    this.props.esignRights,
                    this.props.userInfo.nformcode,
                    ncontrolCode
                )
            ) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData },
                        openModal: true,
                        screenName: "IDS_TESTGROUPMATERIAL",
                        operation: operation.operation,
                    },
                };
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, masterData, "openChildModal", {});
            }
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
        }
    }
    onSaveClick = (saveType, formRef) => {
        let inputParam = {};
        // if(this.props.screenName === "IDS_TEST" 
        //     || this.props.screenName === "IDS_EDITTESTGROUPTEST") {
        //     inputParam = this.onSaveTest(saveType, formRef);
        // } else 
        let clearSelectedRecordField =[];
        if (this.props.screenName === "IDS_FORMULA") {
            inputParam = this.onSaveFormula(saveType, formRef);
        } else if (this.props.screenName === "IDS_PARAMETER") {
            inputParam = this.onSaveParameter(saveType, formRef);
        } else if (this.props.screenName === "IDS_CODEDRESULT") {
            if ((this.state.selectedRecord["nneedsubcodedresult"] === 3 && this.state.selectedsubcodedresult.length>0) ||(this.state.selectedRecord["nneedsubcodedresult"] === 4) ) {
            inputParam = this.onSaveCodedResult(saveType, formRef);
            }else
            {
                return toast.warn(this.props.intl.formatMessage({ id: "IDS_ADDSUBCODEDRESULT" }));
            }
            clearSelectedRecordField = [
                { "controlType": "textarea", "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_RESULTPARAMETERCOMMENTS", "dataField": "spredefinedcomments", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "nneedresultentryalert", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "checkbox", "idsName": "IDS_SUBCODERESULTNEED", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "textarea", "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            ]

        } else if (this.props.screenName === "IDS_SUBCODEDRESULT") {
            return this.onSaveSubCodedResult(saveType, formRef);

        } else if (this.props.screenName === "IDS_CLINICALSPEC") {
            inputParam = this.onSaveSpecification(saveType, formRef);
            clearSelectedRecordField = [
                
                { "controlType": "textarea", "idsName": "IDS_FROMAGE", "dataField": "nfromage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_TOAGE", "dataField": "ntoage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_LOWA", "dataField": "nlowa", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_HIGHA", "dataField": "nhigha", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_MINVALUES", "dataField": "sminloq", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_MAXVALUES", "dataField": "smaxloq", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_DISREGARDED", "dataField": "sdisregard", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_LOWB", "dataField": "nlowb", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_HIGHB", "dataField": "nhighb", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_MINVALUES", "dataField": "sminlod", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_MAXVALUES", "dataField": "smaxlod", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_DEFAULTRESULT", "dataField": "sresultvalue", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                
                //{ "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                //{ "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "nlinkdefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            ]
        }
        else if (this.props.screenName === "IDS_TESTGROUPMATERIAL") {
            inputParam = this.onSaveMaterial(saveType, formRef);
            clearSelectedRecordField = [
                
                { "controlType": "textarea", "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                
            ]
        } else if (this.props.screenName === "IDS_RULESFROM") {
            inputParam = this.onSaveCopyRules(saveType, formRef);
        }
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {    
            //(this.props.screenName !== "IDS_CODEDRESULT")
            // if(this.props.submit!=="SUBCODERESULT")
            if (this.props.screenName === "IDS_TESTGROUPMATERIAL" || this.props.screenName === "IDS_CODEDRESULT" || 
                this.props.screenName === "IDS_CLINICALSPEC"
            )
            {
               this.props.crudMaster(inputParam, this.props.masterData, "openChildModal", {},"",clearSelectedRecordField);
            }
            else
            {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal", {});
            }
        }
    }
    //ALPD-4984
	//Added by Neeraj 
    onSaveCopyRules=(saveType, formRef)=>{
        let ntestgrouprulesenginecode=[];
        this.state.selectedRecord.ntestgrouprulesenginecode.length>0 && this.state.selectedRecord.ntestgrouprulesenginecode.map(item=>{
            ntestgrouprulesenginecode.push(item.item.item);
        })
        let inputData={
            userinfo: this.props.userInfo,
            ncomponentcode:this.state.selectedRecord.ncomponentcode && this.state.selectedRecord.ncomponentcode.value||-1,
            nallottedspeccode:this.state.selectedRecord.nallottedspeccode && this.state.selectedRecord.nallottedspeccode.value,
            ntestcode:this.props.masterData.SelectedTest.ntestcode,
            ntestgrouptestcode:this.props.masterData.SelectedTest.ntestgrouptestcode,
            selectedSpecCode:this.props.masterData.SelectedSpecification.nallottedspeccode,
            selectedComponentCode:this.props.masterData.SelectedComponent && 
            this.props.masterData.SelectedComponent.ncomponentcode||-1,
            selectedRules:ntestgrouprulesenginecode,
            selectedValueForAudit:{
            sproductcatname:this.state.selectedRecord.nproductcatcode && this.state.selectedRecord.nproductcatcode.label||'NA',
            sproductname:this.state.selectedRecord.nproductcode && this.state.selectedRecord.nproductcode.label||'NA',
            sspecname:this.state.selectedRecord.nallottedspeccode && this.state.selectedRecord.nallottedspeccode.label||'NA',
            scomponentname:this.state.selectedRecord.ncomponentcode && this.state.selectedRecord.ncomponentcode.label||'NA',
            stestsynonym:this.props.masterData.SelectedTest.stestsynonym||'NA',
            sleveldescription:this.state.selectedRecord.ntemplatemanipulationcode && this.state.selectedRecord.ntemplatemanipulationcode.label||'NA',
            }
        }
        const inputParam = {
        inputData,
        classUrl: "testgrouprulesengine",
        operation: "copy",
        methodUrl: "TestGroupRulesEngine",
        saveType, formRef, searchRef: this.searchRef,
        // postParam: {
        //     inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
        //     primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
        //     fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
        //     masterData: this.props.masterData, searchFieldList: this.searchFieldList
        // }
    }
    return inputParam;
    }

    onSaveParameter = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const parameterList = ["ntestgrouptestparametercode", "ntestgrouptestcode", "ntestparametercode", "sparametersynonym", "nroundingdigits",
            "nresultmandatory", "nreportmandatory", "sspecdesc", "nsorter","nisadhocparameter"];
        let testGroupTestParameter = {
            nparametertypecode: selectedRecord.nparametertypecode.value,
            sdisplaystatus: selectedRecord.nparametertypecode.label,
            //ALPD-4363
            nunitcode: selectedRecord.nunitcode ? selectedRecord.nunitcode.value : -1,
            nresultaccuracycode: selectedRecord.nresultaccuracycode ? selectedRecord.nresultaccuracycode.value : -1,
            nchecklistversioncode: selectedRecord.nchecklistversioncode ? selectedRecord.nchecklistversioncode.value : -1
        }
        parameterList.map(item => {
            return testGroupTestParameter[item] = selectedRecord[item] ? selectedRecord[item] : "";
        });
        let inputData = {
            testgrouptestparameter: testGroupTestParameter,
            userinfo: this.props.userInfo
        };
        if (selectedRecord.nparametertypecode.value === parameterType.NUMERIC) {
            let testGroupTestNumericParameter = {};
            const numericList = ["sminlod", "smaxlod", "sminb", "smina", "smaxa", "smaxb", "sminloq", "smaxloq", "sdisregard", "sresultvalue"];
            testGroupTestNumericParameter["ntestgrouptestparametercode"] = selectedRecord.ntestgrouptestparametercode;
            testGroupTestNumericParameter["ngradecode"] =selectedRecord.ngradecode? selectedRecord.ngradecode.value ||-1:-1;
            numericList.map(item => {
                return testGroupTestNumericParameter[item] = selectedRecord[item] ? selectedRecord[item] === "0" ? selectedRecord[item] : selectedRecord[item].replace(/^0+/, '') : null;
            });
            inputData["testgrouptestnumericparameter"] = testGroupTestNumericParameter;
            if (selectedRecord.ntestformulacode) {
                const testFormula = selectedRecord.ntestformulacode.item;
                const testgrouptestformula = {
                    ntestgrouptestparametercode: selectedRecord.ntestgrouptestparametercode,
                    ntestgrouptestcode: selectedRecord.ntestgrouptestcode,
                    ntestformulacode: testFormula.ntestformulacode,
                    sformulacalculationcode: testFormula.sformulacalculationcode,
                    sformulacalculationdetail: testFormula.sformulacalculationdetail,
                    ntransactionstatus: transactionStatus.YES
                };
                inputData["testgrouptestformula"] = testgrouptestformula;
            } else {
                inputData["testgrouptestformula"] = null;
            }
        } else if (selectedRecord.nparametertypecode.value === parameterType.CHARACTER) {
            const characterList = ["ntestgrouptestparametercode", "scharname"];
            let testGroupTestCharParameter = {};
            characterList.map(item => {
                return testGroupTestCharParameter[item] = selectedRecord[item] ? selectedRecord[item] : "";
            });
            inputData["testgrouptestcharparameter"] = testGroupTestCharParameter;
        }
        //  else if (selectedRecord.nparametertypecode.value === parameterType.PREDEFINED) {
        //     const testGroupTestPredefParameter = {
        //         ntestgrouptestparametercode: selectedRecord.ntestgrouptestparametercode,
        //         ngradecode: selectedRecord.ngradecode.value,
        //         spredefinedname: selectedRecord.spredefinedname,
        //         ntestgrouptestpredefcode: selectedRecord.ntestgrouptestpredefcode,
        //         ndefaultstatus: selectedRecord.ndefaultstatus
        //     }
        //     inputData["testgrouptestpredefparameter"] = testGroupTestPredefParameter;
        // }
        //console.log("input data:", inputData);
        const inputParam = {
            inputData,
            classUrl: "testgroup",
            operation: "update",
            methodUrl: "TestGroupParameter",
            saveType, formRef, searchRef: this.searchRef,
            postParam: {
                inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
                fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                masterData: this.props.masterData, searchFieldList: this.searchFieldList
            }
        }
        return inputParam;
    }

    onSaveFormula = (saveType, formRef) => {
        const masterData = this.props.masterData;
        const selectedRecord = this.state.selectedRecord;
        const selectedParameter = masterData.selectedParameter;
        const testFormulaArray = selectedRecord.ntestformulacode.map(test => {
            return {
                ntestgrouptestcode: selectedParameter.ntestgrouptestcode,
                ntestgrouptestparametercode: selectedParameter.ntestgrouptestparametercode,
                ntestformulacode: test.item.ntestformulacode,
                sformulacalculationcode: test.item.sformulacalculationcode,
                sformulacalculationdetail: test.item.sformulacalculationdetail,
                ntransactionstatus: transactionStatus.NO
            }
        });
        const inputData = {
            testgroupspecification: masterData.SelectedSpecification,
            testgrouptestformula: testFormulaArray,
            userinfo: this.props.userInfo
        }
        const inputParam = {
            inputData,
            classUrl: "testgroup",
            operation: this.props.operation,
            methodUrl: "TestGroupTestFormula",
            saveType, formRef, searchRef: this.searchRef,
            postParam: {
                inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
                fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                masterData: this.props.masterData, searchFieldList: this.searchFieldList
            }
        }
        return inputParam;
    }

    onSaveCodedResult = (saveType, formRef) => {

        const selectedRecord = this.state.selectedRecord;
        const selectedsubcodedresult = this.state.selectedsubcodedresult;
            //const selectedsubcodedresult = this.state.selectedsubcodedresult;
            const testgroupsubcoded = [];
            const testGroupPredefParameter = {
                ndefaultstatus: transactionStatus.NO,
                nstatus: transactionStatus.ACTIVE,
                ntestgrouptestpredefcode: selectedRecord["ntestgrouptestpredefcode"],
                ntestgrouptestparametercode: this.props.masterData.selectedParameter["ntestgrouptestparametercode"],
                ngradecode: selectedRecord["ngradecode"].value,
                spredefinedname: selectedRecord["spredefinedname"],
                //sresultparacomment: selectedRecord["sresultparacomment"],
                spredefinedsynonym: selectedRecord["spredefinedsynonym"],
                spredefinedcomments: selectedRecord["spredefinedcomments"],
                salertmessage: selectedRecord["salertmessage"],
                nneedresultentryalert: selectedRecord["nneedresultentryalert"],
                nneedsubcodedresult: selectedRecord["nneedsubcodedresult"],
                ntestpredefinedcode: this.props.masterData.selectedParameter["ntestpredefinedcode"],

            };
            const inputParam = {
                inputData: {
                    testgrouptestpredefinedparameter: testGroupPredefParameter,
                    userinfo: this.props.userInfo,
                    testgroupspecification: this.props.masterData.SelectedSpecification,
                    testgroupsubcoded: this.state.selectedsubcodedresult,
                    deletetestgroupsubcoded: this.state.selectsubcodedelete,
                    addsubcodedresult : this.state.selectedsubcodedresult.filter(x =>!x.hasOwnProperty('ntestgrouptestpredefsubcode') )|| []

                },

                classUrl: "testgroup",
                operation: this.props.operation,
                methodUrl: "TestGroupPredefParameter",
                saveType, formRef, searchRef: this.searchRef,
                selectedRecord: {...this.state.selectedRecord},
                postParam: {
                    inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                    primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
                    fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                    masterData: this.props.masterData, searchFieldList: this.searchFieldList
                }
            }
            //this.setState({selectedsubcodedresult: []}); 
            return inputParam;

        
    }



    onSaveSubCodedResult = (saveType, formRef) => {
        // const ssubcodedresult = this.state.selectedRecord["ssubcodedresult"];
        let selectedsubcodedresult = [];
        //let addsubcodedresult = [];
        selectedsubcodedresult["ssubcodedresult"] = [];
        selectedsubcodedresult = this.state.selectedsubcodedresult || [];
        //addsubcodedresult = this.state.selectedsubcodedresult.filter(x =>!x.hasOwnProperty('ntestgrouptestpredefsubcode') )|| [];
        let ssubcodedresult = this.state.selectedRecord["ssubcodedresult"];
        selectedsubcodedresult.push({ "ssubcodedresult": this.state.selectedRecord["ssubcodedresult"] });
        const selectedRecord = this.state.selectedRecord
        delete selectedRecord["ssubcodedresult"]
        let openChildModal=false;
        let screenName= "IDS_CODEDRESULT";
        if(saveType===2)
        {
            openChildModal=true;
            screenName= "IDS_SUBCODEDRESULT";
        }
        else
        {
            screenName= "IDS_CODEDRESULT";
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                //operation: "create", 
                selectedId: null, selectedsubcodedresult, selectedRecord,
                screenName,loading: false,openChildModal
                , submit: "SUBCODERESULT"
            }
        }
        this.props.updateStore(updateInfo);
        //this.setState({ selectedsubcodedresult });
    }


    onSaveSpecification = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        // if(selectedRecord["nfromage"]<selectedRecord["ntoage"]){

        const TestGroupAddSpecification = {
            nstatus: transactionStatus.ACTIVE,
            ntestgrouptestparametercode: this.props.masterData.selectedParameter["ntestgrouptestparametercode"],
            ngendercode: selectedRecord["ngendercode"].value,
            nfromage: selectedRecord["nfromage"],
            ntoage: selectedRecord["ntoage"],
            shigha: selectedRecord["nhigha"],
            shighb: selectedRecord["nhighb"],
            slowa: selectedRecord["nlowa"],
            slowb: selectedRecord["nlowb"],
            sminlod: selectedRecord["sminlod"],
            smaxlod: selectedRecord["smaxlod"],
            sminloq: selectedRecord["sminloq"],
            smaxloq: selectedRecord["smaxloq"],
            sdisregard: selectedRecord["sdisregard"],
            sresultvalue: selectedRecord["sresultvalue"],
            ngradecode: selectedRecord["ngradecode"] && selectedRecord["ngradecode"].value || -1,
            nfromageperiod: selectedRecord["nfromageperiod"] && selectedRecord["nfromageperiod"].value || -1,
            ntoageperiod: selectedRecord["ntoageperiod"] && selectedRecord["ntoageperiod"].value || -1,

            ntestgrouptestclinicspeccode: selectedRecord["ntestgrouptestclinicspeccode"],

        };


        const inputParam = {
            inputData: {
                testgroupaddspecification: TestGroupAddSpecification,
                userinfo: this.props.userInfo,
                testgroupspecification: this.props.masterData.SelectedSpecification
            },
            classUrl: "testgroup",
            operation: this.props.operation,
            methodUrl: "TestGroupAddSpecification",
            saveType, formRef, searchRef: this.searchRef,
            selectedRecord: {...this.state.selectedRecord},
            postParam: {
                inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
                fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                masterData: this.props.masterData, searchFieldList: this.searchFieldList
            }
        }
        return inputParam;
        // }else{
        //     toast.warn(this.props.intl.formatMessage({id: "IDS_SELECTEDTEMPLATEISRETIRED"})); 
        // }
    }
    onSaveMaterial = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        let testGroupTestMaterial = []
        if (this.props.operation === "create") {
            testGroupTestMaterial = {
                ntestgrouptestcode: this.props.masterData.SelectedTest.ntestgrouptestcode,
                ntestgrouptestmaterialcode: this.props.masterData.SelectedTest.ntestgrouptestmaterialcode,
                nmaterialtypecode: selectedRecord["nmaterialtypecode"].item.jsondata.nmaterialtypecode,
                nmaterialcatcode: selectedRecord["nmaterialcatcode"].value,
                nmaterialcode: selectedRecord["nmaterialcode"].value,
                smaterialname: selectedRecord["nmaterialcode"].label,
                sremarks: selectedRecord["sremarks"],
                nstatus: transactionStatus.ACTIVE,

            };
        }
        else {
            testGroupTestMaterial = {
                ntestgrouptestcode: this.props.masterData.SelectedTest.ntestgrouptestcode,
                ntestgrouptestmaterialcode: this.props.masterData.selectedMaterial.ntestgrouptestmaterialcode,
                nmaterialtypecode: selectedRecord["nmaterialtypecode"].value,
                nmaterialcatcode: selectedRecord["nmaterialcatcode"].value,
                nmaterialcode: selectedRecord["nmaterialcode"].value,
                sremarks: selectedRecord["sremarks"],
                nstatus: transactionStatus.ACTIVE,

            };
        }

        const inputParam = {
            inputData: {
                testgrouptestmaterial: testGroupTestMaterial,
                ntreeversiontempcode: this.props.masterData.selectedNode.ntreeversiontempcode,
                userinfo: this.props.userInfo,
            },
            classUrl: "testgroup",
            operation: this.props.operation,
            methodUrl: "TestGroupTestMaterial",
            saveType, formRef, searchRef: this.searchRef,
            selectedRecord: {...this.state.selectedRecord},
            postParam: {
                inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
                fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                masterData: this.props.masterData, searchFieldList: this.searchFieldList,
                
            }
        }
        return inputParam;
    }

    deleteTest = (deleteParam) => {

        const masterData = this.props.masterData;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            const testgroupspecification = this.props.masterData.SelectedSpecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                || testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                const screenName = deleteParam.screenName;
                const inputParam = {
                    inputData: {
                        testgrouptest: deleteParam.selectedRecord,
                        userinfo: this.props.userInfo,
                        testgroupspecification,
                        treetemplatemanipulation: this.props.masterData.selectedNode
                    },
                    classUrl: "testgroup",
                    operation: "delete",
                    methodUrl: "Test",
                    screenName: "IDS_TEST",
                    postParam: {
                        inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                        primaryKeyValue: deleteParam.selectedRecord.ntestgrouptestcode,
                        fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                        masterData: this.props.masterData, searchFieldList: this.searchFieldList
                    }
                }
                const masterData = this.props.masterData;
                if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData },
                            openModal: true, screenName: screenName, operation: deleteParam.operation, selectedRecord: {}
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

    deleteAction = (item, operation, ncontrolCode, methodUrl, modalName) => {

        const masterData = this.props.masterData;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            const selected = item;
            const inputParam = {
                inputData: {
                    [methodUrl.toLowerCase()]: selected,
                    userinfo: this.props.userInfo,
                    testgroupspecification: this.props.masterData.SelectedSpecification,
                    deletetestgroupsubcoded:this.state.selectedsubcodedresult||[]
                },
                classUrl: "testgroup",
                operation: operation,
                methodUrl: methodUrl,
                screenName: "IDS_TEST",
                postParam: {
                    inputListName: "TestGroupTest", selectedObject: "SelectedTest", primaryKeyField: "ntestgrouptestcode",
                    primaryKeyValue: this.props.masterData.SelectedTest.ntestgrouptestcode,
                    fetchUrl: "testgroup/getTestGroupTest", fecthInputObject: { userinfo: this.props.userInfo },
                    masterData: this.props.masterData, searchFieldList: this.searchFieldList
                }
            }
            const masterData = this.props.masterData;
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        [modalName]: true, screenName: "IDS_TEST", operation: operation, selectedRecord: {}
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, masterData, "openChildModal", {});
            }
        }
    }


    onSwitchChange = (item, key, methodUrl, event) => {
        const masterData = this.props.masterData;
        const treeVersionTemplateIndex = masterData["TreeVersionTemplate"].findIndex(
            x => x["ntreeversiontempcode"] === masterData.selectedNode["ntreeversiontempcode"]);

        const templateVersionStatus = masterData["TreeVersionTemplate"][treeVersionTemplateIndex].ntransactionstatus
        if (templateVersionStatus === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTEDTEMPLATEISRETIRED" }));
        }
        else {
            //NIBSCRT-2236
            const testgroupspecification = this.props.masterData.SelectedSpecification;
            if (testgroupspecification.napprovalstatus === transactionStatus.DRAFT
                || testgroupspecification.napprovalstatus === transactionStatus.CORRECTION) {
                let dataItem = item;
                if (methodUrl === "TestGroupTestFormula") {
                    dataItem["ntransactionstatus"] = transactionStatus.YES;
                } else if (methodUrl === 'TestGroupPredefParameter') {
                    // if(this.props.masterData.SelectedSpecification.napprovalstatus === transactionStatus.DRAFT || this.props.masterData.SelectedSpecification.napprovalstatus === transactionStatus.CORRECTION)
                    // {
                    dataItem['ndefaultstatus'] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                    // }
                    // else{
                    //     return toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
                    // }

                }
                else {
                    dataItem["ndefaultstatus"] = transactionStatus.YES;
                }
                const inputParam = {
                    inputData: {
                        [key]: dataItem,
                        userinfo: this.props.userInfo,
                        testgroupspecification: this.props.masterData.SelectedSpecification
                    },
                    classUrl: "testgroup",
                    operation: "default",
                    methodUrl: methodUrl
                }
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal", {});
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SPECIFICATIONSTATUSMUSTBEDRAFTCORRECTION" }));
            }
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
    //ALPD-4984
	//Added by Neeraj 
    onRulesComboChange=(comboData, fieldName)=>{
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        if(fieldName==="nproductcatcode"){
            if(comboData.item.ncategorybasedflow===transactionStatus.NO){
                this.props.getProductComboServices({
                    inputData: {
                      userinfo: this.props.userInfo,
                      nproductcatcode:comboData.value,
                      ntestcode:this.props.masterData.SelectedTest.ntestcode
                        }
                  });
            }else{
                this.props.getProfileRootComboServices({
                    inputData: {
                      userinfo: this.props.userInfo,
                      nproductcatcode:comboData.value,
                      nproductcode:-1,
                      ntestcode:this.props.masterData.SelectedTest.ntestcode
                    }
                  });
            }
            delete(selectedRecord.nallottedspeccode);
            delete(selectedRecord.ncomponentcode);
            delete(selectedRecord.nproductcode);
            delete(selectedRecord.ntemplatemanipulationcode);
            delete(selectedRecord.ntestgrouprulesenginecode);
        }else if(fieldName==="nproductcode"){
            this.props.getProfileRootComboServices({
                inputData: {
                  userinfo: this.props.userInfo,
                  nproductcatcode:selectedRecord.nproductcatcode && selectedRecord.nproductcatcode.value,
                  nproductcode:comboData.value,
                  ntestcode:this.props.masterData.SelectedTest.ntestcode
                }
              });
              delete(selectedRecord.nallottedspeccode);
              delete(selectedRecord.ncomponentcode);
              delete(selectedRecord.ntemplatemanipulationcode);
              delete(selectedRecord.ntestgrouprulesenginecode);
        }else if(fieldName==="ntemplatemanipulationcode"){
            this.props.getSpecificationComboServices({
                inputData: {
                  userinfo: this.props.userInfo,
                  ntemplatemanipulationcode:comboData.value,
                  ntestcode:this.props.masterData.SelectedTest.ntestcode
                }
              });
              delete(selectedRecord.nallottedspeccode);
              delete(selectedRecord.ncomponentcode);
              delete(selectedRecord.ntestgrouprulesenginecode);
        } else if(fieldName==="nallottedspeccode"){
            if(comboData.item.ncomponentrequired===transactionStatus.YES){
                this.props.getComponentComboServices({
                    inputData: {
                      userinfo: this.props.userInfo,
                      nallottedspeccode:comboData.value,
                      ncomponentcode: this.props.masterData.SelectedSpecification.nallottedspeccode===comboData.value ?
                      this.props.masterData.SelectedComponent.ncomponentcode:-1,
                      ntestcode:this.props.masterData.SelectedTest.ntestcode
                    }
                  });
            }else{
                this.props.getRulesTestComboServices({
                    inputData: {
                      userinfo: this.props.userInfo,
                      ncomponentcode:selectedRecord.ncomponentcode && selectedRecord.ncomponentcode.value||-1,
                      nallottedspeccode:selectedRecord.nallottedspeccode.value,
                      ntestcode:this.props.masterData.SelectedTest.ntestcode,
                      ntestgrouptestcode:this.props.masterData.SelectedTest.ntestgrouptestcode,
                      selectedSpecCode:this.props.masterData.SelectedSpecification.nallottedspeccode,
                      selectedComponentCode:this.props.masterData.SelectedComponent && this.props.masterData.SelectedComponent.ncomponentcode||-1
                         }
                  });
            }
            delete(selectedRecord.ncomponentcode);
            delete(selectedRecord.ntestgrouprulesenginecode);
        }
        else if(fieldName==="ncomponentcode"){
            this.props.getRulesTestComboServices({
                inputData: {
                  userinfo: this.props.userInfo,
                  ncomponentcode:comboData.value,
                  nallottedspeccode:selectedRecord.nallottedspeccode.value,
                  ntestcode:this.props.masterData.SelectedTest.ntestcode,
                  ntestgrouptestcode:this.props.masterData.SelectedTest.ntestgrouptestcode,
                  selectedSpecCode:this.props.masterData.SelectedSpecification.nallottedspeccode,
                  selectedComponentCode:this.props.masterData.SelectedComponent.ncomponentcode
                     }
              });
              delete(selectedRecord.ntestgrouprulesenginecode);
        }
    this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        let inputData = [];
        let masterData = { ...this.props.masterData }
        let inputParam = []
        let selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
                break;

            case 2:
                selectedRecord["parameterTypeCode"] = comboData.value;
                selectedRecord[fieldName] = comboData;
                const needRoundingDigit = comboData.value === parameterType.NUMERIC ? false : true;
                const needUnit = comboData.value === parameterType.NUMERIC ? false : true;
                selectedRecord["nroundingdigits"] = 0;
                selectedRecord["nunitcode"] = comboData.value === parameterType.NUMERIC ? this.props.parameterData.defaultUnit : undefined;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        selectedRecord,
                        testGroupInputData: {
                            ...this.props.testGroupInputData,
                            needRoundingDigit, needUnit
                        }
                    }
                }
                this.props.updateStore(updateInfo);
                break;

            case 3:
                selectedRecord["schecklistversionname"] = comboData.item.schecklistversionname;
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
                break;
            case 4:
                let oldnmaterialtypecode = selectedRecord["nmaterialtypecode"].value ? selectedRecord["nmaterialtypecode"].value : selectedRecord["nmaterialtypecode"];

                if (oldnmaterialtypecode !== comboData.value) {
                    delete selectedRecord['nmaterialcatcode']
                    delete selectedRecord['nmaterialcode']
                }
                selectedRecord["nmaterialtypecode"] = comboData.value;

                selectedRecord[fieldName] = comboData;
                inputData = {
                    userinfo: this.props.userInfo,
                    nmaterialtypecode: parseInt(comboData.value),
                }
                inputParam = {
                    materialType: this.props.materialType,
                    operation: this.props.operation, masterData,
                    inputData, selectedRecord,
                    screenName: "IDS_TESTGROUPMATERIAL", ncontrolCode: this.props.ncontrolCode
                }
                this.props.getMaterialCategoryBasedMaterialType(inputParam)
                break;
            case 5:
                if (selectedRecord["nmaterialcatcode"]) {
                    let oldnmaterialcatcode = selectedRecord["nmaterialcatcode"].value ? selectedRecord["nmaterialcatcode"].value : selectedRecord["nmaterialcatcode"];
                    if (oldnmaterialcatcode !== comboData.value) {

                        delete selectedRecord['nmaterialcode']
                    }
                }
                selectedRecord["nmaterialcatcode"] = comboData.value;

                selectedRecord[fieldName] = comboData;
                inputData = {
                    userinfo: this.props.userInfo,
                    nmaterialcatcode: parseInt(selectedRecord["nmaterialcatcode"].value),
                    nmaterialtypecode: parseInt(selectedRecord["nmaterialtypecode"].value),

                }
                inputParam = {
                    masterData, inputData,
                    selectedRecord, operation: this.props.operation,
                    selectedRecord, screenName: "IDS_TESTGROUPMATERIAL", ncontrolCode: this.props.ncontrolCode
                }
                this.props.getMaterialBasedMaterialCategory(inputParam)
                break;

            default:
                break;
        }
    }



    addSubCodedResult = () => {
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         loadEsign: true,
        //         openModal: true,
        //         screenName: "IDS_TESTGROUPTESTMATERIAL"
        //     },
        // };
        // this.props.updateStore(updateInfo);
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                //operation: "create", 
                selectedId: null,//selectedsubcodedresult:"",
                openChildModal: true, screenName: "IDS_SUBCODEDRESULT"
            }
        }
        this.props.updateStore(updateInfo);
    }

    deleteSubCodedResult = (index, subCodedResult, index1) => {
        const selectedsubcodedresult = this.state.selectedsubcodedresult;
        selectedsubcodedresult.splice(index1.dataIndex, 1);
        //const selectsubcodedelete=[];
        const selectsubcodedelete= this.state.selectsubcodedelete || [];
        if(index["ntestgrouptestpredefsubcode"])
        selectsubcodedelete.push({ "ntestgrouptestpredefsubcode":index["ntestgrouptestpredefsubcode"], "ssubcodedresult":index["ssubcodedresult"],"ntestgrouptestpredefcode":index["ntestgrouptestpredefcode"] });
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedId: null, selectedsubcodedresult,selectsubcodedelete

            }
        }
        this.props.updateStore(updateInfo);
    }


    onInputOnChange = (event, caseNo, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (event.target.type === 'checkbox') {
                    selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
                    if (selectedRecord["nneedresultentryalert"] === 4) {
                        selectedRecord["nneedsubcodedresult"] = 4
                        delete selectedRecord["salertmessage"]
                        this.setState({ selectedsubcodedresult: [] });
                    }
                    if (selectedRecord["nneedsubcodedresult"] === 4) {
                        this.setState({ selectedsubcodedresult: [] });
                    }
                    else if(selectedRecord["nresultmandatory"]===3)
                    {
                        selectedRecord["nisadhocparameter"] = 4
                    }
                } else if (event.target.type === 'radio') {
                    selectedRecord[event.target.name] = optional;
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
                    schildnode: value.schildnode,
                    nnextchildcode: value.schildnode
                }
                let treetemplatemanipulation = selectedRecord.treetemplatemanipulation || [];
                treetemplatemanipulation[indexKey] = treeData;
                selectedRecord["treetemplatemanipulation"] = treetemplatemanipulation;
                this.setState({ selectedRecord });
                break;

            case 4:
                const inputValue = event.target.value;
                if (/^-?\d*?\.?\d*?$/.test(inputValue) || inputValue === "") {
                    selectedRecord[event.target.name] = event.target.value;
                }
                this.setState({ selectedRecord });
                break;


            case 6:
                // selectedRecord[event.target.name] = selectedRecord["sresultparacomment"] = { label: event.target.value, value: event.target.value };
                // this.setState({ selectedRecord });
                // break;
                //selectedRecord[event.target.name] = selectedRecord["sresultparacomment"] = event.target.value;
                selectedRecord[event.target.name] = selectedRecord["spredefinedsynonym"] = event.target.value;
                //selectedRecord["sparametername"] = { label: event.target.value, value: event.target.value };
                this.setState({ selectedRecord });
                break;

            case 5:
                if (event.target.type === 'checkbox') {
                    selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
                    if (selectedRecord["nneedresultentryalert"] === 4) {
                        selectedRecord["nneedsubcodedresult"] = 4
                        delete selectedRecord["salertmessage"]
                        this.codedResultMandatory = [{ "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true },
                        { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true },
                        { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true }];

                        const selectsubcodedelete=this.state.selectedsubcodedresult || []
                        this.setState({ selectedsubcodedresult: [],selectsubcodedelete,codedResultMandatory:this.codedResultMandatory });
                    }
                    if (selectedRecord["nneedresultentryalert"] === 3) {
                        this.codedResultMandatory = [{ "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true },
                        { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true },
                        { "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatory": true },
                        { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true }];


                        this.setState({ codedResultMandatory: [] });
                    }



                    // if (selectedRecord["nneedsubcodedresult"] === 3) {
                    //     this.codedResultMandatory = [{ "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatory": true },
                    //     { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "sresultparacomment", "width": "200px", "mandatory": true },
                    //     { "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatory": true },
                    //     { "idsName": "IDS_SUBCODEDRESULT", "dataField": "ssubcodedresult", "width": "200px", "mandatory": true },
                    //     { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "width": "200px", "mandatory": true }];


                    //     this.setState({ codedResultMandatory: [] });
                    // }

                    if (selectedRecord["nneedsubcodedresult"] === 4) {
                        const selectsubcodedelete=this.state.selectedsubcodedresult || []
                        this.setState({ selectedsubcodedresult: [],selectsubcodedelete });
                    }
                }
                this.setState({ selectedRecord });
                break;


                case 7:
                    const inputValues = event.target.value;
                   if (/^-?\d*?\.?\d*?$/.test(inputValues) || inputValues === "") {
                       selectedRecord[event.target.name] = event.target.value;
                   }
                   
                   if(selectedRecord["sresultvalue"]!=="" && selectedRecord["sresultvalue"].value !== -1)
                    {
                        selectedRecord["ngradecode"]=this.props.parameterData.grade[3];
                        
                    }
                   else if(selectedRecord["sresultvalue"]==="")
                    {
                        delete selectedRecord["ngradecode"];
                    }
                   this.setState({ selectedRecord });
                   break;


                   case 8:
                    const inputvalues = event.target.value;
                   if (/^-?\d*?\.?\d*?$/.test(inputvalues) || inputvalues === "") {
                       selectedRecord[event.target.name] = event.target.value;
                   }
                   
                   if(selectedRecord["sresultvalue"]!=="" && (selectedRecord["ngradecode"]===undefined|| selectedRecord["ngradecode"].value===-1))
                    {
                        selectedRecord["ngradecode"]=this.props.parameterData.gradenew[3];
                        
                    }
                   else if(selectedRecord["sresultvalue"]==="")
                    {
                        delete selectedRecord["ngradecode"];
                    }
                   this.setState({ selectedRecord });
                   break;
                
            default:
                break;
        }
    }


    onNumericInputChange = (value, name) => {
       // console.log("value:", value, name);
        const selectedRecord = this.state.selectedRecord || {};
        if (name === "nroundingdigits") {

            // if (/^-?\d*?$/.test(value.target.value) || value.target.value === "") {
            //     console.log("val:", value.target.value);
            //     selectedRecord[name] = value.target.value;
            // }
            // if (/^-?\d*?$/.test(value) || value === "") {
            //    // console.log("val:", value);
            //     selectedRecord[name] = value;
            // }
            //const values = value.target.value.replace(/[^-^0-9]/g, '');
            if (/^[0-9]+$/.test(value.target.value) || value.target.value === "") {
                selectedRecord[name] = value.target.value;

            } else {
                selectedRecord[name] = "";
            }
        }
        else {
            selectedRecord[name] = value;
        }

        this.setState({ selectedRecord });
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }

    componentDidUpdate(previousProps) {
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
        if (this.props.selectedsubcodedresult !== previousProps.selectedsubcodedresult) {
            this.setState({ selectedsubcodedresult: this.props.selectedsubcodedresult });
        }

        if (this.props.selectsubcodedelete !== previousProps.selectsubcodedelete) {
            this.setState({ selectsubcodedelete: this.props.selectsubcodedelete });
        }
    }

}


export default injectIntl(TestGroupTestTab);