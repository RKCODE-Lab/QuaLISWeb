import React from 'react'
import {Row, Col} from 'react-bootstrap';
import {  injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import ResultGrid from '../resultgrid/ResultGrid';

class ApprovalResultsTab extends React.Component{  
    
    render(){
        
        const extractedColumnList = [];
       
        extractedColumnList.push(
        {"idsName":"IDS_PARAMETERNAME","dataField":"sparametersynonym","width":"175px"},
        {"idsName":"IDS_FINALRESULT","dataField":"sfinal","width":"175px","fieldType":"attachment"},
        {"idsName":"IDS_RESULTFLAG","dataField":"sgradename","width":"120px","fieldType":"gradeColumn"},
        {"idsName":"IDS_TESTNAME","dataField":"stestsynonym","width":"175px"},
        );
        if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno","width":"175px"});
        }else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno","width":"175px"});
        }
    
    const detailedFieldList=[
        {"idsName":"IDS_PARAMETERTYPE","dataField":"sdisplaystatus"},
        {"idsName":"IDS_ENFORCESTATUS","dataField":"senforcestatus","width":"110px"},
        {"idsName":"IDS_CHECKLIST","dataField":"schecklistname","width":"175px","fieldType":"checklistview","checklistKey":"nchecklistversioncode"},
        { "idsName": "IDS_MINA", "dataField": "smina" },
        { "idsName": "IDS_MAXA", "dataField": "smaxa" },
        {"idsName":"IDS_MINB","dataField":"sminb"},
        {"idsName":"IDS_MAXB","dataField":"smaxb"},
        {"idsName":"IDS_ENTERBY","dataField":"enteredby"},
        {"idsName":"IDS_ENTERROLE","dataField":"suserrolename"},
        {"idsName":"IDS_ENTERDATE","dataField":"sentereddate"},
        {"idsName":"IDS_PARAMETERCOMMENTS","dataField":"sresultcomment","isDecsriptionField":true},
        {"idsName":"IDS_ENFORCESTATUSCOMMENT","dataField":"senforcestatuscomment","isDecsriptionField":true,"needHistoryButton":true,"buttonTitle":"IDS_SHOWPREVIOUSCOMMENTS","onClickButton":this.props.getEnforceCommentsHistory},
        // { "idsName": "IDS_RESULTPARAMETERCOMMENTS", "dataField": "spredefinedcomments" }
       , {"idsName":"IDS_ENFORCERESULTCOMMENTS","dataField":"senforceresultcomment", "needHistoryButton":true,"buttonTitle":"IDS_SHOWPREVIOUSCOMMENTS","onClickButton":this.props.getEnforceCommentsHistory},

        // ,{ "idsName": "IDS_ENFORCERESULTCOMMENTS","needHistoryButton":true, "dataField": "senforceresultcomment",
        // "onClickButton":this.props.getEnforceCommentsHistory }
    ]   
    const editParam = {
            screenName:this.props.screenName, 
            operation:"update",  
            primaryKeyField:"ntransactionresultcode", 
            inputParam:this.props.inputParam,   
            userInfo:this.props.userInfo,
            masterData:this.props.masterData,
            ncontrolCode:this.props.controlMap.has("EnforceStatus") && this.props.controlMap.get("EnforceStatus").ncontrolcode
    };     
    const attachmentParam={
        classUrl:"approval",
        operation:"view",
        methodUrl:"Attachment",
        userinfo:this.props.userInfo

    }        
    const checklistParam={ masterData: this.props.masterData, userInfo: this.props.userInfo }
    return(
        <> 
            <Row noGutters={"true"}>
                <Col md={12}>
                    <ResultGrid
                        primaryKeyField={"ntransactionresultcode"}
                        data={this.props.masterData.ApprovalParameter}
                        dataResult={process(this.props.masterData.ApprovalParameter||[],this.props.dataState)}
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
                        isActionRequired={true}
                        isToolBarRequired={false}
                        scrollable={"scrollable"}
                        methodUrl={"Status"}
                        fetchRecord={this.props.getStatusCombo}
                        editParam={editParam}
                        selectedId={null}
                        viewFile={this.props.viewFile}
                        checkListRecord={this.props.checkListRecord}
                        attachmentParam={attachmentParam}
                        checklistParam={checklistParam}
                        masterData={this.props.masterData}
                        //gridHeight={"450px"}
                    />
                </Col>
            </Row>
        </>
    ) 
    }
}
export default injectIntl(ApprovalResultsTab);