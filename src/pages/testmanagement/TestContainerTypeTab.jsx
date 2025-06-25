import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../components/Enumeration';

const TestContainerTypeTab = (props) => {
    const addContainerTypeId = props.controlMap.has("AddTestContainerType") && props.controlMap.get("AddTestContainerType").ncontrolcode;
    const testContinerTypeColumnList = [
        {"idsName":"IDS_CONTAINERTYPE","dataField":"scontainertype","width":"200px"},
        {"idsName":"IDS_QUANTITY","dataField":"nquantity","width":"200px"},

        {"idsName":"IDS_UNIT","dataField":"sunitname","width":"200px"},
        {"idsName":"IDS_SETASDEFAULT","dataField":"stransdisplaystatus","width":"100px", "componentName": "switch", 
        //ALPD-3510
        "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultTestContainerType"}

    ];    
    const methodUrl = "TestContainerType";
    // const editId = props.inputParam && props.controlMap.has("Edit".concat(props.inputParam.methodUrl))
    //                     && props.controlMap.get("Edit".concat(props.inputParam.methodUrl)).ncontrolcode;
    const editParam = {screenName:"IDS_CONTAINERTYPE" , operation:"update", 
    primaryKeyField:"ntestcontainertypecode", inputParam:props.inputParam,  userInfo:props.userInfo
   // ,  ncontrolCode:editId
};


    return (
        <>
            <div className="actions-stripe">
                <div className="d-flex justify-content-end">
                    <Nav.Link name="addcontainertype" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addContainerTypeId) === -1}
                        // onClick={()=>props.getAvailableData(props.selectedTest, "getAvailableContainerType", 
                        //     "containertype", "IDS_CONTAINERTYPE", props.userInfo, addContainerTypeId)}>
                        onClick={() => props.addContainerType("create", props.selectedTest, props.userInfo, addContainerTypeId)}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        <FormattedMessage id="IDS_CONTAINERTYPE" defaultMessage="Container Type" />
                    </Nav.Link>
                </div>
            </div>
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                        key="testcontainertypekey"
                        primaryKeyField="ntestcontainertypecode"
                        data={props.TestContainerType || []}
                        dataResult={props.dataResult}
                        dataState={props.dataState}
                        dataStateChange={props.dataStateChange}
                        extractedColumnList={testContinerTypeColumnList}
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
                        fetchRecord = {props.getActiveTestContainerTypeById}
                        editParam={editParam}
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

export default TestContainerTypeTab;