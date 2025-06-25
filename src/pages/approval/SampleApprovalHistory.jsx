import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {  injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class SampleApprovalHistory extends React.Component{  
    
 
    render(){
        const extractedColumnList = [];
        if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
        }
        else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
        }
        extractedColumnList.push(
        //{"idsName":"IDS_ARNUMBER","dataField":"sarno","width":"200px"},
        {"idsName":"IDS_STATUS","dataField":"stransdisplaystatus","width":"200px"},
        {"idsName":"IDS_USERNAME","dataField":"username","width":"200px"},
        {"idsName":"IDS_USERROLE","dataField":"suserrolename","width":"200px"},
        {"idsName":"IDS_TRANSDATE","dataField":"stransactiondate","width":"450px"}
    );
                    
    return(
        <>
            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"napprovalhistorycode"}
                        data={this.props.ApprovalHistory}
                        dataResult={process(this.props.ApprovalHistory||[],this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                        extractedColumnList={extractedColumnList}
                        userInfo={this.props.userInfo}
                        controlMap={this.props.controlMap}
                        userRoleControlRights={this.props.userRoleControlRights}
                        inputParam={this.props.inputParam}
                        pageable={true}
                        expandField="expanded"
                        hideDetailBand={true}
                        isActionRequired={false}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        groupable={true}
                        gridHeight={"550px"}
                    />
                </Col>
            </Row>
        </>
    ) 
    }
}
export default injectIntl(SampleApprovalHistory);