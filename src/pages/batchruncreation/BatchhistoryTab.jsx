import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';


const BatchhistoryTab = (props) =>{
    const batchHistoryColumnList = [];
    // if (props.nneedsubsample){
    //     batchHistoryColumnList.push({"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
    // }
    // else{
    //     batchHistoryColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
    // }
    
    
       batchHistoryColumnList .push(   
        {"idsName":"IDS_BATCHSTATUS","dataField":"stransdisplaystatus","width":"155px"},
        {"idsName":"IDS_TESTNAME","dataField":"stestname","width":"250px"},
        {"idsName":"IDS_USERNAME","dataField":"username","width":"250px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"250px"},
        {"idsName":"IDS_TRANSDATE","dataField":"stransactiondate","width":"250px"},
        {"idsName":"IDS_REMARKS","dataField":"scomments","width":"250px"},
        
     );
    
    
    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="nbatchhistorycode"
                    primaryKeyField = "nbatchhistorycode"
                    data = {props.batchhistory && props.batchhistory.length > 0 ? props.batchhistory :[]}
                   // dataResult = {process(props.printHistory || [], { skip: 0, take: 10 })}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {batchHistoryColumnList}
                    userInfo={props.userInfo}
                    pageable={true}
                    scrollable={'scrollable'}
                    gridHeight = {'375px'}
                    // width={'600px'}
                    isActionRequired={false}
                    methodUrl={props.methodUrl}
                   
                >
                </DataGrid>
            </Col>
        </Row>
    
    );
};
export default BatchhistoryTab;


