import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';



const ApprovalHistory = (props) =>{
    const historyColumnList = [
        {"idsName":"IDS_APPROVALSTATUS","dataField":"stransdisplaystatus","width":"150px"},
        {"idsName":"IDS_USERNAME","dataField":"sloginid","width":"200px"},
        {"idsName":"IDS_APPROVALDATE","dataField":"sapproveddate","width":"250px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"150px"},
        {"idsName":"IDS_COMMENTS","dataField":"scomments","width":"200px"}
    ];
    return (
        
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="approvalHistorykey"
                    primaryKeyField = "napprovalhistorycode"
                    data = {props.approvalHistory}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {historyColumnList}
                    controlMap = {props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    userInfo={props.userInfo}
                    expandField="expanded"
                    hideDetailBand={true}
                    pageable={true}
                    scrollable={'scrollable'}
                    gridHeight = {'400px'}
                    // width={'600px'}
                    isActionRequired={false}
                    methodUrl=""
                >
                </DataGrid>
            </Col>
        </Row>
    
    );
};
export default ApprovalHistory;
