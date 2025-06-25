import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';

class ApprovalInstrumentTab extends React.Component {
    render() {
        const extractedColumnList = [];
        if ((this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample)||(this.props.masterData["realRegSubTypeValue"] && this.props.masterData["realRegSubTypeValue"].nneedsubsample)){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
        }
        else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
        }
        extractedColumnList.push(
           // {"idsName":"IDS_ARNUMBER","dataField":"sarno","width":"100px"},
            //{"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno","width":"150px"},
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "250px" },
            { "idsName": "IDS_INSTRUMENTCATNAME", "dataField": "sinstrumentcatname", "width": "200px" },
            { "idsName": "IDS_INSTRUMENTNAME", "dataField": "sinstrumentname", "width": "200px" },
            { "idsName": "IDS_INSTRUMENTID", "dataField": "sinstrumentid", "width": "200px" },
            { "idsName": "IDS_FROMDATE", "dataField": "sfromdate", "width": "250px" },
            { "idsName": "IDS_TODATE", "dataField": "stodate", "width": "250px" },
        );
        return (

            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"nresultusedinstrumentcode"}
                        data={this.props.masterData.ResultUsedInstrument}
                        dataResult={process(this.props.masterData.ResultUsedInstrument || [], this.props.dataState)}
                        dataState={this.props.dataState}
                        dataStateChange={this.props.dataStateChange}
                        extractedColumnList={extractedColumnList}
                        methodUrl={this.props.methodUrl}
                        userInfo={this.props.userInfo}
                        controlMap={this.props.controlMap}
                        userRoleControlRights={this.props.userRoleControlRights}
                        inputParam={this.props.inputParam}
                        pageable={true}
                        hideDetailBand={true}
                        expandField="expanded"
                        isActionRequired={this.props.isActionRequired}
                        deleteParam={this.props.deleteParam || ""}
                        fetchRecord={this.props.fetchRecord || ""}
                        editParam={this.props.editParam || ""}
                        deleteRecord={this.props.deleteRecord || ""}
                        selectedId={this.props.selectedId}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        gridHeight={"550px"}
                    />
                </Col>
            </Row>

        )
    }
}
export default injectIntl(ApprovalInstrumentTab);