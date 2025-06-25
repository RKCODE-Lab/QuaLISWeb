import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';

class ApprovalUsedMaterial extends React.Component {
    render() {
        const extractedColumnList = [];
        if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
        }
        else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
        }
         extractedColumnList.push(
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "250px" },
            { "idsName": "IDS_MATERIALCATNAME", "dataField": "smaterialcatname", "width": "200px" },
            { "idsName": "IDS_MATERIALNAME", "dataField": "smaterialname", "width": "200px" },
            { "idsName": "IDS_INVENTORYID", "dataField": "sinventoryid", "width": "200px" },
            { "idsName": "IDS_QUANTITYUSED", "dataField": "nqtyused", "width": "250px" },
         );
        return (

            <Row noGutters={"true"}>
                <Col md={12}>
                    <DataGrid
                        primaryKeyField={"nresultusedmaterialtcode"}
                        data={this.props.masterData.ResultUsedMaterial||[]}
                        dataResult={process(this.props.masterData.ResultUsedMaterial || [],this.props.dataState)}
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
                        jsonField = {"jsondata"}
                    />
                </Col>
            </Row>

        )
    }
}
export default injectIntl(ApprovalUsedMaterial);