import React from 'react'
import {Row, Col,} from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class ApprovalMaterialTab extends React.Component{  
    render(){
        const extractedColumnList=[
            {"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno"},
            {"idsName":"IDS_TESTNAME","dataField":"stestsynonym","width":"200px"},
            {"idsName":"IDS_MATERIALCATNAME","dataField":"sinstrumentcatname","width":"140px"},
            {"idsName":"IDS_MATERIALNAME","dataField":"sinstrumentname","width":"140px"},
            {"idsName":"IDS_INVENTORYID","dataField":"sinstrumentid","width":"140px"},
            {"idsName":"IDS_USEDQUANTITY","dataField":"sfromdate","width":"150px"},
            {"idsName":"IDS_TODATE","dataField":"stodate","width":"150px"},
            {"idsName":"IDS_FROMTIME","dataField":"sfromtime","width":"150px"},
            {"idsName":"IDS_TOTIME","dataField":"stotime","width":"150px"},
        ]                          
        return(
            
            <Row noGutters={"true"}>
                <Col md={12}>
                <DataGrid
                    primaryKeyField={"nresultusedinstrumentcode"}
                    data={this.props.masterData.ResultUsedInstrument}
                    dataResult={process(this.props.masterData.ResultUsedInstrument||[],this.props.dataState)}
                    dataState={this.props.dataState}
                    dataStateChange={this.props.dataStateChange}
                    extractedColumnList={extractedColumnList}
                    userInfo={this.props.userInfo}
                    controlMap={new Map()}
                    userRoleControlRights={{}}
                    inputParam={this.props.inputParam}
                    pageable={true}
                    isActionRequired={false}
                    isToolBarRequired={false}
                    scrollable={"scrollable"}
                    gridHeight={"550px"}
                    />
                </Col>
            </Row>
            
        ) 
    }
}
export default injectIntl(ApprovalMaterialTab);