import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../components/Enumeration';

const TestInstrumentCategoryTab = (props) => {
    const addInstCategoryId = props.controlMap.has("AddInstrumentCategory") && props.controlMap.get("AddInstrumentCategory").ncontrolcode;
    const testInstrumentCatColumnList = [
        {"idsName":"IDS_INSTRUMENTCATEGORY","dataField":"sinstrumentcatname","width":"200px"},
        {"idsName":"IDS_SETASDEFAULT","dataField":"stransdisplaystatus","width":"100px", "componentName": "switch", 
        "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultTestInstrumentCategory"}
    ];    
    //const methodUrl = "TestInstrumentCategory";
    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addtestinstrumentcategory" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addInstCategoryId) === -1}
                        onClick={()=>props.getAvailableData(props.selectedTest, "getAvailableInstrumentCategory", 
                            "instrumentcategory", "IDS_INSTRUMENTCATEGORY", props.userInfo, addInstCategoryId)}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        <FormattedMessage id="IDS_ADDINSTRUMENTCATEGORY" defaultMessage="Instrument Category" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        key="testinstrumentcatkey"
                        primaryKeyField="ntestinstrumentcatcode"
                        data={props.TestInstrumentCategory || []}
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
                        deleteParam={{operation:"delete", methodUrl:"TestInstrumentCategory"}}
                        methodUrl={"TestInstrumentCategory"}
                        hideColumnFilter={false}
                        onSwitchChange={props.defaultRecord}
                        switchParam={{operation:"Default", methodUrl:"TestInstrumentCategory"}}
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
};

export default TestInstrumentCategoryTab;