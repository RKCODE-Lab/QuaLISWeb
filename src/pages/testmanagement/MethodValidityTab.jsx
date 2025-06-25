import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';

const MethodValidityTab = (props) => {
    const addId = props.controlMap.has("AddMethodValidity") && props.controlMap.get("AddMethodValidity").ncontrolcode;
   // const approveId = props.controlMap.has("ApprovalMethodValidity") && props.controlMap.get("ApprovalMethodValidity").ncontrolcode;
    //const editId = props.controlMap.has("EditMethodValidity") && props.controlMap.get("EditMethodValidity").ncontrolcode;
   // const deleteId = props.controlMap.has("DeleteMethodValidity") && props.controlMap.get("DeleteMethodValidity").ncontrolcode;
    const methodValidityColumnList = [
        {"idsName":"IDS_METHODVALIDITYSTARTDATE","dataField":"svaliditystartdate","width":"250px"},
        {"idsName":"IDS_VALIDITYENDDATE","dataField":"svalidityenddate","width":"250px"},
        {"idsName":"IDS_STATUS","dataField":"sdisplaystatus","width":"150px"}
    ];
    const methodUrl = "MethodValidity";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addmethodvalidity" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addId) === -1}
                        onClick={()=>props.openChildModal()}
                        data-tip={props.formatMessage({ id: "IDS_METHODVALIDITY" })}> 
                        
                        <FontAwesomeIcon icon = { faPlus } />{" "}
                        <FormattedMessage id="IDS_METHODVALIDITY" defaultMessage="Method Validity"></FormattedMessage>
                    </Nav.Link>
                    {/* <Nav.Link name="approvalmethodvalidity" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(approveId) === -1}
                        onClick={() => props.onApproveClick("MethodValidity", "approve", "nmethodvaliditycode", approveId)}
                        data-tip={props.formatMessage({ id: "IDS_APPROVE" })}>                         
                        <FontAwesomeIcon icon = { faThumbsUp } />{" "} */}
                        {/* <FormattedMessage id="IDS_APPROVALMETHODVALIDITY" defaultMessage="Method Validity"></FormattedMessage> */}
                    {/* </Nav.Link> */}
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        //key="methodvaliditykey"
                        primaryKeyField = "nmethodvaliditycode"
                        selectedId={props.operation === "update" ? props.selectedId : props.selectedComponent ?
                        props.selectedComponent.nmethodvaliditycode : null}
                        data = {props.MethodValidity}
                        dataResult = {props.dataResult}
                        dataState = {props.dataState}
                        dataStateChange = {props.dataStateChange}
                        extractedColumnList = {methodValidityColumnList}
                        controlMap = {props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        fetchRecord={props.fetchMethodValidityById}
                        editParam={props.editParam}
                        inputParam = {props.inputParam}
                        userInfo = {props.userInfo}
                        deleteRecord = {props.deleteRecord}
                        handleRowClick={props.handleComponentRowClick}
                        pageable={true}
                        scrollable={'scrollable'}
                        gridHeight = {'410px'}
                        isActionRequired={true}
                        deleteParam={{operation:"delete", methodUrl}}
                        methodUrl={methodUrl}
                        hideColumnFilter={false}
                        onSwitchChange = {props.defaultRecord}
                        switchParam={{operation:"Default", methodUrl}} 
                        approveRecord={props.onApproveClick}
                        >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
};

export default injectIntl(MethodValidityTab);