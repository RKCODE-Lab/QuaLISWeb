import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';


const ProtocolHistoryTab = (props) =>{
    const protocolHistoryColumnList = [];
   
    
    protocolHistoryColumnList .push(   
        {"idsName":"IDS_USERNAME","dataField":"susername","width":"150px"},
        {"idsName":"IDS_USERROLENAME","dataField":"suserrolename","width":"150px"},
        {"idsName":"IDS_PROTOCOLSTATUS","dataField":"stransdisplaystatus","width":"150px"},      
        {"idsName":"IDS_TRANSDATE","dataField":"smodifieddate","width":"500px"},        
     );
    
    
    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nprotocolhistorycode"
                    primaryKeyField = "nprotocolhistorycode"
                    data = {props.protocolHistory && props.protocolHistory.length > 0 ? props.protocolHistory :[]}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {protocolHistoryColumnList}
                    userInfo={props.userInfo}
                    pageable={true}
                    scrollable={'scrollable'}
                    gridHeight = {'375px'}
                    // width={'600px'}
                    isActionRequired={false}
                    methodUrl={props.methodUrl}
                    selectedId = {props.selectedId}

                   
                >
                </DataGrid>
            </Col>
        </Row>
    
    );
};
export default ProtocolHistoryTab;


