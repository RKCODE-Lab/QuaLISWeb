import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import ResultGrid from '../resultgrid/ResultGrid';

class RegistrationResultsTab extends React.Component {

    render() {
        // console.log("results props:", this.props.masterData);
        // const  extractedColumnList= [
        //      {"idsName":"IDS_ARNUMBER","dataField":"sarno"},
        //     //{"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"},
        //     { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "175px" },
        //     { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "175px" },
        //     { "idsNextractedColumnListame": "IDS_FINALRESULT", "dataField": "sfinal", "width": "175px", "fieldType": "attachment" },
        //     //{"idsName":"IDS_CHECKLIST","dataField":"schecklistname","width":"175px","fieldType":"checklistview","checklistKey":"nchecklistversioncode"},
        //     { "idsName": "IDS_PASSFLAG", "dataField": "sgradename", "width": "120px", "fieldType": "gradeColumn" },
        //     { "idsName": "IDS_ENFORCESTATUS", "dataField": "senforcestatus", "width": "110px" },
        //     //{"idsName":"IDS_UNIT","dataField":"sunitname","width":"200px"},
        //     //{"idsName":"IDS_PARAMETERTYPE","dataField":"sdisplaystatus","width":"125px"},

        // ]
        const extractedColumnList = [];        

        extractedColumnList.push(
            { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "175px" },
            { "idsName": "IDS_FINALRESULT", "dataField": "sfinal", "width": "175px", "fieldType": "attachment" },
            { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "120px", "fieldType": "gradeColumn" },
            { "idsName": "IDS_RESULTACCURACY", "dataField": "sresultaccuracyname", "width": "175px", "fieldType": "attachment" },
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "175px" });
        if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample) {
            extractedColumnList.push({ "idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]: "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" });
        }
        extractedColumnList.push({ "idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]: "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
        // else {
        //     extractedColumnList.push({ "idsName": "IDS_ARNUMBER", "dataField": "sarno", "width": "155px" });
        // }
        const detailedFieldList = [
            { "idsName": "IDS_PARAMETERTYPE", "dataField": "sdisplaystatus" },
            { "idsName": "IDS_ENFORCESTATUS", "dataField": "senforcestatus", "width": "110px" },
            { "idsName": "IDS_MINB", "dataField": "sminb", "istypeValidation": true },
            { "idsName": "IDS_MAXB", "dataField": "smaxb", "istypeValidation": true },
            { "idsName": "IDS_ENTERBY", "dataField": "senteredby" },
            { "idsName": "IDS_ENTERROLE", "dataField": "suserrolename" },
            { "idsName": "IDS_ENTERDATE", "dataField": "sentereddate" },
            { "idsName": "IDS_PARAMETERCOMMENTS", "dataField": "sresultcomment", "isDecsriptionField": true },
            { "idsName": "IDS_ENFORCESTATUSCOMMENT", "dataField": "senforcestatuscomment", "isDecsriptionField": true }
            ,{ "idsName": "IDS_ENFORCERESULTCOMMENTS", "dataField": "senforceresultcomment" }

        ]
        // const editParam = {
        //     screenName: this.props.screenName,
        //     operation: "update",
        //     primaryKeyField: "ntransactionresultcode",
        //     inputParam: this.props.inputParam,
        //     userInfo: this.props.userInfo,
        //     masterData: this.props.masterData,
        //     ncontrolCode: this.props.controlMap.has("EditStatus") && this.props.controlMap.get("EditStatus").ncontrolcode
        // };
        // const attachmentParam = {
        //     classUrl: "approval",
        //     operation: "view",
        //     methodUrl: "Attachment",
        //     userinfo: this.props.userInfo

        // }
        // const checklistParam = { masterData: this.props.masterData, userInfo: this.props.userInfo }
        return (
            <>
                <Row noGutters={"true"}>
                    <Col md={12}>
                        <ResultGrid
                            primaryKeyField={"ntransactionresultcode"}
                            data={this.props.masterData.RegistrationParameter}
                            dataResult={process(this.props.masterData.RegistrationParameter || [], this.props.dataState)}
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
                            isComponent={true}
                            isActionRequired={false}
                            isToolBarRequired={false}
                            scrollable={"scrollable"}
                            methodUrl={"Status"}
                            //fetchRecord={this.props.getStatusCombo}
                            //editParam={editParam}
                            selectedId={null}
                        // viewFile={this.props.viewFile}
                        // checkListRecord={this.props.checkListRecord}
                        //attachmentParam={attachmentParam}
                        // checklistParam={checklistParam}
                        //gridHeight={"450px"}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}
export default injectIntl(RegistrationResultsTab);