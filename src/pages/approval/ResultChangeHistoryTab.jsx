import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class ResultChangeHistoryTab extends React.Component {


    //const deputyAddParam = {screenName:"Deputy", operation:"create", primaryKeyField:"nusermultideputycode", 
    // primaryKeyValue:undefined, masterData:props.masterData, userInfo:props.userInfo,
    // ncontrolCode:addUserMultiDeputyId};
    render() {
        const extractedColumnList = [];
        if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
        }
        else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
        }
        extractedColumnList.push(
            // {"idsName":"IDS_ARNUMBER","dataField":"sarno","width":"200px"},
            // {"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno","width":"200px"},
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "155px" },
            { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "155px" },
            { "idsName": "IDS_FORMNAME", "dataField": "sformname", "width": "155px"},          
            { "idsName": "IDS_RESULTS", "dataField": "sresult", "width": "125px" },
            { "idsName": "IDS_FINALRESULT", "dataField": "sfinal", "width": "125px" },
            { "idsName": "IDS_RESULTACCURACY", "dataField": "sresultaccuracyname", "width": "150px" },
            { "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "155px" },
            { "idsName": "IDS_ENTERBY", "dataField": "username", "width": "155px" },
            { "idsName": "IDS_ENTERROLE", "dataField": "suserrolename", "width": "155px" },
            { "idsName": "IDS_ENTERDATE", "dataField": "sentereddate", "width": "250px" }
        );
        
        // {/* Don't delete these below commented object, because this feature is needed for Agaram LIMS */}
        const detailedFieldList = [
            // { "idsName": "IDS_MINA", "dataField": "nmina" },
            // { "idsName": "IDS_MAXA", "dataField": "nmaxa" },
            { "idsName": "IDS_MINB", "dataField": "sminb" , "columnSize":"3"},
            { "idsName": "IDS_MAXB", "dataField": "smaxb" , "columnSize":"3"},
            // { "idsName": "IDS_MINLOD", "dataField": "nminlod" },
            // { "idsName": "IDS_MAXLOD", "dataField": "nmaxlod" },
            // { "idsName": "IDS_MINLOQ", "dataField": "nminloq" },
            // { "idsName": "IDS_MAXLOQ", "dataField": "nmaxloq" },
        ]
        return (
            <>
                <Row noGutters={"true"}>
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={"ntransactionresultcode"}
                            data={this.props.ApprovalResultChangeHistory || []}
                            dataResult={process(this.props.ApprovalResultChangeHistory || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            expandField="expanded"
                            detailedFieldList={detailedFieldList}
                            extractedColumnList={extractedColumnList}
                            userInfo={this.props.userInfo}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            isActionRequired={false}
                            isToolBarRequired={false}
                            scrollable={"scrollable"}
                            methodUrl={"Status"}
                            gridHeight={"550px"}
                            hasDynamicColSize={true}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}
export default injectIntl(ResultChangeHistoryTab);