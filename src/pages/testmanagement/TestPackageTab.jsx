import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../components/Enumeration';

const TestPackageTab = (props) => {
    const addPackageId = props.controlMap.has("AddPackage") && props.controlMap.get("AddPackage").ncontrolcode;
    const testInstrumentCatColumnList = [
        {"idsName":"IDS_PACKAGE","dataField":"stestpackagename","width":"200px"},
        {"idsName":"IDS_SETASDEFAULT","dataField":"stransdisplaystatus","width":"100px", "componentName": "switch", 
        //ALPD-3510
        "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultTestPackage"}
    ];    
    const methodUrl = "Package";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestinstrumentcategory" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addPackageId) === -1}
                        onClick={()=>props.getAvailableData(props.selectedTest, "getAvailablePackage", 
                            "package", "IDS_PACKAGE", props.userInfo, addPackageId)}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        <FormattedMessage id="IDS_PACKAGE" defaultMessage="Package" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        key="testpackagekey"
                        primaryKeyField="ntestpackagetestcode"
                        data={props.TestPackage || []}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={testInstrumentCatColumnList}
                        controlMap={ props.controlMap }
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

export default TestPackageTab;