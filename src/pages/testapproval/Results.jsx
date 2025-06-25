import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
// import { process } from '@progress/kendo-data-query';


const Results = (props) =>{
    const historyColumnList = [
        {"idsName":"IDS_TESTNAME","dataField":"stestsynonym","width":"150px"},
        {"idsName":"IDS_SECTIONNAME","dataField":"ssectionname","width":"200px"},
        {"idsName":"IDS_STATUS","dataField":"stransdisplaystatus","width":"150px"},
        {"idsName":"IDS_RESTESTNO","dataField":"ntestretestno","width":"150px"},
        {"idsName":"IDS_REPEATNO","dataField":"ntestrepeatno","width":"150px"},
        {"idsName":"IDS_SOURCENAME","dataField":"ssourcename","width":"200px"},
        {"idsName":"IDS_METHODNAME","dataField":"smethodname","width":"150px"},
    ];

    const resultColumnList =[
        { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "150px" },
        { "idsName": "IDS_PARAMETERTYPENAME", "dataField": "sparametertypename", "width": "150px" },
        { "idsName": "IDS_RESULT", "dataField": "sresult", "width": "150px" },
        { "idsName": "IDS_FINAL", "dataField": "sfinal", "width": "150px" },
        { "idsName": "IDS_UNITNAME", "dataField": "sunitname", "width": "150px" },
        { "idsName": "IDS_PASSFLAG", "dataField": "sgradename", "width": "150px" },
        { "idsName": "IDS_ENFORCESTATUS", "dataField": "senforcestatus", "width": "150px" },
        { "idsName": "IDS_CHECKLIST", "dataField": "schecklistname", "width": "150px" },
        { "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "150px" },
        { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "150px" },
    ];

    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="ntestgrouptestcodekey"
                    primaryKeyField = "ntestgrouptestcode"
                    data = {props.TransactionSampleTests && props.TransactionSampleTests.length > 0?props.TransactionSampleTests:[]}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {historyColumnList}
                    controlMap = {props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    userInfo={props.userInfo}
                    expandField="expanded"
                    handleExpandChange={props.handleExpandChange}
                    childColumnList={resultColumnList}
                    hasChild={props.hasChild}
                    pageable={true}
                    scrollable={'scrollable'}
                    gridHeight = {'400px'}
                    childList ={ props.childList || new Map() }
                    childMappingField={props.childMappingField}
                    isActionRequired={false}
                    methodUrl=""
                >
                </DataGrid>
            </Col>
        </Row>
    );
};
export default Results;
