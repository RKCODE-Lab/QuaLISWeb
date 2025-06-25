import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../components/Enumeration';

const TestSectionTab = (props) => {
    const addSectionId = props.controlMap.has("AddSection") && props.controlMap.get("AddSection").ncontrolcode;
    const testSectionColumnList = [
        {"idsName":"IDS_SECTION","dataField":"ssectionname","width":"200px"},
        {"idsName":"IDS_SETASDEFAULT","dataField":"stransdisplaystatus","width":"100px", "componentName": "switch", 
            "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultTestSection"}
    ];
    const methodUrl = "TestSection";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestsection" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addSectionId) === -1}
                        onClick={()=>props.getAvailableData(props.selectedTest, 
                            "getAvailableSection", "section", "IDS_SECTION", props.userInfo, addSectionId)}>
                        <FontAwesomeIcon icon = { faPlus } />{" "}
                        <FormattedMessage id="IDS_ADDSECTION" defaultMessage="Section"></FormattedMessage>
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField = "ntestsectioncode"
                        data = {props.TestSection}
                        dataResult = {props.dataResult}
                        dataState = {props.dataState}
                        dataStateChange = {props.dataStateChange}
                        extractedColumnList = {testSectionColumnList}
                        controlMap = {props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam = {props.inputParam}
                        userInfo = {props.userInfo}
                        deleteRecord = {props.deleteRecord}
                        pageable={true}
                        scrollable={'scrollable'}
                        gridHeight = {'450px'}
                        isActionRequired={true}
                        deleteParam={{operation:"delete", methodUrl}}
                        methodUrl={methodUrl}
                        hideColumnFilter={false}
                        onSwitchChange = {props.defaultRecord}
                        switchParam={{operation:"Default", methodUrl}} 
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
};

export default injectIntl(TestSectionTab);