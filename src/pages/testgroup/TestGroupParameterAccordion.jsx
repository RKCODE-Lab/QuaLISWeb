import React, { useState } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { faPencilAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Nav, FormGroup, FormLabel, Card } from 'react-bootstrap';
import { ReadOnlyText } from '../../components/App.styles';
import { parameterType, SampleType, transactionStatus } from '../../components/Enumeration';
import PredefinedParameterTab from '../testmanagement/PredefinedParameterTab';
import NumericParameterTab from './NumericParameterTab';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
import { AtTableWrap } from '../../components/client-group.styles';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { ContentPanel } from '../product/product.styled';



const TestGroupParameterAccordion = (props) => {
    const isActionRequired = true;
    const gridHeight = 'auto'
    const parameterFieldName = [
        { "sparametersynonym": "IDS_PARAMETERSYNONYM" },
        { "sdisplaystatus": "IDS_PARAMETERTYPE" },
        { "nsorter": "IDS_SORTER" },
        { "schecklistname": "IDS_CHECKLISTNAME" },
        { "schecklistversionname": "IDS_CHECKLISTVERSION" },
        { "nroundingdigits": "IDS_ROUNDINGDIGITS", "nparametertypecode": parameterType.NUMERIC },
        { "sunitname": "IDS_UNIT", "nparametertypecode": parameterType.NUMERIC },
        { "sresultaccuracyname": "IDS_RESULTACCURACY" },
        { "sreportmandatory": "IDS_REPORTMANDATORY" }, { "sresultmandatory": "IDS_RESULTMANDATORY" },
        //{ "sspecdesc": "IDS_SPECDESCRIPTION" }
        { "sspecdesc": "IDS_PARAMETERDESCRIPTION" },
        { "sisadhocparameter":"IDS_ADHOCPARAMETER"}
    ];


    const specLimitFieldName = [
        { "sminlod": "IDS_MINLOD" }, { "smaxlod": "IDS_MAXLOD" },
        { "sminloq": "IDS_MINLOQ" }, { "smaxloq": "IDS_MAXLOQ" },
        { "sminb": "IDS_MINB" }, { "smaxb": "IDS_MAXB" },
        { "smina": "IDS_MINA" }, { "smaxa": "IDS_MAXA" },
        { "sresultvalue": "IDS_DEFAULTRESULT" },{ "sdisregard": "IDS_DISREGARDED" }
        ,{ "sgradename": "IDS_GRADE" }
    ];
    const formulaFieldName = [{ "sformulaname": "IDS_FORMULANAME" }, { "sformulacalculationdetail": "IDS_FORMULA" }];
    const editParameterId = props.controlMap && props.controlMap.has("EditParameter") && props.controlMap.get("EditParameter").ncontrolcode;
    const editViewCLId = props.controlMap && props.controlMap.has("EditParameter") && props.controlMap.get("EditParameter").ncontrolcode;
    const { selectedParameter, userInfo, userRoleControlRights, testGroupTestFormula, testGroupTestNumericParameter,
        testGroupTestPredefinedParameter, testGroupCharParameter, selectedSpecification, filterData, testGroupTestClinicalSpec, optionalData,selectedNode } = props;
    const viewCheckListParam = { nchecklistversioncode: selectedParameter.nchecklistversioncode, flag: 1, ntransactionresultcode: 0, userinfo: userInfo };
    const addClinicalSpec = props.controlMap && props.controlMap.has("AddClinicalSpec") && props.controlMap.get("AddClinicalSpec").ncontrolcode;
    const editClinicalSpec = props.controlMap && props.controlMap.has("EditClinicalSpec") && props.controlMap.get("EditClinicalSpec").ncontrolcode;
    const deleteClinicalSpec = props.controlMap && props.controlMap.has("DeleteClinicalSpec") && props.controlMap.get("DeleteClinicalSpec").ncontrolcode;

    return (

        <div className="fixed_list_height">
            <Row>
                <Col md={12} className="d-flex justify-content-end">
                    {selectedParameter && selectedParameter.nchecklistversioncode !== -1 &&
                        <Nav.Link className="btn btn-circle outline-grey mr-2" hidden={userRoleControlRights.indexOf(editViewCLId) === -1}
                            onClick={() => props.viewTestGroupCheckList(viewCheckListParam)}
                            data-tip={props.intl.formatMessage({ id: "IDS_VIEW" })}>
                            <FontAwesomeIcon icon={faEye} />
                        </Nav.Link>
                    }
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        hidden={userRoleControlRights.indexOf(editParameterId) === -1}
                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                        onClick={() => props.editTestGroupParameter("update", selectedParameter, userInfo, editParameterId, selectedSpecification, filterData,
                            props.masterData)}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Nav.Link>
                </Col>
            </Row>



            <Row>

                {parameterFieldName.map(item => {
                    return (
                        item.nparametertypecode === undefined
                            || (item.nparametertypecode
                                && item.nparametertypecode === props.testgrouptestparameter.nparametertypecode) ?
                            (Object.keys(item)[0] === "sparametersynonym" || Object.keys(item)[0] === "sspecdesc") ?
                                <Col md="12">
                                    <FormGroup>
                                        <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                        <ReadOnlyText>{selectedParameter[Object.keys(item)[0]]}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                : <Col md="6">
                                    <FormGroup>
                                        <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                        <ReadOnlyText>{selectedParameter[Object.keys(item)[0]] === "NA" ? '-' : selectedParameter[Object.keys(item)[0]]}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                            : ""

                    )
                }
                )}
            </Row>

            {selectedParameter.nparametertypecode === parameterType.NUMERIC &&
                <>
                    {testGroupTestNumericParameter && testGroupTestNumericParameter.length > 0 && props.filterData && props.filterData.nsampletypecode && props.filterData.nsampletypecode.item && props.filterData.nsampletypecode.item.nclinicaltyperequired ===transactionStatus.NO &&//props.masterData.selectedNode.nsampletypecode !== SampleType.CLINICALTYPE &&
                        <>
                            <Row>
                                <Col >
                                    <div className="horizontal-line"></div>
                                </Col>
                            </Row>
                            <Row>
                                {specLimitFieldName.map(item => {
                                    return (
                                        <Col md="6">
                                            <FormGroup>
                                                <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                                <ReadOnlyText>{testGroupTestNumericParameter[0][Object.keys(item)[0]]}</ReadOnlyText>
                                            </FormGroup>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </>
                    }
                    {testGroupTestFormula && testGroupTestFormula.length > 0 &&
                        <>
                            <Row>
                                <Col >
                                    <div className="horizontal-line"></div>
                                </Col>
                            </Row>
                            <Row>
                                {formulaFieldName.map(item => {
                                    return (
                                        <Col md="6">
                                            <FormGroup>
                                                <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                                <ReadOnlyText>{testGroupTestFormula[0][Object.keys(item)[0]]}</ReadOnlyText>
                                            </FormGroup>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </>   
                    }

                    {props.filterData && props.filterData.nsampletypecode && props.filterData.nsampletypecode.item && props.filterData.nsampletypecode.item.nclinicaltyperequired ===transactionStatus.YES &&//props.masterData.selectedNode.nsampletypecode === SampleType.CLINICALTYPE &&
                        <>
                            <Row className="no-gutters pt-2 pb-2 col-12 text-right border-bottom">
                                <Col md={12}>
                            <div className="d-flex justify-content-end">
                                
                            <Nav.Link name="addclinicalspec" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addClinicalSpec) === -1}
                        onClick={() =>  props.openModal("create", selectedParameter, userInfo, optionalData, props.masterData,addClinicalSpec)}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_CLINICALSPEC" defaultMessage="Clinical Spec" />
                    </Nav.Link>
                                       
                                    </div>
                                </Col>
                            </Row>
                            {/* {props.siteAddress.nmanufsitecode === props.masterData.ManufacturerSiteAddress.nmanufsitecode ? */}
                            <Row>
                                <Col>
                                    {/* <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            <Card.Body className='form-static-wrap padding-class'> */}
                                                <DataGrid
                                                    primaryKeyField={"ntestgrouptestclinicspeccode"}
                                                    expandField="expanded"

                                                    //detailedFieldList={props.detailedFieldList || []}
                                                    gridHeight={gridHeight + 'px'}
                                                    extractedColumnList={props.extractedColumnList || []}
                                                    //inputParam={props.inputParam}
                                                    userInfo={props.userInfo}
                                                    scrollable={"scrollable"}
                                                    //gridHeight={'200px'}
                                                    isActionRequired={true}
                                                    //fixedScroll={true}
                                                    data={props.data}
                                                    total={props.data && props.data.length || 0}
                                                    dataState={props.dataState}
                                                    dataStateChange={props.dataStateChange}
                                                    dataResult={process(testGroupTestClinicalSpec || [], props.dataState)}{...props.dataState}
                                                    controlMap={props.controlMap}
                                                    userRoleControlRights={[]}
                                                    methodUrl="testgrouptestclinicspeccode"
                                                    pageable={true}
                                                    selectedId={props.selectedId}
                                                    hasDynamicColSize={props.hasDynamicColSize}
                                                    hideDetailBand={true}
                                                    actionIcons={[{
                                                        title: props.intl.formatMessage({ id: "IDS_EDIT" }),
                                                        controlname: "faPencilAlt",
                                                        objectName: "mastertoedit",
                                                        hidden: userRoleControlRights.indexOf(editClinicalSpec) === -1,
                                                        //onClick: (viewdetails) => this.ViewAuditDetails(viewdetails)
                                                        onClick: (viewdetails) => props.EditSpecDetails(viewdetails,editClinicalSpec)

                                                    },
                                                    {
                                                        title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                        controlname: "faTrashAlt",
                                                        objectName: "mastertodelete",
                                                        hidden: userRoleControlRights.indexOf(deleteClinicalSpec) === -1,
                                                        onClick: (viewdetails) => props.DeleteSpecDetails(viewdetails,deleteClinicalSpec)
                                                    }
                                                    ]}



                                                >
                                                </DataGrid>

                                            {/* </Card.Body>
                                        </Card>
                                    </ContentPanel> */}
                                </Col>
                            </Row>
                        </>
                    }
                </>
            }
            {selectedParameter.nparametertypecode === parameterType.PREDEFINED &&
                <PredefinedParameterTab
                    primaryKeyName="ntestgrouptestpredefcode"
                    predefinedParameterList={testGroupTestPredefinedParameter}
                    selectedParameter={selectedParameter}
                    userInfo={userInfo}
                    optionalData={{ testgroupspecification: selectedSpecification }}
                    methodUrl="TestGroupPredefParameter"
                    addId={props.controlMap.has("AddCodedResult") && props.controlMap.get("AddCodedResult").ncontrolcode}
                    editId={props.controlMap.has("EditCodedResult") && props.controlMap.get("EditCodedResult").ncontrolcode}
                    deleteId={props.controlMap.has("DeleteCodedResult") && props.controlMap.get("DeleteCodedResult").ncontrolcode}
                    viewId={props.controlMap.has("ViewSubCodedResult") && props.controlMap.get("ViewSubCodedResult").ncontrolcode}
                    userRoleControlRights={props.userRoleControlRights}
                    deleteAction={props.deleteAction}
                    onSwitchChange={props.onSwitchChange}
                    openModal={props.addTestGroupCodedResult}
                    subCodedResultView={props.subCodedResultView}
                    masterData={props.masterData}
                />
            }
            {selectedParameter.nparametertypecode === parameterType.CHARACTER &&
                testGroupCharParameter.length > 0 && props.testGroupCharParameter[0].scharname &&
                props.testGroupCharParameter[0].scharname !== "null" &&
                <>
                    <Row>
                        <Col >
                            <div className="horizontal-line"></div>
                        </Col>
                    </Row>
                    <Col md={12}>
                        <FormGroup>
                            <FormLabel>{props.intl.formatMessage({ id: "IDS_TESTCHARACTER" })}</FormLabel>
                            <ReadOnlyText>{props.testGroupCharParameter[0].scharname}</ReadOnlyText>
                        </FormGroup>
                    </Col>
                </>
            }
        </div>
    );
};

export default injectIntl(TestGroupParameterAccordion);
