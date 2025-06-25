import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
// import { process } from '@progress/kendo-data-query';


const SampleReportHistory = (props) =>{
    const historyColumnList = [
        {  "idsName": "IDS_VERSION", "dataField": "nversioncode", "width": "150px" },
        {  "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "250px" },
        {  "idsName": "IDS_USERNAME", "dataField": "susername", "width": "250px" },
        {   "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },
        {  "idsName": "IDS_REPORTDATE", "dataField": "sgeneratedtime", "width": "250px" },
        { "idsName": "IDS_REPORTCOMMENTS", "dataField": "sreportcomments", "width": "250px" },
    ];

   
    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nsamplereporthistorycode"
                    primaryKeyField = "nsamplereporthistorycode"
                    data = {props.ReportHistory && props.ReportHistory.length > 0?props.ReportHistory:[]}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {historyColumnList}
                    controlMap = {props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    userInfo={props.userInfo}
                    expandField="expanded"
                    handleExpandChange={props.handleExpandChange}
                   // childColumnList={resultColumnList}
                   // hasChild={props.hasChild}
                    pageable={true}
                    scrollable={'scrollable'}
                    gridHeight = {'400px'}
                    //childList ={ props.childList || new Map() }
                    //childMappingField={props.childMappingField}
                    isActionRequired={false}
                    methodUrl=""
                >
                </DataGrid>
            </Col>
        </Row>
    );
};
export default SampleReportHistory;
