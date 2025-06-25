import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class ApprovalTask extends React.Component {

    render() {
        const extractedColumnList = [];
        if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
        }
        else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
        }
         extractedColumnList.push (
            //{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "1%" },
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_PREANALYSISTIME", "dataField": "spreanalysistime", "width": "200px" },
            { "idsName": "IDS_PREPARATIONTIME", "dataField": "spreparationtime", "width": "200px" },
            { "idsName": "IDS_ANALYSISTIME", "dataField": "sanalysistime", "width": "200px" },
            { "idsName": "IDS_MISCELLANEOUSTIME", "dataField": "smisctime", "width": "200px" },
            { "idsName": "IDS_USER", "dataField": "sanalyst", "width": "200px" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px" }
         );

        return (
            <>
                <Row noGutters={"true"}>
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={"nresultusedtaskcode"}
                            data={this.props.ResultUsedTasks}
                            dataResult={process(this.props.ResultUsedTasks || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            extractedColumnList={extractedColumnList}
                            userInfo={this.props.userInfo}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            isActionRequired={false}
                            selectedId={this.props.selectedId}
                            isToolBarRequired={false}
                            scrollable={"scrollable"}
                            gridHeight={"550px"}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}
export default injectIntl(ApprovalTask);