// import React from 'react';
// import { injectIntl, FormattedMessage } from 'react-intl';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
// import { Nav, Row, Col } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import DataGrid from '../../components/data-grid/data-grid.component';
// import { transactionStatus } from '../../components/Enumeration';

// const TestTechniqueTab = (props) => {
//     const addTechniqueId = props.controlMap.has("AddTechnique") && props.controlMap.get("AddTechnique").ncontrolcode;
//     const testSectionColumnList = [
//         {"idsName":"IDS_TECHNIQUE","dataField":"stechniquename","width":"200px"},
//         {"idsName":"IDS_SETASDEFAULT","dataField":"stransdisplaystatus","width":"100px", "componentName": "switch", 
//             "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultTestSection"}
//     ];
//     const methodUrl = "TestTechnique";
//     return (
//         <>
//             <div className="actions-stripe">
//                 <div className="d-flex justify-content-end">
//                     <Nav.Link name="addtesttechnique" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addTechniqueId) === -1}
//                         onClick={()=>props.getAvailableData(props.selectedTest, 
//                             "getAvailableTechnique", "technique", "IDS_TECHNIQUE", props.userInfo, addTechniqueId)}>
//                         <FontAwesomeIcon icon = { faPlus } />{" "}
//                         <FormattedMessage id="IDS_TECHNIQUE" defaultMessage="Technique"></FormattedMessage>
//                     </Nav.Link>
//                 </div>
//             </div>
//             <Row noGutters={true}>
//                 <Col md="12">
//                     <DataGrid
//                         key="testsectionkey"
//                         primaryKeyField = "ntesttechniquecode"
//                         data = {props.TestTechnique}
//                         dataResult = {props.dataResult}
//                         dataState = {props.dataState}
//                         dataStateChange = {props.dataStateChange}
//                         extractedColumnList = {testSectionColumnList}
//                         controlMap = {props.controlMap}
//                         userRoleControlRights={props.userRoleControlRights}
//                         inputParam = {props.inputParam}
//                         userInfo = {props.userInfo}
//                         deleteRecord = {props.deleteRecord}
//                         pageable={false}
//                         scrollable={'scrollable'}
//                         gridHeight = {'600px'}
//                         isActionRequired={true}
//                         deleteParam={{operation:"delete", methodUrl}}
//                         methodUrl={methodUrl}
//                         hideColumnFilter={false}
//                         onSwitchChange = {props.defaultRecord}
//                         switchParam={{operation:"Default", methodUrl}} 
//                     >
//                     </DataGrid>
//                 </Col>
//             </Row>
//         </>
//     );
// };

// export default injectIntl(TestTechniqueTab);