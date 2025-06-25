import React from 'react';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { injectIntl } from 'react-intl';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';
import TestFormulaTab from './TestFormulaTab';
import TestSpecificationTab from './TestSpecificationTab';
import PredefinedParameterTab from './PredefinedParameterTab';
import { parameterType, transactionStatus } from '../../components/Enumeration';
// import { Tooltip } from '@progress/kendo-react-tooltip';
//import ReactTooltip from 'react-tooltip';

const ParameterTabAccordion = (props) => {
    let dataFieldName = "";
    if (props.testParameter["nparametertypecode"] === parameterType.NUMERIC) {
        dataFieldName = [{ "sparametersynonym": "IDS_PARAMETERSYNONYM" }, { "sdisplaystatus": "IDS_PARAMETERTYPE" },
        { "nroundingdigits": "IDS_ROUNDINGDIGITS" }, { "sunitname": "IDS_UNIT" },{"sunitname1": "IDS_CONVERSIONUNIT"},
        //ALPD-3521
		{"soperator":"IDS_CONVERSIONOPERATOR"},
        { "nconversionfactor": "IDS_CONVERSIONFACTOR" },{"sresultaccuracyname":"IDS_RESULTACCURACY"},
        { "stransdisplaystatus": "IDS_DELTACHECK" }];
    } else {
        dataFieldName = [{ "sparametersynonym": "IDS_PARAMETERSYNONYM" }, { "sdisplaystatus": "IDS_PARAMETERTYPE" }];
    }
    const editParameterId = props.controlMap.has("EditParameter") && props.controlMap.get("EditParameter").ncontrolcode;
    const deleteParameterId = props.controlMap.has("DeleteParameter") && props.controlMap.get("DeleteParameter").ncontrolcode;
    const { testParameter, selectedParameter, userInfo, testFormula, testParameterNumeric, testPredefinedParameter,SelectedTest } = props;
    return (
        <>
            <Row>
                <Col md={12} className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                       // data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(editParameterId) === -1}
                        onClick={() => props.addParameter("update", props.selectedParameter, props.userInfo, editParameterId)}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        data-tip={props.intl.formatMessage({ id: "IDS_DELETE" })}
                     //   data-for="tooltip_list_wrap"
                        hidden={props.userRoleControlRights.indexOf(deleteParameterId) === -1}
                        onClick={() => props.ConfirmDelete(testParameter, "delete", deleteParameterId, "TestParameter", "openChildModal", "openChildModal")}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                        {/* <ConfirmDialog
                                name="deleteMessage"
                                message={props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                doLabel={props.intl.formatMessage({ id: "IDS_OK" })}
                                doNotLabel={props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                icon={faTrashAlt}
                                // title={props.intl.formatMessage({ id: "IDS_DELETE" })}
                                hidden={props.userRoleControlRights && props.userRoleControlRights.indexOf(deleteParameterId) === -1}
                                handleClickDelete={() => props.deleteAction(testParameter, "delete", deleteParameterId, "TestParameter", "openChildModal", "openChildModal")}
                            /> */}
                    </Nav.Link>
                    {/* </Tooltip> */}
                </Col>
            </Row>
            <Row>
                {dataFieldName.map(item => {
                    return (
                        <Col md="6">
                            <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                <ReadOnlyText>{selectedParameter[Object.keys(item)[0]]}</ReadOnlyText>
                            </FormGroup>
                        </Col>
                    )
                })}
            </Row>

            {selectedParameter.nparametertypecode === parameterType.NUMERIC &&
                <>
                    <TestFormulaTab
                        primaykeyName="ntestformulacode"
                        formulaList={testFormula}
                        selectedParameter={selectedParameter}
                        userInfo={userInfo}
                        methodUrl="TestFormula"
                        addId={props.controlMap.has("AddFormula") && props.controlMap.get("AddFormula").ncontrolcode}
                        addPreDefinedFormulaId={props.controlMap.has("AddPredefinedFormula") && props.controlMap.get("AddPredefinedFormula").ncontrolcode}
                        deleteId={props.controlMap.has("DeleteFormula") && props.controlMap.get("DeleteFormula").ncontrolcode}
                        defaultFormulaId={props.controlMap.has("DefaultTestFormula") && props.controlMap.get("DefaultTestFormula").ncontrolcode}
                        userRoleControlRights={props.userRoleControlRights}
                        deleteAction={props.deleteAction}
                        onSwitchChange={props.onSwitchChange}
                        openModal={props.addFormula}
                        openPredefinedModal={props.openPredefinedModal}
                    />
                     <TestSpecificationTab
                        parameterNumericList={testParameterNumeric}
                        selectedParameter={selectedParameter}
                        userInfo={userInfo}
                        addId={SelectedTest.nclinicaltyperequired===transactionStatus.YES?props.controlMap.has("AddClinicalSpec") && props.controlMap.get("AddClinicalSpec").ncontrolcode:props.controlMap.has("AddSpecification") && props.controlMap.get("AddSpecification").ncontrolcode}
                        editId={SelectedTest.nclinicaltyperequired===transactionStatus.YES?props.controlMap.has("EditClinicalSpec") && props.controlMap.get("EditClinicalSpec").ncontrolcode:props.controlMap.has("EditSpecification") && props.controlMap.get("EditSpecification").ncontrolcode}
                        deleteId={SelectedTest.nclinicaltyperequired===transactionStatus.YES?props.controlMap.has("DeleteClinicalSpec") && props.controlMap.get("DeleteClinicalSpec").ncontrolcode:props.controlMap.has("DeleteSpecification") && props.controlMap.get("DeleteSpecification").ncontrolcode}
                        userRoleControlRights={props.userRoleControlRights}
                        deleteAction={props.deleteAction}
                        onSwitchChange={props.onSwitchChange}
                        openModal={props.addParameterSpecification}
                        openModalSpec={props.addClinicalSpecification}
                        grade={props.grade}
                        SelectedTest={SelectedTest}
                        hasDynamicColSize={true}
                        controlMap={props.controlMap}
                        TestMasterClinicalSpec={props.masterData.TestMasterClinicalSpec}
                        data={props.masterData.TestMasterClinicalSpec}
                        dataState={props.dataState}
                       dataStateChange={props.dataStateChange}
                       EditSpecDetails={props.EditSpecDetails}
                       deleteRecord={props.deleteRecord}
                       
                    /> 
                </>
            }
            {selectedParameter.nparametertypecode === parameterType.PREDEFINED &&
                <PredefinedParameterTab
                    primaryKeyName="ntestpredefinedcode"
                    predefinedParameterList={testPredefinedParameter}
                    selectedParameter={selectedParameter}
                    userInfo={userInfo}
                    methodUrl="TestPredefinedParameter"
                    addId={props.controlMap.has("AddCodedResult") && props.controlMap.get("AddCodedResult").ncontrolcode}
                    editId={props.controlMap.has("EditCodedResult") && props.controlMap.get("EditCodedResult").ncontrolcode}
                    deleteId={props.controlMap.has("DeleteCodedResult") && props.controlMap.get("DeleteCodedResult").ncontrolcode}
                    viewId={props.controlMap.has("ViewSubCodedResult") && props.controlMap.get("ViewSubCodedResult").ncontrolcode}
                    userRoleControlRights={props.userRoleControlRights}
                    deleteAction={props.deleteAction}
                    onSwitchChange={props.onSwitchChange}
                    openModal={props.addCodedResult}
                    addSubCodedResult={props.addSubCodedResult}
                />
            }
        </>
    );
};

export default injectIntl(ParameterTabAccordion);