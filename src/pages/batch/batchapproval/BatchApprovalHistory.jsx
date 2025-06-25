import { process } from '@progress/kendo-data-query';
import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../../components/data-grid/data-grid.component';

class BatchApprovalHistory extends React.Component {


    render() {

        let extractedColumnList=[];
        if(this.props.needActionType){
            extractedColumnList = [
                { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "150px" },
                { "idsName": "IDS_ACTIONTYPE", "dataField": "sactionstatus", "width": "150px" },
                { "idsName": "IDS_TRANSDATE", "dataField": "sapproveddate", "width": "250px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "250px" },
                { "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" }               
            ];
        }
        else{
            extractedColumnList = [
                { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "150px" },
                { "idsName": "IDS_TRANSDATE", "dataField": "sapproveddate", "width": "250px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "250px" },
                { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "250px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "250px" },              
            ];
        }

        return (
            <>
                <Row noGutters={"true"}>
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={this.props.primaryKeyField}
                            data={this.props.ApprovalHistory}
                            dataResult={process(this.props.ApprovalHistory,this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            extractedColumnList={extractedColumnList}
                            userInfo={this.props.userInfo}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            isActionRequired={false}
                            isToolBarRequired={false}
                            scrollable={"scrollable"}
                            groupable={false}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}
export default injectIntl(BatchApprovalHistory);