import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';



const PrintHistory = (props) =>{
    const printColumnList = [
        {"idsName":"IDS_PRINTCOUNT","dataField":"ncount","width":"150px"},
        {"idsName":"IDS_PRINTDATE","dataField":"sprintdate","width":"200px"},
        {"idsName":"IDS_USERNAME","dataField":"sloginid","width":"250px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"150px"},       
        {"idsName":"IDS_COMMENTS","dataField":"scomments","width":"250px"}
    ];
    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nsampleapprovalmailcodekey"
                    primaryKeyField = "nsampleapprovalmailcode"
                    data = {props.printHistory && props.printHistory.length > 0 ? props.printHistory :[]}
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
export default PrintHistory;
