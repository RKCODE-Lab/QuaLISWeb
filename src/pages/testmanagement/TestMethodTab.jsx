import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { transactionStatus } from '../../components/Enumeration';

const TestMethodTab = (props) => {
    const addMethodId = props.controlMap.has("AddMethod") && props.controlMap.get("AddMethod").ncontrolcode;
    const testMethodColumnList = [
        {"idsName":"IDS_METHOD","dataField":"smethodname","width":"200px"},
        {"idsName":"IDS_SETASDEFAULT","dataField":"stransdisplaystatus","width":"100px", "componentName": "switch", 
        "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultTestMethod"}
    ];
    const methodUrl = "TestMethod";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestmethod" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addMethodId) === -1}
                        onClick={()=>props.getAvailableData(props.selectedTest, "getAvailableMethod", 
                            "method", "IDS_METHOD", props.userInfo, addMethodId)}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        <FormattedMessage id="IDS_ADDMETHOD" defaultMessage="Method" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        key="testmethodkey"
                        primaryKeyField="ntestmethodcode"
                        data={props.TestMethod}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={testMethodColumnList}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        inputParam={props.inputParam}
                        userInfo={props.userInfo}
                        deleteRecord={props.deleteRecord}
                        pageable={true}
                        scrollable={'scrollable'}
                        gridHeight={'450px'}
                        isActionRequired={true}
                        deleteParam={{operation:"delete", methodUrl}}
                        methodUrl={methodUrl}
                        hideColumnFilter={false}
                        onSwitchChange={props.defaultRecord}
                        switchParam={{operation:"Default", methodUrl}}
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
};

export default injectIntl(TestMethodTab);