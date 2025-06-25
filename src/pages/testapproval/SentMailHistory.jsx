import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';



const SentMailHistory = (props) =>{
    const printColumnList = [
        {"idsName":"IDS_EMAILID","dataField":"semail","width":"250px"},
        {"idsName":"IDS_TRANSACTIONDATE","dataField":"stransdate","width":"250px"},
        {"idsName":"IDS_EMAILSTATUS","dataField":"smailstatus","width":"250px"},
 
    ];
    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nemailhistorycode"
                    primaryKeyField = "nemailhistorycode"
                    data = {props.emailSentHistory && props.emailSentHistory.length > 0 ? props.emailSentHistory :[]}
                   // dataResult = {process(props.printHistory || [], { skip: 0, take: 10 })}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {printColumnList}
                    controlMap = {props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    userInfo={props.userInfo}
                    //expandField="expanded"
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
export default SentMailHistory;
