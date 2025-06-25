import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';
import rsapi from '../../rsapi';
import { process } from '@progress/kendo-data-query';
import { Col, Row } from 'react-bootstrap';
import '../../assets/styles/lims-global-theme.css';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddSpecification from './AddSpecification';
import AddCodedResult from './AddCodedResult';
import AddParameter from './AddParameter';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, create_UUID, onDropAttachFileList, deleteAttachmentDropZone, Lims_JSON_stringify,replaceBackSlash } from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import AddTestSection from './AddTestSection';
import AddTestMethod from './AddTestMethod';
import AddTestInstrumentCategory from './AddTestInstrumentCategory';
import AddFormula from './AddFormula';
import ValidateFormula from './ValidateFormula';
import AddFile from './AddFile';
import { parameterType, transactionStatus, operators, attachmentType, FORMULAFIELDTYPE, formCode } from '../../components/Enumeration';
import CustomTab from '../../components/custom-tabs/custom-tabs.component'
import TestSectionTab from './TestSectionTab';
import TestMethodTab from './TestMethodTab';
import TestInstrumentCategoryTab from './TestInstrumentCategoryTab';
import TestFileTab from './TestFileTab';
import AddTestContainerType from './AddTestContainerType';
import TestContainerTypeTab from './TestContainerTypeTab';
import ParameterTab from './ParameterTab';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import TestPackageTab from './TestPackageTab';
import AddTestPackageTest from './AddTestPackageTest';
import AddSubCodedResult from './AddSubCodedResult';
import AddTestGroupNumericSpecification from '../../pages/testgroup/AddTestGroupNumericSpecification';
import AddPredefinedUserFormula from './AddPredefinedUserFormula';

class TestView extends Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = ({
            selectedRecord: {},
            fieldFlag: true,
            operatorFlag: false,
            functionFlag: true,
            sectionDataState: dataState,
            methodDataState: dataState,
            instrumentCatDataState: dataState,
            containerTypeDataState: dataState,
            testPackageDataState: dataState,
          //  techniqueDataState: dataState,
            formulaScreenName: "",
            
        });
        this.confirmMessage = new ConfirmMessage();
    }

    render() {
        //console.log("render in test view:", this.props.Login);
        const { SelectedTest } = this.props.masterData;
        if (this.props.openChildModal || this.state.openValidate) {
            this.mandatoryFields = this.findMandatoryFields(this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ? this.state.formulaScreenName :
                this.props.screenName, this.state.selectedRecord, this.state.formulaScreenName)
        }

        return (
            <>
                {SelectedTest && <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />}

                {this.props.openChildModal &&
                    <SlideOutModal
                        show={this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ? this.state.openValidate : this.props.openChildModal}
                        size={this.props.screenName === "IDS_FORMULA" ? 'xl' : 'lg'}
                        closeModal={this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ? this.hideValidateFormula : this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ? this.state.formulaScreenName : this.props.screenName}
                        //showSaveContinue={true}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        onSaveClick={this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ? this.calculateFormula : this.onSaveClick}
                        showCalculate={this.state.showCalculate}
                        //ATE234 janakumar ALPD-5546All Master screen -> Copy & File remove the save&continue
                        showSaveContinue={(this.props.screenName === "IDS_CONTAINERTYPE" || 
                            this.props.screenName === "IDS_CODEDRESULT" || this.props.screenName === "IDS_PREDEFINEDFORMULA" || 
                            this.props.screenName === "IDS_FORMULA" || this.props.screenName === "IDS_CLINICALSPEC"
                            // ||  this.props.screenName === "IDS_SPECIFICATION" - ALPD-5398 - commented by gowtham - Test Master Numeric Parameter - Add Specification, shows save & continue
                            ) && this.state.formulaScreenName !== "IDS_VALIDATEFORMULA" ? true : this.props.showSaveContinue}
                        selectedRecord={this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ? this.state.selectedRecord['formulainput'] : this.state.selectedRecord || {}}
                        mandatoryFields={this.mandatoryFields}
                        addComponent={this.props.loadEsign ?
                            <Esign
                                operation={this.props.operation}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> : this.props.screenName === "IDS_PARAMETER" ?
                                <AddParameter
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onNumericInputChange={this.onNumericInputChange}
                                    onComboChange={this.onComboChange}
                                    parameterData={this.props.parameterData}
                                    userInfo={this.props.userInfo}
                                    onFocus={this.props.onFocus}
                                    DestinationUnit={this.props.DestinationUnit}    
                                />
                                : this.props.screenName === "IDS_CODEDRESULT" ?
                                    <Row>
                                        <AddCodedResult
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            parameterData={this.props.parameterData}
                                            addSubCodedResult={this.props.addSubCodedResult}
                                            controlMap={this.props.controlMap}
                                        userRoleControlRights={this.props.userRoleControlRights}
                                        userInfo={this.props.userInfo}
                                            //selectedsubcodedresult={this.props.selectedsubcodedresult||[]}
                                        />
                                    </Row>
                                    : this.props.screenName === "IDS_SUBCODEDRESULT" ?
                                    <Row>
                                        <AddSubCodedResult
                                            selectedRecord={this.state.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            parameterData={this.props.parameterData}
                                            addSubCodedResult={this.props.addSubCodedResult}
                                        />
                                    </Row>
                                    : this.props.screenName === "IDS_SPECIFICATION" ?
                                        <AddSpecification
                                            selectedRecord={this.props.selectedRecord || {}}
                                            onInputOnChange={this.onInputOnChange}
                                            onComboChange={this.onComboChange}
                                            grade={this.props.grade}
                                            
                                        />
                                        : this.props.screenName === "IDS_SECTION" ?
                                            <Row>
                                                <Col md="12">
                                                    <AddTestSection
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        section={this.props.otherTestData.section}
                                                        onComboChange={this.onComboChange}
                                                        onInputOnChange={this.onInputOnChange}
                                                        isMulti={true}
                                                    />
                                                </Col>
                                            </Row>
                                            : this.props.screenName === "IDS_METHOD" ?
                                                <Row>
                                                    <Col md="12">
                                                        <AddTestMethod
                                                            selectedRecord={this.state.selectedRecord || {}}
                                                            method={this.props.otherTestData.method}
                                                            onComboChange={this.onComboChange}
                                                            isMulti={true}
                                                        />
                                                    </Col>
                                                </Row>
                                                : this.state.formulaScreenName === "" && this.props.screenName === "IDS_FORMULA" ?
                                                    <AddFormula
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        onComboChange={this.onComboChange}
                                                        onInputOnChange={this.onInputOnChange}
                                                        onNumericInputChange={this.onNumericInputChange}
                                                        onFormulaDrop={this.onFormulaDrop.bind(this)}
                                                        validateFormula={() => this.validateFormula(this.props.masterData.selectedParameter, this.state.selectedRecord, this.props.formulaData)}
                                                        clearFormula={this.clearFormula}
                                                        onUserInputs={this.onUserInputs}
                                                        operators={this.props.formulaData.operators}
                                                        functions={this.props.formulaData.functions}
                                                        testCategory={this.props.formulaData.testCategory}
                                                        testMaster={this.props.formulaData.testMaster}
                                                        dynamicFormulaFields={this.props.formulaData.dynamicFormulaFields}
                                                        //result={this.state.result ? this.state.result : ""}
                                                        //query={this.state.query ? this.state.query : ""}
                                                        getSyntax={this.getSyntax}
                                                        //sfunctionsyntax={this.state.sfunctionsyntax}
                                                        onFocus={this.props.onFocus}
                                                    />
                                                    : this.props.screenName === "IDS_PREDEFINEDFORMULA" ?
                                                    <AddPredefinedUserFormula
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        onComboChange={this.onComboChange}
                                                        onInputOnChange={this.onInputOnChange}
                                                        preDefinedFormula={this.props.preDefinedFormula}
                                                    />
                                                    : this.props.screenName === "IDS_INSTRUMENTCATEGORY" ?
                                                        <Row>
                                                            <Col md="12">
                                                                <AddTestInstrumentCategory
                                                                    selectedRecord={this.state.selectedRecord || {}}
                                                                    instrumentcategory={this.props.otherTestData.instrumentcategory}
                                                                    onComboChange={this.onComboChange}
                                                                    isMulti={true}
                                                                />
                                                            </Col>
                                                        </Row>

                                                        : this.props.screenName === "IDS_PACKAGE" ?
                                                            <Row>
                                                                <Col md="12">
                                                                    <AddTestPackageTest
                                                                        selectedRecord={this.state.selectedRecord || {}}
                                                                        package={this.props.otherTestData.package}
                                                                        onComboChange={this.onComboChange}
                                                                        isMulti={true}
                                                                    />
                                                                </Col>
                                                            </Row>

                                                            // : this.props.screenName === "IDS_TECHNIQUE" ?
                                                            //     <Row>
                                                            //         <Col md="12">
                                                            //             <AddTestTechnique
                                                            //                 selectedRecord={this.state.selectedRecord || {}}
                                                            //                 technique={this.props.otherTestData.technique}
                                                            //                 onComboChange={this.onComboChange}
                                                            //                 onInputOnChange={this.onInputOnChange}
                                                            //                 isMulti={true}
                                                            //             />
                                                            //         </Col>
                                                            //     </Row>

                                                                : this.props.screenName === "IDS_CONTAINERTYPE" ?
                                                                    <Row>
                                                                        <AddTestContainerType
                                                                            selectedRecord={this.state.selectedRecord || {}}
                                                                            containertype={this.props.otherTestData.containertype}
                                                                            unit={this.props.otherTestData.unit}
                                                                            onComboChange={this.onComboChange}
                                                                            onInputOnChange={this.onInputOnChange}
                                                                            onNumericInputChange={this.onNumericInputChange}
                                                                            isMulti={false}
                                                                        />
                                                                    </Row>                          
                                                                    
                                                                    : this.props.screenName === "IDS_TESTFILE" ?
                                                                        <AddFile
                                                                            selectedRecord={this.state.selectedRecord || {}}
                                                                            onInputOnChange={this.onInputOnChange}
                                                                            onDrop={this.onDropTestFile}
                                                                            onDropAccepted={this.onDropAccepted}
                                                                            deleteAttachment={this.deleteAttachment}
                                                                            actionType={this.state.actionType}
                                                                            onComboChange={this.onComboChange}
                                                                            linkMaster={this.props.linkMaster}
                                                                            editFiles={this.props.editFiles}
                                                                            maxSize={20}
                                                                            // maxFiles={this.props.operation === "update" ? 1 : 3}
                                                                            // multiple={this.props.operation === "update" ? false : true}
                                                                            maxFiles={1}
                                                                            multiple={false}
                                                                            label={this.props.intl.formatMessage({ id: "IDS_TESTFILE" })}
                                                                            name="testfilename"
                                                                        />
                                                                        : this.state.formulaScreenName === "IDS_VALIDATEFORMULA" ?
                                                                            <ValidateFormula
                                                                                DynamicFormulaFields={this.state.DynamicFields}
                                                                                selectedRecord={this.state.selectedRecord}
                                                                                onInputOnChange={this.onInputOnChange}
                                                                            />:
                                                                            this.props.screenName === "IDS_CLINICALSPEC" ?
                                                                            <AddTestGroupNumericSpecification
                                                                                //gradenew={this.props.testGroupInputData.grade||[]}
                                                                                onInputOnChange={this.onInputOnChange}
                                                                                parameterData={this.props.parameterData}
                                                                                selectedRecord={this.state.selectedRecord}
                                                                                onComboChange={this.onComboChange}
                                                                                onNumericInputChange={this.onNumericInputChange}
                                                                            />
                                                                        // : this.props.screenName ==="IDS_REPORTINFOTEST" ?
                                                                        //     <TestReportInfo
                                                                        //         selectedRecord={this.state.selectedRecord || {}}
                                                                        //     />
                                                                        :""
                        }
                    />
                }
            </>
        );
    }



    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete" //fileToDelete:file.name 
        });
    }



    findMandatoryFields(screenName, selectedRecord, optional) {
        let mandyFields = [];
        if (screenName === "IDS_SECTION") {
            mandyFields = [
                { "idsName": "IDS_SECTION", "dataField": "availableData", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        }
        else if (screenName === "IDS_TECHNIQUE") {
            mandyFields = [
                { "idsName": "IDS_TECHNIQUE", "dataField": "availableData", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        }
        else if (screenName === "IDS_METHOD") {
            mandyFields = [
                { "idsName": "IDS_METHOD", "dataField": "availableData", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        } else if (screenName === "IDS_INSTRUMENTCATEGORY") {
            mandyFields = [
                { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "availableData", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        } else if (screenName === "IDS_PACKAGE") {
            mandyFields = [
                { "idsName": "IDS_TESTPACKAGE", "dataField": "availableData", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
        } else if (screenName === "IDS_FORMULA" && optional === "") {
            mandyFields = [
                { "idsName": "IDS_FORMULANAME", "dataField": "sformulaname", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_FORMULA", "dataField": "sformulacalculationdetail", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ]
        }else if (screenName === "IDS_PREDEFINEDFORMULA" ) {
            mandyFields = [
                { "idsName": "IDS_FORMULANAME", "dataField": "sformulaname", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_PREDEFINEDFORMULA", "dataField": "npredefinedformulacode", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }
            ]
        }
        else if (screenName === "IDS_PARAMETER") {
            mandyFields = [
                { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametername", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                { "idsName": "IDS_PARAMETERTYPE", "dataField": "nparametertypecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
            ]
            if (selectedRecord && Object.values(selectedRecord).length > 0 && selectedRecord["nparametertypecode"]) {
                if (selectedRecord["nparametertypecode"].value === parameterType.NUMERIC) {
                    mandyFields.push(
                        { "idsName": "IDS_ROUNDINGDIGITS", "dataField": "nroundingdigits", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                        { "idsName": "IDS_UNIT", "dataField": "nunitcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    );
                } else if (selectedRecord["nparametertypecode"].value === parameterType.PREDEFINED) {
                    mandyFields.push(
                        { "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                        { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                        { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                    );
                }
            }
        } 
        else if(screenName === "IDS_CODEDRESULT")
            {
                mandyFields.push(
                    { "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" },
                    { "idsName": "IDS_ACTUALRESULT", "dataField": "ngradecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                    { "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                );
            }else if (screenName === "IDS_VALIDATEFORMULA") {
            mandyFields = this.state.validateFormulaMandyFields;
        } else if (screenName === "IDS_TESTFILE") {
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandyFields = [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ];
            } else {
                // if (this.props.operation !== 'update') {
                mandyFields = [
                    { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                ];
                // }
            }
        }
        else if (screenName === "IDS_CONTAINERTYPE") {
            mandyFields = [
                { "idsName": "IDS_CONTAINERTYPE", "dataField": "ncontainertypecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
                // { "idsName": "IDS_QUANTITY", "dataField": "nquantity", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
                this.state.selectedRecord.unitMandatory === true ?  { "idsName": "IDS_UNIT", "dataField": "nunitcode", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" } : {},

            ] 
        }else if (screenName === "IDS_CLINICALSPEC") {
            mandyFields = [
                { "idsName": "IDS_GENDER", "dataField": "ngendercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
                { "idsName": "IDS_FROMAGE", "dataField": "nfromage", "width": "200px", "mandatory": true },
                { "idsName": "IDS_TOAGE", "dataField": "ntoage", "width": "200px", "mandatory": true },
                // ALPD-5364 - added by Gowtham R on 24/03/2025 - for mandatory check for period combo in FromDate and ToDate.
                { "idsName": "IDS_PERIOD", "dataField": "nfromageperiod", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"},
                { "idsName": "IDS_PERIOD", "dataField": "ntoageperiod", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox"}
            ] 
        }
        else {
            return [];
        }
        let finalMandyFields = [];
        mandyFields.forEach(item => item.mandatory === true && finalMandyFields.push(item));
        return finalMandyFields;
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

    tabDetail = () => {
        const tabMap = new Map();

        tabMap.set("IDS_PARAMETER",
            <ParameterTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                TestParameter={this.props.masterData.TestParameter}
                masterData={this.props.masterData}
                userInfo={this.props.userInfo}
                getTestDetails={this.props.getTestDetails}
                inputParam={this.props.inputParam}
                addParameter={this.props.addParameter}
                deleteAction={this.props.deleteAction}
                ConfirmDelete={this.ConfirmDelete}
                addCodedResult={this.props.addCodedResult}
                addSubCodedResult={this.props.addSubCodedResult}
                addFormula={this.props.addFormula}
                openPredefinedModal={this.props.openPredefinedModal}
                onSwitchChange={this.onSwitchChange}
                addParameterSpecification={this.props.addParameterSpecification}
                addClinicalSpecification={this.props.addClinicalSpecification}
                screenName="IDS_PARAMETER"
                grade={this.props.grade}
                dataStateChange={this.props.dataStateChange}
                dataState={this.props.clinicalspecDataState}
                EditSpecDetails={this.EditSpecDetails}
                deleteRecord={this.DeleteSpecDetails}
            />
        );
        tabMap.set("IDS_SECTION",
            <TestSectionTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                dataResult={process(this.props.masterData["TestSection"], (this.props.screenName === undefined || this.props.screenName === "IDS_SECTION") ? this.state.sectionDataState : { skip: 0, take: 10 })}
                dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_SECTION") ? this.state.sectionDataState : { skip: 0, take: 5 }}
                dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                selectedTest={this.props.masterData.SelectedTest}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                deleteRecord={this.deleteRecord}
                defaultRecord={this.defaultRecord}
                getAvailableData={this.props.getAvailableData}
                TestSection={this.props.masterData.TestSection || []}
                screenName="IDS_SECTION"
            />);
        tabMap.set("IDS_METHOD",
            <TestMethodTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                dataResult={process(this.props.masterData["TestMethod"], (this.props.screenName === undefined || this.props.screenName === "IDS_METHOD") ? this.state.methodDataState : { skip: 0, take: 5 })}
               // dataResult={this.state.testmethodata && this.state.testmethodata===undefined?this.props.masterData["TestMethod"]:this.state.testmethodata }
                dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_METHOD") ? this.state.methodDataState : { skip: 0, take: 5 }}
                dataStateChange={(event) => this.setState({ methodDataState: event.dataState })}
                selectedTest={this.props.masterData.SelectedTest}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                deleteRecord={this.deleteRecord}
                defaultRecord={this.defaultRecord}
                getAvailableData={this.props.getAvailableData}
                TestMethod={this.props.masterData.TestMethod || []}
                screenName="IDS_METHOD"
            />
        );
        tabMap.set("IDS_INSTRUMENTCATEGORY",
            <TestInstrumentCategoryTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                dataResult={process(this.props.masterData["TestInstrumentCategory"], (this.props.screenName === undefined || this.props.screenName === "IDS_INSTRUMENTCATEGORY") ? this.state.instrumentCatDataState : { skip: 0, take: 5 })}
                dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_INSTRUMENTCATEGORY") ? this.state.instrumentCatDataState : { skip: 0, take: 5 }}
                dataStateChange={(event) => this.setState({ instrumentCatDataState: event.dataState })}
                selectedTest={this.props.masterData.SelectedTest}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                deleteRecord={this.deleteRecord}
                defaultRecord={this.defaultRecord}
                getAvailableData={this.props.getAvailableData}
                TestInstrumentCategory={this.props.masterData.TestInstrumentCategory}
                screenName="IDS_INSTRUMENTCATEGORY"
            />
        );
        tabMap.set("IDS_FILE",
            <TestFileTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                deleteRecord={this.deleteRecord}
                dataStateChange={(event) => this.setState({ testFileDataState: event.dataState })}
                testFileDataState={this.state.testFileDataState}
                TestFile={this.props.masterData.TestFile || []}
                getAvailableData={this.props.getAvailableData}
                addTestFile={this.props.addTestFile}
                viewTestFile={this.viewTestFile}
                defaultRecord={this.defaultRecord}
                screenName="IDS_FILE"
                settings={this.props.settings}
            />);

       // if (this.props.esignRights && Object.keys(this.props.esignRights).indexOf(formCode.TESTPACKAGE.toString())!==-1){
       if (this.props.hideQualisForms && this.props.hideQualisForms.findIndex(item=>item.nformcode === formCode.TESTPACKAGE) === -1)
       {                   
            tabMap.set("IDS_TESTPACKAGE",
                <TestPackageTab
                    controlMap={this.props.controlMap}
                    userRoleControlRights={this.props.userRoleControlRights}
                    dataResult={process(this.props.masterData["TestPackage"] || [], (this.props.screenName === undefined || this.props.screenName === "IDS_PACKAGE") ? this.state.testPackageDataState : { skip: 0, take: 5 })}
                    dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_PACKAGE") ? this.state.testPackageDataState : { skip: 0, take: 5 }}
                    dataStateChange={(event) => this.setState({ testPackageDataState: event.dataState })}
                    selectedTest={this.props.masterData.SelectedTest}
                    userInfo={this.props.userInfo}
                    inputParam={this.props.inputParam} 
                    deleteRecord={this.deleteRecord}
                    defaultRecord={this.defaultRecord}
                    getAvailableData={this.props.getAvailableData}
                    TestPackage={this.props.masterData.TestPackage}
                    screenName="IDS_PACKAGE"
                />
            );
        }

        // tabMap.set("IDS_TECHNIQUE",
        //     <TestTechniqueTab
        //         controlMap={this.props.controlMap}
        //         userRoleControlRights={this.props.userRoleControlRights}
        //         dataResult={process(this.props.masterData["TestTechnique"] ||[], (this.props.screenName === undefined || this.props.screenName === "IDS_TECHNIQUE") ? this.state.sectionDataState : { skip: 0, take: 10 })}
        //         dataState={(this.props.screenName === undefined 
        //             || this.props.screenName === "IDS_TECHNIQUE") ? this.state.techniqueDataState : { skip: 0, take: 10 }}
        //         dataStateChange={(event) => this.setState({ techniqueDataState: event.dataState })}
        //         selectedTest={this.props.masterData.SelectedTest}
        //         userInfo={this.props.userInfo}
        //         inputParam={this.props.inputParam}
        //         deleteRecord={this.deleteRecord}
        //         defaultRecord={this.defaultRecord}
        //         getAvailableData={this.props.getAvailableData}
        //         TestTechnique={this.props.masterData.TestTechnique || []}
        //         screenName="IDS_TECHNIQUE"
        //     />);

        tabMap.set("IDS_CONTAINERTYPE",
            <TestContainerTypeTab
                controlMap={this.props.controlMap}
                userRoleControlRights={this.props.userRoleControlRights}
                dataResult={process(this.props.masterData["Containertype"], (this.props.screenName === undefined || this.props.screenName === "IDS_CONTAINERTYPE") ? this.state.containerTypeDataState : { skip: 0, take: 5 })}
                dataState={(this.props.screenName === undefined || this.props.screenName === "IDS_CONTAINERTYPE") ? this.state.containerTypeDataState : { skip: 0, take: 5 }}
                dataStateChange={(event) => this.setState({ containerTypeDataState: event.dataState })}
                selectedTest={this.props.masterData.SelectedTest}
                userInfo={this.props.userInfo}
                inputParam={this.props.inputParam}
                deleteRecord={this.deleteRecord}
                defaultRecord={this.defaultRecord}
                getAvailableData={this.props.getAvailableData}
                TestContainerType={this.props.masterData.Containertype}
                getActiveTestContainerTypeById={this.props.getActiveTestContainerTypeById}
                addContainerType={this.props.addContainerType}
                intl={this.props.intl}
                screenName="IDS_CONTAINERTYPE"
            />
        );

        return tabMap;
    }

    viewTestFile = (filedata) => {
        const inputParam = {
            inputData: {
                testfile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "testmaster",
            operation: "view",
            methodUrl: "AttachedTestFile",
            screenName: "IDS_TEST"
        }
        this.props.viewAttachment(inputParam);
    }
    DeleteSpecDetails = (viewdetails, ncontrolCode) => {
        this.ConfirmDelete(viewdetails,"delete", ncontrolCode,'TestParameterClinicalSpec','openChildModal')
    };
    EditSpecDetails = (viewdetails, ncontrolCode) => {

        this.props.addClinicalSpecification("update", viewdetails, this.props.userInfo, ncontrolCode)
    };

    deleteRecord = (deleteParam) => {

        let dataResultRecord;
        let skipDataRecords;

        const methodUrl = deleteParam.methodUrl;
        const selected = deleteParam.selectedRecord;
        let dataState = undefined;
        if (this.props.screenName === "IDS_SECTION") {     
            dataResultRecord=process(this.props.masterData["TestSection"], this.state.sectionDataState );
            dataState = this.state.sectionDataState;
        } else if (this.props.screenName === "IDS_METHOD") {
            dataResultRecord=process(this.props.masterData["TestMethod"], this.state.methodDataState );
            dataState = this.state.methodDataState;
        } else if (this.props.screenName === "IDS_INSTRUMENTCATEGORY") {
            dataResultRecord=process(this.props.masterData["TestInstrumentCategory"], this.state.instrumentCatDataState );
            dataState = this.state.instrumentCatDataState;
        }
        else if (this.props.screenName === "IDS_CONTAINERTYPE") {
            dataResultRecord=process(this.props.masterData["TestMethod"], this.state.containerTypeDataState );
            dataState = this.state.containerTypeDataState;
        }
        else if (this.props.screenName === "IDS_TESTPACKAGE") {
            dataResultRecord=process(this.props.masterData["TestPackage"], this.state.testPackageDataState );
            dataState = this.state.testPackageDataState;
        } else if (this.props.screenName === "IDS_TESTFILE" || this.props.screenName === "IDS_FILE" ) {  
            dataResultRecord=process(this.props.masterData["TestFile"], this.state.testPackageDataState );
            dataState = this.state.testFileDataState; 
        }
//ALPD-554 Test Master: Section, Method, Instrument, and Container Type cannot be deleted.
        if(dataResultRecord && dataResultRecord.data){
            if(dataResultRecord.data.length ===1){
               let skipcount=dataState.skip>0?(dataState.skip-dataState.take):
               dataState.skip
               skipDataRecords={skip:skipcount,take:dataState.take}
            }else{
                skipDataRecords=dataState;
            }
        }


        const inputParam = {      
            inputData: {
                [methodUrl.toLowerCase()]: selected,
                "userinfo": {...this.props.userInfo,
               
				//ALPD-1628(while file saving,audit trail is not captured respective language)
                    slanguagename: Lims_JSON_stringify(this.props.userInfo.slanguagename)},
                   	//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
					 "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO
            },
            classUrl: "testmaster",
            operation: deleteParam.operation,
            methodUrl: methodUrl,
            screenName: this.props.screenName, //Added by sonia on 19th Feb 2025 for jira id:ALPD-5455
            dataState:skipDataRecords
        }
        const masterData = this.props.masterData;
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openChildModal: true, screenName: this.props.screenName, operation: deleteParam.operation, selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openChildModal", {});
        }
    }

    defaultRecord = (defaultParam, event) => {
        const methodUrl = defaultParam.methodUrl;
        let dataItem = defaultParam.selectedRecord;
        // dataItem["ndefaultstatus"] = transactionStatus.YES;
        let dataState = undefined;
        if (this.props.screenName === "IDS_SECTION") {
            dataState = this.state.sectionDataState;
        } else if (this.props.screenName === "IDS_METHOD") {
            dataState = this.state.methodDataState;
        } else if (this.props.screenName === "IDS_INSTRUMENTCATEGORY") {
            dataState = this.state.instrumentCatDataState;
        }
        else if (this.props.screenName === "IDS_CONTAINERTYPE") {
            dataState = this.state.containerTypeDataState;
        }
        else if (this.props.screenName === "IDS_TESTPACKAGE") {
            dataState = this.state.testPackageDataState;
        }

        let postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };

        const inputParam = {
            inputData: {
                [methodUrl.toLowerCase()]: dataItem,
                userinfo: this.props.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

            },
            classUrl: "testmaster",
            operation: "setDefault",
            methodUrl: methodUrl, dataState, postParam
        }
        const masterData = this.props.masterData;
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, defaultParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openChildModal: true, screenName: "Test", operation: defaultParam.operation, selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openChildModal", {});
        }
    }

    onSwitchChange = (item, key, methodUrl, event,defaultTestFormulaId) => {
        const masterData =this.props.masterData;
        let dataItem = item;
        // dataItem["ndefaultstatus"] = 3;
        //dataItem['ndefaultstatus'] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        const inputParam = {
            inputData: {
                [key]: dataItem,
                userinfo: this.props.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

            },
            classUrl: "testmaster",
            operation: "setDefault",
            methodUrl: methodUrl
        }
        if(showEsign(this.props.esignRights, this.props.userInfo.nformcode, defaultTestFormulaId)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openChildModal: true, screenName: "Test", operation: "setDefault", selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        }else{
            this.props.crudMaster(inputParam, masterData, "openChildModal", {});
        }
        
    }

    hideValidateFormula = () => {
        this.setState({ openValidate: false, showCalculate: false, formulaScreenName: "", validateFormulaMandyFields: [] });
    }

    validateFormula = (testData) => {
        const sformulacalculationcode = this.state.selectedRecord.sformulacalculationcode;
        if (sformulacalculationcode) {
            if (sformulacalculationcode.includes("$D") || sformulacalculationcode.includes("$P")) {
                rsapi.post("/testmaster/validateTestFormula", { ntestcode: testData.ntestcode, "sformula": sformulacalculationcode, userinfo: this.props.userInfo })
                    .then(response => {
                        let selectedRecord = this.state.selectedRecord || {};
                        selectedRecord["formulainput"] = {};
                        const validateFormulaMandyFields = response.data.map((item, index) => {
                            return { "idsName": "IDS_FILLALLFIELDS", "dataField": "dynamicformulafield_" + index, "mandatory": true }
                        });
                        this.setState({
                            openValidate: true,
                            DynamicFields: response.data,
                            dynamicField: [],
                            selectedRecord,
                            formulaScreenName: "IDS_VALIDATEFORMULA",
                            showCalculate: true, validateFormulaMandyFields
                        });
                    })
                    .catch(error => {
                        toast.error(error.message)
                    });
            } else {
                const inputParam = {
                    dynamicformulafields: [],
                    sformulacalculationcode: this.state.selectedRecord.sformulacalculationcode,
                    userinfo: this.props.userInfo
                }
                this.calculateFormulaFunction(inputParam);
            }
        } else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_ENTERFORMULA" }))
        }
    }

    calculateFormulaFunction(inputParam) {
        rsapi.post("/testmaster/calculateFormula", {
            ...inputParam
        })
            .then(response => {
                 //ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
                const selectedRecord=this.state.selectedRecord ||{};
                selectedRecord["query"]=response.data["Query"];
                selectedRecord["result"]=response.data["Result"];

                this.setState({
                    openValidate: false,
					selectedRecord,
                    //query: response.data["Query"],
                    //result: response.data["Result"],
                    showCalculate: false, formulaScreenName: ""
                })
            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    //toast.warn(error.response.data);
                    toast.warn(error.response.data["Result"]);
                }
            });
    }

    calculateFormula = () => {
        const dynamicField = this.state.dynamicField;
        const dynamicformulafields = Object.keys(dynamicField).map((keyname) => {
            return dynamicField[keyname];
        });
        const inputParam = {
            dynamicformulafields: dynamicformulafields,
            sformulacalculationcode: this.state.selectedRecord.sformulacalculationcode,
            userinfo: this.props.userInfo
        }
        this.calculateFormulaFunction(inputParam);
    }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            //ALPD-707 fix
            if (this.props.operation === "delete" || this.props.operation === "Default"
                ||   this.props.operation === "setDefault") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
                // ALPD-5604 - commented by Gowtham R on 01/04/25 - testmaster paratemeter edit e-sign agree gets disable.
                // selectedRecord["agree"] = 4;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
            }
        } else {
            openChildModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        let selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (fieldName === "sparametername") {
                    selectedRecord[fieldName] = comboData;
                    selectedRecord["sparametersynonym"] = comboData.value;
                }  else if(fieldName  === "nunitcode") {
                    //ALPD-3637-Vignesh R(02-08-2024)-- Test master--> parameter records are disappeared when clicking the refresh button.
                    selectedRecord["noperatorcode"]=-1;
                    selectedRecord["nconversionfactor"]="";
                    selectedRecord["ndestinationunitcode"]="";  
                    selectedRecord["sunitname"]="";
                    selectedRecord["sunitname1"]="";
                    selectedRecord["nunitcode"] = comboData;
                    this.props.getUnitConversion(this.state.selectedRecord.nunitcode.value,this.props.masterData,this.props.userInfo, selectedRecord);
                } else  if(fieldName === "ndestinationunitcode") {
                    if(comboData !==null){
                         selectedRecord["ndestinationunitcode"]= comboData;
                        this.props.getConversionOperator(this.state.selectedRecord.nunitcode.value,this.state.selectedRecord.ndestinationunitcode.value,this.props.masterData,this.props.userInfo, selectedRecord);
                    }else{
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
                const parameterData = this.props.parameterData;
                let item = comboData['item'];
                let needUnit = true;
                let needRoundingDigit = true;
                let needCodedResult = true;
                let needActualResult = true;
                let npredefinedcode = 4;
                if (item["nunitrequired"] === 3) {
                    needUnit = false;
                    selectedRecord["nunitcode"] = this.props.parameterData.defaultUnit;
                } else {
                    selectedRecord["nunitcode"] = "";
					//ALPD-3521
                    selectedRecord["ndestinationunitcode"]="";
                    selectedRecord["noperatorcode"]=-1;
                    selectedRecord["sunitname"]="";
                    selectedRecord["sunitname1"]="";
                    selectedRecord["nconversionfactor"]="";


                    // selectedRecord["nunitcode"] = "";

                }
                if (item["nroundingrequired"] === 3) {
                    needRoundingDigit = false;
                } else {
                    selectedRecord["nroundingdigits"] = "0";
                }
                if (item["npredefinedrequired"] === 3) {
                    needCodedResult = false;
                    npredefinedcode = item["npredefinedrequired"];
                } else {
                    selectedRecord["spredefinedname"] = "";
                }
                if (item["ngraderequired"] === 3) {
                    needActualResult = false;
                    selectedRecord["ngradecode"] = this.props.parameterData.defaultGrade;
                } else {
                    selectedRecord["ngradecode"] = "";
                }
                selectedRecord[fieldName] = comboData;
                const parameterInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { selectedRecord, parameterData: { ...parameterData, needUnit, needRoundingDigit, needCodedResult, needActualResult, npredefinedcode } }
                }
                this.props.updateStore(parameterInfo);
                break;

            case 3:
                selectedRecord[fieldName] = comboData;
                this.props.formulaChangeFunction({ ntestcategorycode: comboData.value, nFlag: 2, userinfo: this.props.userInfo }, this.props.formulaData, 1, selectedRecord, '/changeTestCatgoryInFormula');
                break;

            case 4:
                selectedRecord[fieldName] = comboData;
                this.props.formulaChangeFunction({ ntestcode: comboData.value, nFlag: 3, userinfo: this.props.userInfo }, this.props.formulaData, 2, selectedRecord, '/changeTestInFormula');
                break;

            default:
                break;
        }
    }

    onEsignInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event, caseNo, optional) => {
        const selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                if (event.target.type === 'checkbox') {
                    selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
                } else if (event.target.type === 'radio') {
                    selectedRecord[event.target.name] = optional;
                    //  selectedRecord["sfilename"]="";
                } else {
                    selectedRecord[event.target.name] = event.target.value;
                }
                this.setState({ selectedRecord });
                break;

            case 4:
                const inputValue = event.target.value;
                if (/^-?\d*?\.?\d*?$/.test(inputValue) || inputValue === "") {
                    selectedRecord[event.target.name] = event.target.value;
                }
                this.setState({ selectedRecord });
                break;

            case 5:
                if (optional.ndynamicformulafieldcode === FORMULAFIELDTYPE.INTEGER && optional.sdescription.indexOf('P$') === -1) {
                    const value = event.target.value.replace(/[^-^0-9]/g, '');
                    const dynamicField = this.state.dynamicField || [];
                    if ((/^-?\d*?$/.test(value))) {
                        if (!selectedRecord['formulainput']) {
                            selectedRecord['formulainput'] = {};
                        }
                        selectedRecord['formulainput'][event.target.name] = value;
                        dynamicField[event.target.name] = {
                            sparameter: optional.sdescription,
                            svalues: value
                        };
                    } 
                    else if (value === "") {
                        if (!selectedRecord['formulainput']) {
                            selectedRecord['formulainput'] = {};
                        }
                        selectedRecord['formulainput'][event.target.name] = value;
                        dynamicField[event.target.name] = {
                            sparameter: optional.sdescription,
                            svalues: value
                        };
                    }
                    this.setState({ dynamicField, selectedRecord });
                    break;
                } else {
                    const value = event.target.value.replace(/[^-^0-9.]/g, '');
                    const dynamicField = this.state.dynamicField || [];
                    if ((/^-?\d*?\.?\d*?$/.test(value)) || value !== "") {
                        if (!selectedRecord['formulainput']) {
                            selectedRecord['formulainput'] = {};
                        }
                        selectedRecord['formulainput'][event.target.name] = value;
                        dynamicField[event.target.name] = {
                            sparameter: optional.sdescription,
                            svalues: value
                        };
                    }
                    this.setState({ dynamicField, selectedRecord });
                    break;
                }

                case 6:
                    // selectedRecord[event.target.name] = selectedRecord["sresultparacomment"] = { label: event.target.value, value: event.target.value };
                    // this.setState({ selectedRecord });
                    // break;
                    selectedRecord[event.target.name] = selectedRecord["spredefinedsynonym"] = event.target.value;
                    //selectedRecord[event.target.name] = selectedRecord["sresultparacomment"] = event.target.value;
                    //selectedRecord["sparametername"] = { label: event.target.value, value: event.target.value };
                    this.setState({ selectedRecord });
                    break;
                    case 7:
                        const inputValues = event.target.value;
                       if (/^-?\d*?\.?\d*?$/.test(inputValues) || inputValues === "") {
                           selectedRecord[event.target.name] = event.target.value;
                       }
                       
                       if(selectedRecord["sresultvalue"]!==""  && selectedRecord["sresultvalue"]!==undefined  && selectedRecord["sresultvalue"].value !== -1)
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

    // onNumericInputChange = (value, name) => {
    //     const selectedRecord = this.state.selectedRecord || {};
    //     selectedRecord[name] = value;
    //     this.setState({ selectedRecord });
    // }

    onNumericInputChange = (value, name, secondaryFieldName) => {
        console.log("value:", value, name);
        const selectedRecord = this.state.selectedRecord || {};
        if (name === "nroundingdigits") {
            const values = value.target.value;  //.replace(/[^-^0-9]/g, '');
            if (/^\d*?$/.test(values) || values === "") {
                console.log("val:", values);
                selectedRecord[name] = values;
            }
        }
        else {
            selectedRecord[name] = value;

            if(secondaryFieldName !== undefined){
                if(selectedRecord[name] === 0 || selectedRecord[name] === undefined){
                    selectedRecord["unitMandatory"] = false;
                    selectedRecord["nunitcode"] = undefined;
                }
                else{
                    selectedRecord["unitMandatory"] = true;
                }
            }
        }

        this.setState({ selectedRecord });
    }

    onSaveClick = (saveType, formRef) => {
        let inputParam = {};
        let defaultInput = {};
        let isValidRequest = true;
        let clearSelectedRecordField=[];
        if (this.props.screenName === "IDS_PARAMETER") {
            inputParam = this.onSaveParameter(saveType, formRef);
            defaultInput = {
                nparametertypecode: this.state.selectedRecord.nparametertypecode,
             //   ngradecode: this.state.selectedRecord.ngradecode,
                nunitcode: ""
            };
            clearSelectedRecordField = [
                //{ "controlType": "textbox", "idsName":"IDS_TESTNAME", "dataField": "stestname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_SHORTNAME", "dataField": "sshortname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_PRICE", "dataField": "ncost", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_TESTPROCEDURE", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_TAT", "dataField": "ntat", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_TESTPLATFORM", "dataField": "stestplatform", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },

                { "controlType": "textarea", "idsName": "IDS_PARAMETERSYNONYM", "dataField": "sparametersynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_ROUNDINGDIGITS", "dataField": "nroundingdigits", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_CONVERSIONOPERATOR", "dataField": "soperator", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_CONVERSIONFACTOR", "dataField": "nconversionfactor", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_DELTACHECKTIMEFRAME", "dataField": "ndeltacheckframe", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_DELTACHECKLIMIT", "dataField": "ndeltachecklimitcode", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_RESULTPARAMETERCOMMENTS", "dataField": "spredefinedcomments", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "textarea", "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //{ "controlType": "checkbox", "idsName": "IDS_ACCREDITED", "dataField": "naccredited", "width": "200px", "controlName": "ncategorybasedflow","isClearField":true,"preSetValue":63 },
                //{ "controlType": "checkbox", "idsName": "IDS_ACTIVE", "dataField": "ntransactionstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":1 },
                //{ "controlType": "checkbox", "idsName": "IDS_TRAININGNEEDED", "dataField": "ntrainingneed", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "checkbox", "idsName": "IDS_DELTACHECK", "dataField": "ndeltacheck", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                //{ "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "nneedresultentryalert", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                //{ "controlType": "checkbox", "idsName": "IDS_SUBCODERESULTNEED", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 }
            ]
        } else if (this.props.screenName === "IDS_CODEDRESULT") {
            inputParam = this.onSaveCodedResult(saveType, formRef);
            clearSelectedRecordField = [
                { "controlType": "textarea", "idsName": "IDS_CODEDRESULT", "dataField": "spredefinedname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_CODEDRESULTSYNONYM", "dataField": "spredefinedsynonym", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_RESULTPARAMETERCOMMENTS", "dataField": "spredefinedcomments", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "checkbox", "idsName": "IDS_AlERTFORRESULTENTRY", "dataField": "nneedresultentryalert", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "checkbox", "idsName": "IDS_SUBCODERESULTNEED", "dataField": "nneedsubcodedresult", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                { "controlType": "textarea", "idsName": "IDS_ALERTMESSAGE", "dataField": "salertmessage", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            ]
        } else if (this.props.screenName === "IDS_SPECIFICATION") {
            const selectedRecord = this.props.selectedRecord;
            if (selectedRecord["sminb"] || selectedRecord["smina"] || selectedRecord["smaxa"] || selectedRecord["smaxb"]
                || selectedRecord["sminlod"] || selectedRecord["smaxlod"] || selectedRecord["sminloq"] || selectedRecord["smaxloq"]
                || selectedRecord["sdisregard"] || selectedRecord["sresultvalue"]) {
                inputParam = this.onSaveSpecification(saveType, formRef);

                clearSelectedRecordField = [
                
                    { "controlType": "textarea", "idsName": "IDS_MINA", "dataField": "smina", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MAXA", "dataField": "smaxa", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MINLOQ", "dataField": "sminloq", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MAXLOQ", "dataField": "smaxloq", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_DISREGARDED", "dataField": "sdisregard", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MINB", "dataField": "sminb", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MAXB", "dataField": "smaxb", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MINLOD", "dataField": "sminlod", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MAXLOD", "dataField": "smaxlod", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_DEFAULTRESULT", "dataField": "sresultvalue", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_MAXVALUES", "dataField": "smaxlod", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    { "controlType": "textarea", "idsName": "IDS_DEFAULTRESULT", "dataField": "sresultvalue", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                    
                    //{ "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                    //{ "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "nlinkdefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                ]

            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERSPECLIMIT" }));
                isValidRequest = false;
            }
        } else if(this.props.screenName === "IDS_CLINICALSPEC"){
            inputParam = this.onSaveClinicalSpec(saveType, formRef);
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
        else if (this.props.screenName === "IDS_FORMULA"){
            inputParam = this.onSaveFormula(saveType, formRef);
            
            clearSelectedRecordField = [
                { "controlType": "textarea", "idsName": "IDS_FORMULANAME", "dataField": "sformulaname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_INPUT", "dataField": "userinput", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_SYNTAX", "dataField": "syntax", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_FORMULA", "dataField": "sformulacalculationdetail", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_VALIDATEFORMULA", "dataField": "query", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_VALIDATEDRESULT", "dataField": "result", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                { "controlType": "textarea", "idsName": "IDS_SYNTAX", "dataField": "sfunctionsyntax", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                //ALPD-5726--Added by Vignesh R(23-04-2025)-->Test Master-->While validate the formula the already added formula fields name is displayed
                { "controlType": "textarea", "idsName": "IDS_FORMULACALCULATIONCODE", "dataField": "sformulacalculationcode", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },

                //{ "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
                //{ "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "nlinkdefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            ]
        } else if (this.props.screenName === "IDS_PREDEFINEDFORMULA") {
            inputParam = this.onSavePreDefinedFormula(saveType, formRef);
            clearSelectedRecordField = [
                { "controlType": "textarea", "idsName": "IDS_FORMULANAME", "dataField": "sformulaname", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                
            ]
        }
        else if (this.props.screenName === "IDS_TESTFILE") {
            inputParam = this.onSaveTestFile(saveType, formRef);
            // clearSelectedRecordField = [
                
            //     { "controlType": "textarea", "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //     { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //     { "controlType": "textarea", "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
            //     { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            //     { "controlType": "checkbox", "idsName": "IDS_DEFAULTSTATUS", "dataField": "nlinkdefaultstatus", "width": "150px","controlName": "ndefaultstatus", "mandatoryLabel": "IDS_SELECT","isClearField":true,"preSetValue":4 },
            // ]
            clearSelectedRecordField = [];
        } else if (this.props.screenName === "IDS_CONTAINERTYPE") {
            inputParam = this.saveContainerType(saveType, formRef);
            clearSelectedRecordField = [
                
                { "controlType": "textarea", "idsName": "IDS_QUANTITY", "dataField": "nquantity", "width": "200px", "mandatoryLabel": "IDS_ENTER","isClearField":true },
                
            ]
        }
        else {
            inputParam = this.saveTestData(saveType, formRef);
        }
        if (isValidRequest) {
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData }, saveType
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                if(this.props.screenName === "IDS_PARAMETER" || this.props.screenName === "IDS_TESTFILE" ||
                   this.props.screenName === "IDS_CONTAINERTYPE" || this.props.screenName === "IDS_CODEDRESULT" || 
                   this.props.screenName === "IDS_PREDEFINEDFORMULA" || this.props.screenName === "IDS_FORMULA" || 
                   this.props.screenName === "IDS_CLINICALSPEC" || this.props.screenName === "IDS_SPECIFICATION"
                )
                {
                    this.props.crudMaster(inputParam, this.props.masterData, "openChildModal", defaultInput,"",clearSelectedRecordField);
                }
                else
                {
                 this.props.crudMaster(inputParam, this.props.masterData, "openChildModal", defaultInput);
                }
            }
        }
    }
    onSavePreDefinedFormula = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const selectedParameter = this.props.masterData.selectedParameter;
        let testformula = {
            ntestcode: selectedParameter["ntestcode"],
            ntestparametercode: selectedParameter["ntestparametercode"],
            ndefaultstatus: transactionStatus.NO,
            nispredefinedformula: transactionStatus.YES,
            nstatus: transactionStatus.ACTIVE,
            sformulaname: this.state.selectedRecord.sformulaname,
            sformulacalculationcode: "",
            sformulacalculationdetail: this.state.selectedRecord.sformulaname,
            npredefinedformulacode:this.state.selectedRecord.npredefinedformulacode&&this.state.selectedRecord.npredefinedformulacode.value
        }
      

        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            selectedId = selectedRecord["ntestparametercode"];
        }
        const inputParam = {
            inputData: {
                testformula: testformula,
                userinfo: this.props.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO
            },
            classUrl: "testmaster",
            operation: "create",
            methodUrl: "TestFormula", saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    saveContainerType(saveType, formRef) {
        let inputData = {};
        let postParam = undefined;
        let methodUrl = "TestContainerType";
        if (this.props.operation == "create") {
            if (this.state.selectedRecord.nquantity) {
                this.state.selectedRecord['ncontainertypecode']['item']['nquantity'] = Number.parseFloat(this.state.selectedRecord.nquantity).toFixed(3);
            }
            //this.state.selectedRecord['ncontainertypecode']['item']['noutsourcecode'] = parseInt(this.state.selectedRecord.noutsourcecode);
            if (this.state.selectedRecord.nunitcode) {
                this.state.selectedRecord['ncontainertypecode']['item']['nunitcode'] = parseInt(this.state.selectedRecord.nunitcode.value);
            }
            else {
                this.state.selectedRecord['ncontainertypecode']['item']['nunitcode'] = -1
            }
            inputData = {
                [methodUrl.toLocaleLowerCase()]: this.state.selectedRecord.ncontainertypecode.item,
                ntestcontainertypecode: this.state.selectedRecord.ntestcontainertypecode,
                ntestcode: this.state.selectedRecord.ntestcode,


                userinfo: this.props.userInfo,
                testcode: this.props.masterData.SelectedTest.ntestcode,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO
            }
        }
        else {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };

            let unitCode = (this.state.selectedRecord.nquantity === 0 || this.state.selectedRecord.nquantity === undefined) ? -1 : 
                            this.state.selectedRecord.nunitcode.value;

            inputData = {
                ntestcontainertypecode: this.state.selectedRecord.ntestcontainertypecode,
                ntestcode: this.state.selectedRecord.ntestcode,
                ncontainertypecode: this.state.selectedRecord.ncontainertypecode.value,
                // nunitcode: this.state.selectedRecord.nunitcode.value,
                nunitcode : unitCode,
                nquantity: parseInt(Number.parseFloat(this.state.selectedRecord.nquantity).toFixed(3)),
                //noutsourcecode:this.state.selectedRecord.noutsourcecode,
                userinfo: this.props.userInfo,
                testcode: this.props.masterData.SelectedTest.ntestcode,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

            }
        }
        const inputParam = {
            inputData: inputData,
            classUrl: "testmaster",
            operation: this.props.operation,
            methodUrl: methodUrl, saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }
    saveTestData(saveType, formRef) {
        let availableData = [];
        this.state.selectedRecord.availableData.map(data => {
            return availableData.push(data.item);
        });
        let methodUrl = "";
        if (this.props.screenName === "IDS_SECTION") { //Test Section
            methodUrl = "TestSection";
        } else if (this.props.screenName === "IDS_METHOD") { //Test Method
            methodUrl = "TestMethod";
        } else if (this.props.screenName === "IDS_INSTRUMENTCATEGORY") { //Test Instrument Category
            methodUrl = "TestInstrumentCategory";
        } else if (this.props.screenName === "IDS_CONTAINERTYPE") { //Test Instrument Category
            methodUrl = "TestContainerType";
        }
        else if (this.props.screenName === "IDS_PACKAGE") { //Test Package
            methodUrl = "Testpackage";
        }
        else if (this.props.screenName === "IDS_TECHNIQUE") { //Test Technique
            methodUrl = "TestTechnique";
        }

        // let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            //  selectedId = selectedRecord["ntestparametercode"];               
        }
        const inputParam = {
            inputData: {
                [methodUrl.toLocaleLowerCase()]: availableData,
                userinfo: this.props.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

            },
            classUrl: "testmaster",
            operation: "create",
            methodUrl: methodUrl, saveType, formRef, postParam
        }
        return inputParam;
    }

    onSaveParameter = (saveType, formRef) => {
        const storeData = this.props;
        let inputData = {};
        let customobject = null;
        const userInfo = storeData.userInfo;
        let postParam = undefined;
        const selectedRecord = this.state.selectedRecord;
        let testColumns = [{ "ntestparametercode": "int" }, { "nparametertypecode": "input" }, { "nunitcode": "input" }, { "ndestinationunitcode":"input" }, 
        { "noperatorcode":"int" }, { "nconversionfactor":"float" }, { "sparametername": "input" },
            { "sparametersynonym": "string" }, { "nroundingdigits": "int" }, { "objPredefinedParameter": "customobject" },
            { "ndeltachecklimitcode": "float" }, { "ndeltacheck": "int" }, { "ndeltaunitcode": "input" },
            { "ndeltacheckframe": "int" },{"nresultaccuracycode":"input"}]
        if (storeData.operation === "create") {
            inputData = {
                "testparameter": {
                    nisadhocparameter: transactionStatus.NO,
                    nisvisible: transactionStatus.YES,
                    nstatus: transactionStatus.ACTIVE,
                    
                }
            };
        } else {
            inputData = { "testparameter": {} }
            let selectedId = null;

            if (storeData.operation === "update") {
                // edit
                postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
                selectedId = selectedRecord["ntestparametercode"];
            }
        }
        if (selectedRecord["nparametertypecode"]) {
            if (this.props.parameterData.npredefinedcode === transactionStatus.YES) {
                customobject = {};
                customobject["ntestparametercode"] = selectedRecord["ntestparametercode"];
                customobject["ntestpredefinedcode"] = selectedRecord["ntestpredefinedcode"];
                customobject["spredefinedname"] = selectedRecord["spredefinedname"].trim();
                customobject["nstatus"] = 1;
                customobject["ndefaultstatus"] = transactionStatus.YES;
                customobject["ngradecode"] = selectedRecord["ngradecode"] ? selectedRecord["ngradecode"].value ? selectedRecord["ngradecode"].value : -1 : -1;
                // if (selectedRecord["sresultparacomment"]) {
                    customobject["spredefinedsynonym"] = selectedRecord["spredefinedsynonym"] ? selectedRecord["spredefinedsynonym"].trim() : "";

                    //customobject["sresultparacomment"] = selectedRecord["sresultparacomment"] ? selectedRecord["sresultparacomment"].trim() : "";
                // }
            }
            inputData["userinfo"] = userInfo;
			//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
            inputData["isQualisLite"]=(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO;
            testColumns.map(item => {
                const key = Object.keys(item)[0];
                const value = Object.values(item)[0];
                if (value === "input") {
                    return inputData["testparameter"][key] = selectedRecord[key] ? selectedRecord[key].value ? selectedRecord[key].value : -1 : -1;
                } else if (value === "int") {
                    return inputData["testparameter"][key] = selectedRecord[key] ? selectedRecord[key] : 0;
                } else if (value === "string") {
                    return inputData["testparameter"][key] = selectedRecord[key] ? selectedRecord[key].trim() : "";
                } else if (value === "customobject") {
                    return inputData["testparameter"][key] = customobject;

                } else if (value === "float") {
                    return inputData["testparameter"][key] = selectedRecord[key] ? selectedRecord[key] : 0.0;
                } else {
                    return null;
                }
            });
            inputData["testparameter"]["ntestcode"] = storeData.masterData["SelectedTest"]["ntestcode"];
            inputData["testparameter"]["sdisplaystatus"] = selectedRecord["nparametertypecode"].label;
        }
        const inputParam = {
            inputData,
            classUrl: "testmaster",
            operation: storeData.operation,
            methodUrl: "TestParameter",
            saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    onSaveSpecification = (saveType, formRef) => {
        const selectedRecord = this.props.selectedRecord;
        const columns = [{ "ntestparametercode": "int" }, { "ntestparamnumericcode": "int" }, { "sminb": "string" },
        { "smina": "string" }, { "smaxa": "string" }, { "smaxb": "string" }, { "sminlod": "string" }, { "smaxlod": "string" },
        { "sminloq": "string" }, { "smaxloq": "string" }, { "sdisregard": "string" }, { "sresultvalue": "string" }];
        let inputData = {
            "testparameternumeric": {
                nstatus: 1
            },
            userinfo: this.props.userInfo,
			//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
            "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO
        };
        inputData["testparameternumeric"]["ngradecode"] =selectedRecord.ngradecode? selectedRecord.ngradecode.value:-1;
        columns.map(item => {
            const key = Object.keys(item)[0];
            const value = Object.values(item)[0];
            if (value === "int") {
                return inputData["testparameternumeric"][key] = selectedRecord[key] ? selectedRecord[key] : 0;
            } else if (value === "string") {
                return inputData["testparameternumeric"][key] = selectedRecord[key] ?
                    selectedRecord[key] === "0" ? selectedRecord[key] : selectedRecord[key].replace(/^0+/, '') : null;
            } else {
                return null;
            }
        });
        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            selectedId = selectedRecord["ntestparametercode"];
        }
        const inputParam = {
            inputData,
            classUrl: "testmaster",
            operation: this.props.operation,
            methodUrl: "TestParameterNumeric",
            saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }
    onSaveClinicalSpec = (saveType, formRef) => {
        const selectedRecord = this.props.selectedRecord;
      
        const TestGroupAddSpecification = {
            nstatus: transactionStatus.ACTIVE,
            ntestparametercode: this.props.masterData.selectedParameter["ntestparametercode"],
            ngendercode: selectedRecord["ngendercode"] ?selectedRecord["ngendercode"]&&  selectedRecord["ngendercode"].value:-1,
            nfromage: selectedRecord["nfromage"],
            ntoage: selectedRecord["ntoage"],
            shigha: selectedRecord["nhigha"]||'',
            shighb: selectedRecord["nhighb"]||'',
            slowa: selectedRecord["nlowa"]||'',
            slowb: selectedRecord["nlowb"]||'',
            sminlod: selectedRecord["sminlod"]||'',
            smaxlod: selectedRecord["smaxlod"]||'',
            sminloq: selectedRecord["sminloq"]||'',
            smaxloq: selectedRecord["smaxloq"]||'',
            sdisregard: selectedRecord["sdisregard"]||'',
            sresultvalue: selectedRecord["sresultvalue"]||'',
            ngradecode: selectedRecord["ngradecode"] && selectedRecord["ngradecode"].value || -1,

            ntestmasterclinicspeccode: selectedRecord["ntestmasterclinicspeccode"],
            nfromageperiod: selectedRecord["nfromageperiod"] && selectedRecord["nfromageperiod"].value || -1,
            ntoageperiod: selectedRecord["ntoageperiod"] && selectedRecord["ntoageperiod"].value || -1,

        };
        let inputData = {
            "TestGroupAddSpecification": {...TestGroupAddSpecification,
                nstatus: 1
            },
            userinfo: this.props.userInfo,
			//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
            "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

        };
        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            selectedId = selectedRecord["ntestparametercode"];
        }
        const inputParam = {
            inputData,
            classUrl: "testmaster",
            operation: this.props.operation,
            methodUrl: "TestParameterClinicalSpec",
            saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    onSaveCodedResult = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const testPredefinedParameter = {
            spredefinedname: selectedRecord["spredefinedname"].trim(),
            ngradecode: selectedRecord["ngradecode"] ? selectedRecord["ngradecode"].value ? selectedRecord["ngradecode"].value : -1 : -1,
            ntestparametercode: selectedRecord["ntestparametercode"],
            ntestpredefinedcode: selectedRecord["ntestpredefinedcode"],
            //sresultparacomment:selectedRecord["sresultparacomment"],
            spredefinedsynonym:selectedRecord["spredefinedsynonym"],
            spredefinedcomments:selectedRecord["spredefinedcomments"],
            nstatus: transactionStatus.ACTIVE,
            ndefaultstatus: selectedRecord["ndefaultstatus"],//transactionStatus.NO

        }

        //let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            //selectedId = selectedRecord["ntestparametercode"];               
        }
        const inputParam = {
            inputData: {
                testpredefinedparameter: testPredefinedParameter,
                userinfo: this.props.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO

            },
            classUrl: "testmaster",
            operation: this.props.operation,
            methodUrl: "TestPredefinedParameter",
            saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    onSaveFormula = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        
        const formulafield = ["sformulaname", "sformulacalculationcode", "sformulacalculationdetail"];
        const selectedParameter = this.props.masterData.selectedParameter;
        let testformula = {
            ntestcode: selectedParameter["ntestcode"],
            ntestparametercode: selectedParameter["ntestparametercode"],
            ndefaultstatus: transactionStatus.NO,
            nstatus: transactionStatus.ACTIVE,
            nispredefinedformula: transactionStatus.NO,
            npredefinedformulacode:transactionStatus.NA
        }
        formulafield.map(field => {
            return testformula[field] = selectedRecord[field].trim()
        })

        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            selectedId = selectedRecord["ntestparametercode"];
        }
        const inputParam = {
            inputData: {
                testformula: testformula,
                userinfo: this.props.userInfo,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                "isQualisLite":(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO
            },
            classUrl: "testmaster",
            operation: "create",
            methodUrl: "TestFormula", saveType, formRef, postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    clearFormula = () => {
        const selectedRecord = this.state.selectedRecord;
        selectedRecord["sformulacalculationcode"] = "";
        selectedRecord["sformulacalculationdetail"] = "";
        selectedRecord["userinput"] = "";
		//ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
        selectedRecord["sfunctionsyntax"] = "";
        selectedRecord["result"] = "";
        selectedRecord["query"] = "";

        this.setState({
            fieldFlag: true,
            operatorFlag: false,
            functionFlag: true,
            selectedRecord, 
			//ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)           
			openValidate: false
        })
    }

    onFormulaDrop(data) {
        let selectedRecord = this.state.selectedRecord;
        let formulaName = "";
        let formulaCalculationCode = "";
        let fieldFlag = this.state.fieldFlag;
        let functionFlag = this.state.functionFlag;
        let operatorFlag = this.state.operatorFlag;
		//ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
        let sfunctionsyntax=selectedRecord.sfunctionsyntax ? selectedRecord.sfunctionsyntax : "";
        //let sfunctionsyntax = this.state.sfunctionsyntax;
        if(sfunctionsyntax===""){
            functionFlag=true;
        }
        let isDropped = false;
        if (data['testfields'] !== "") {
            const testfields = JSON.parse(data['testfields']);
            if (this.state.fieldFlag) {
                let sformulacalculationdetail = selectedRecord.sformulacalculationdetail ? selectedRecord.sformulacalculationdetail : "";
                let sformulacalculationcode = selectedRecord.sformulacalculationcode ? selectedRecord.sformulacalculationcode : "";
                const sparametername = testfields.sparametername;
                const ntestparametercode = testfields.ntestparametercode;
                if (sparametername !== "Parameter-Field" && sparametername !== "Formula-Field" && sparametername !== "Dynamic-Field") {
                    if (testfields.isformula === 1) {
                        formulaName = `${sformulacalculationdetail} (${sparametername}) `;
                        formulaCalculationCode = `${sformulacalculationcode}$O20O$${ntestparametercode}$O18O$`;
                    } else {
                        formulaName = `${sformulacalculationdetail} ${sparametername}`;
                        formulaCalculationCode = `${sformulacalculationcode}$P${ntestparametercode}P$`;
                    }
                } else if (sparametername !== "Formula-Field") {
                    formulaName = `${sformulacalculationdetail} ${testfields.stestname}`;
                    formulaCalculationCode = `${sformulacalculationcode}$D${ntestparametercode}D$`;
                } else {
                    formulaName = `${sformulacalculationdetail} ${testfields.stestname}`;
                    formulaCalculationCode = `${sformulacalculationcode}${testfields.sformulacalculationcode}`;
                }
                fieldFlag = false;
                functionFlag = false;
                operatorFlag = true;
                isDropped = true;
            }
        } else if (data['operatorfields'] !== "") {
            const operatorfields = JSON.parse(data['operatorfields']);
            const noperatorcode = operatorfields.noperatorcode;
            const sformulacalculationdetail = selectedRecord.sformulacalculationdetail ? selectedRecord.sformulacalculationdetail : "";
            const sformulacalculationcode = selectedRecord.sformulacalculationcode ? selectedRecord.sformulacalculationcode : "";
            if (this.state.operatorFlag) {
                formulaName = `${sformulacalculationdetail} ${operatorfields.soperator}`;
                formulaCalculationCode = `${sformulacalculationcode}$O${noperatorcode}O$`;
                if (noperatorcode === operators.OPENPARENTHESIS) {
                    fieldFlag = true;
                    functionFlag = true;
                    operatorFlag = false;
                } else if (noperatorcode === operators.CLOSEPARENTHESIS) {
                    fieldFlag = false
                    functionFlag = false;
                    operatorFlag = true;
                } else {
                    fieldFlag = true;
                    functionFlag = true;
                    operatorFlag = false;
                }
                isDropped = true;
            } else if (noperatorcode === operators.OPENPARENTHESIS) {
                formulaName = `${sformulacalculationdetail} ${operatorfields.soperator}`;
                formulaCalculationCode = `${sformulacalculationcode}$O${noperatorcode}O$`;
                fieldFlag = true;
                functionFlag = true;
                operatorFlag = false;
                isDropped = true;
            } else if (noperatorcode === operators.CLOSEPARENTHESIS) {
                formulaName = `${sformulacalculationdetail} ${operatorfields.soperator}`;
                formulaCalculationCode = `${sformulacalculationcode}$O${noperatorcode}O$`;
                fieldFlag = false;
                functionFlag = false;
                operatorFlag = true;
                isDropped = true;
            }
        } else if (data['functionfields'] !== "") {
            if (functionFlag) {
                const functionfields = JSON.parse(data['functionfields']);
                const sformulacalculationdetail = selectedRecord.sformulacalculationdetail ? selectedRecord.sformulacalculationdetail : "";
                const sformulacalculationcode = selectedRecord.sformulacalculationcode ? selectedRecord.sformulacalculationcode : "";
                formulaName = `${sformulacalculationdetail}${functionfields.sfunctionname}(`;
                formulaCalculationCode = `${sformulacalculationcode}$F${functionfields.nfunctioncode}F$$O20O$`;
                fieldFlag = true;
                functionFlag = false;
                operatorFlag = false;
                sfunctionsyntax = functionfields.sfunctionsyntax;
                isDropped = true;
            }
        }
        if (isDropped) {
            const sliceFormulaName = formulaName.slice(0, 512);
            if (sliceFormulaName.length <= 512) {
                selectedRecord["sformulacalculationcode"] = formulaCalculationCode;
                selectedRecord["sformulacalculationdetail"] = sliceFormulaName;
                //ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
				selectedRecord["sfunctionsyntax"] = sfunctionsyntax;
                this.setState({ fieldFlag, functionFlag, operatorFlag,  selectedRecord });
            } else {
                selectedRecord["sfunctionsyntax"] = sfunctionsyntax;
                selectedRecord["sformulacalculationdetail"] = sliceFormulaName;
                this.setState({ fieldFlag, functionFlag, operatorFlag, selectedRecord });
            }
        }
    }

    onUserInputs = (event) => {
        const value = event.target.value.replace(/^0+/, '');
        let selectedRecord = this.state.selectedRecord || {};
        if (event.keyCode === 13) {
            if (this.state.fieldFlag) {
                const sformulacalculationdetail = selectedRecord.sformulacalculationdetail ? selectedRecord.sformulacalculationdetail : "";
                const sformulacalculationcode = selectedRecord.sformulacalculationcode ? selectedRecord.sformulacalculationcode : "";
                selectedRecord["sformulacalculationcode"] = `${sformulacalculationcode}$V${value}V$`;
                selectedRecord["sformulacalculationdetail"] = `${sformulacalculationdetail} ${value}`;
                selectedRecord[event.target.name] = "";
                this.setState({
                    fieldFlag: false,
                    functionFlag: false,
                    operatorFlag: true,
                    selectedRecord
                });
            }
        }
    }

    getSyntax = (event) => {
		//ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
        const selectedRecord = this.state.selectedRecord;
        selectedRecord["sfunctionsyntax"]=event.dataItem.sfunctionsyntax;

        this.setState({ selectedRecord })
    }

    onSaveTestFile = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let testFileArray = [];
        let testFile = {
            ntestcode: this.props.masterData.SelectedTest.ntestcode,
            ntestfilecode: selectedRecord.ntestfilecode ? selectedRecord.ntestfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
            nqualislite:(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO,
            ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, testFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== undefined ? selectedRecord.ssystemfilename.split('.') : create_UUID();
                    const filesystemfileext = selectedRecord.ssystemfilename && selectedRecord.ssystemfilename !== undefined ? file.name.split('.')[ssystemfilename.length - 1] : fileExtension;
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.ntestfilecode && selectedRecord.ntestfilecode > 0
                        && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] =Lims_JSON_stringify(file.name,false) ;
                    tempData["sdescription"] =Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim(): "") ,false) ;
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;

                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    testFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                testFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename.trim(),false);
                testFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""),false);
                testFile["nlinkcode"] = transactionStatus.NA;
                testFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                testFile["nfilesize"] = selectedRecord.nfilesize;
				//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
                testFile["nqualislite"]=(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO;

                testFileArray.push(testFile);
            }
        } else {
            testFile["sfilename"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename?selectedRecord.slinkfilename.trim():""),false);
            testFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : ""),false);
            testFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            testFile["ssystemfilename"] = "";
            testFile["nfilesize"] = 0;
			//ALPD-4831--Vignesh R(08-10-2024)--When nsettingcode 71 is set to 3, the Test Group is not required and is automatically updated by default in the relevant test group-related tables.
            testFile["nqualislite"]=(this.props.settings && parseInt(this.props.settings[71])===transactionStatus.NO)? transactionStatus.YES : transactionStatus.NO;

            testFileArray.push(testFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("testfile",JSON.stringify(testFileArray));

      //  formData.append("userinfo", JSON.stringify(this.props.userInfo));



        let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "TestMaster", selectedObject: "SelectedTest", primaryKeyField: "ntestcode" };
            selectedId = selectedRecord["ntestfilecode"];
        }
        const inputParam = {
            inputData: { "userinfo": {...this.props.userInfo,
                sformname: Lims_JSON_stringify(this.props.userInfo.sformname),
                smodulename: Lims_JSON_stringify(this.props.userInfo.smodulename),
				//ALPD-1628(while file saving,audit trail is not captured respective language)
                slanguagename: Lims_JSON_stringify(this.props.userInfo.slanguagename)
            },
 },
            formData: formData,
            isFileupload: true,
            operation: this.props.operation,
            classUrl: "testmaster",
            saveType, formRef, methodUrl: "TestFile", postParam,
            selectedRecord: {...this.state.selectedRecord}
        }
        return inputParam;
    }

    onDropTestFile = (attachedFiles, fieldName, maxSize) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord, actionType: "new" });
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
    ConfirmDelete = (item, operation, ncontrolCode, methodUrl, modalName) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.props.deleteAction(item, operation, ncontrolCode, methodUrl, modalName));
    }
    componentDidUpdate(previousProps) {
        if (this.props.isFormulaOpen) {
            this.setState({
                fieldFlag: true,
                operatorFlag: false,
                functionFlag: true,
                          });
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { isFormulaOpen: false }
            }
            this.props.updateStore(updateInfo);
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
        if (this.props.masterData !== previousProps.masterData) {
            let { testFileDataState,sectionDataState, methodDataState, instrumentCatDataState, containerTypeDataState,testPackageDataState,testClinicalSpecDataState } = this.state;
            if (this.props.dataState === undefined) {
                if (this.props.screenName === "IDS_SECTION") {
                    sectionDataState = { skip: 0, take: 5 };
                } else if (this.props.screenName === "IDS_METHOD") {
                    methodDataState = { skip: 0, take: 5 };
                } else if (this.props.screenName === "IDS_INSTRUMENTCATEGORY") {
                    instrumentCatDataState = { skip: 0, take: 5 };
                }
                else if (this.props.screenName === "IDS_CONTAINERTYPE") {
                    containerTypeDataState = { skip: 0, take: 5 };
                }
                else if (this.props.screenName === "IDS_TESTPACKAGE") {  
                    testPackageDataState = { skip: 0, take: 5 };
                } else if (this.props.screenName === "IDS_TESTFILE" || this.props.screenName === "IDS_FILE") {  
                    testFileDataState = { skip: 0, take: 5 };
                }else {
                    sectionDataState = { skip: 0, take: 5 };
                    methodDataState = { skip: 0, take: 5 };
                    instrumentCatDataState = { skip: 0, take: 5 };
                    containerTypeDataState = { skip: 0, take: 5 };
                    testPackageDataState = { skip: 0, take: 5 };
                    testFileDataState={ skip: 0, take: 5 };
                   // testClinicalSpecDataState = { skip: 0, take: 5 ,group: [{ field: 'sgendername' }]};
                }
            }
            else{

                if (this.props.screenName === "IDS_SECTION") {
                    sectionDataState = this.props.dataState;
                } else if (this.props.screenName === "IDS_METHOD") {
                    methodDataState =this.props.dataState;
                } else if (this.props.screenName === "IDS_INSTRUMENTCATEGORY") {
                    instrumentCatDataState = this.props.dataState;
                }
                else if (this.props.screenName === "IDS_CONTAINERTYPE") {
                    containerTypeDataState = this.props.dataState;
                }
                else if (this.props.screenName === "IDS_TESTPACKAGE") {
                    testPackageDataState = this.props.dataState;
                }else if (this.props.screenName === "IDS_TESTFILE" || this.props.screenName === "IDS_FILE") {  
                    testFileDataState = { skip: 0, take: 5 };
                }else{
                    sectionDataState = { skip: 0, take: 5 };
                    methodDataState = { skip: 0, take: 5 };
                    instrumentCatDataState = { skip: 0, take: 5 };
                    containerTypeDataState = { skip: 0, take: 5 };
                    testPackageDataState = { skip: 0, take: 5 };
                    testFileDataState={ skip: 0, take: 5 };
                }
            }
                // let skipcount=this.props.masterData["TestMethod"].length>0?(this.props.masterData["TestMethod"].length-this.props.dataState.take):
                // this.props.dataState.skip;
                // if (this.props.screenName === "IDS_METHOD") {
                //     methodDataState = { skip: skipcount, take: 5 };
                // } 
                // let dataResultMethod=process(this.props.masterData["TestMethod"], this.props.dataState );
            
                // let { dataState } = this.state;
                // if (this.props.dataState === undefined) {
                //     dataState = { skip:0,take:this.state.dataState.take }
                // }
                // if(dataResultMethod){
                //     if(dataResultMethod >=5){
                //        let skipcount=this.state.dataState.skip>0?(this.state.dataState.skip-this.state.dataState.take):
                //        this.state.dataState.skip
                //         methodDataState={skip:skipcount,take:this.state.dataState.take}
                //     }
                // }

                
                // dataResult={process(this.props.masterData["TestSection"], 
                //     (this.props.screenName === undefined || this.props.screenName === "IDS_SECTION") ? 
                //     this.state.sectionDataState : { skip: 0, take: 10 })}

                //     dataResult: process(this.props.Login.masterData, this.state.dataState),

                // this.setState({
                //     data: this.props.Login.masterData, 
                //     dataResult: process(this.props.Login.masterData, dataState),
                //     dataState
                // });

        //     // Maintain pagination after delete
        // const totalRecords = this.props.masterData["TestMethod"].length;
        // const currentPageRecords = this.props.dataState.take;
        // const currentSkip = this.props.dataState.skip;

        // // If there are fewer records in the current page (because of a deletion), adjust skip
        // if (totalRecords % currentPageRecords === 0 && currentSkip > 0) {
        //     this.setState({
        //         methodDataState: { ...methodDataState, skip: currentSkip - currentPageRecords }
        //     });
        // }



            this.setState({ testFileDataState,sectionDataState, methodDataState, instrumentCatDataState, containerTypeDataState, testPackageDataState,testClinicalSpecDataState });
        }
    }
}

export default injectIntl(TestView);