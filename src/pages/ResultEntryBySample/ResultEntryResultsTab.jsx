import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import ResultGrid from '../resultgrid/ResultGrid';
import { sortData } from '../../components/CommonScript';

class ResultEntryResultsTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            testParameters: this.props.masterData.TestParameters  //sortData(this.props.masterData.TestParameters || [],'ascending','ntransactionresultcode')
        }
    }

    render() {
        //console.log("TestParameters:", this.props.masterData.TestParameters);
        const extractedColumnList = [];
        
            extractedColumnList.push(
            { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "155px" },
            { "idsName": "IDS_FINALRESULT", "dataField": "sfinal", "width": "125px", "fieldType": "attachment" },
            { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "110px", "fieldType": "gradeColumn" },
            { "idsName": "IDS_RESULTACCURACY", "dataField": "sresultaccuracyname", "width": "150px" },
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "155px" },
            { "idsName": "IDS_CHECKLIST", "dataField": "schecklistname", "width": "125px", "fieldType": "checklistview", "checklistKey": "nchecklistversioncode" },
            );
            if (this.props.masterData["realRegSubTypeValue"] && this.props.masterData["realRegSubTypeValue"].nneedsubsample){
                extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
            }
            else{
                extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
            }
        //  {/* Don't delete these below commented object, because this feature is needed for Agaram LIMS */}
        const detailedFieldList = [
            { "idsName": "IDS_PARAMETERTYPE", "dataField": "sparametertypename" },
            { "idsName": "IDS_RESULTS", "dataField": "sresult", "width": "125px", "fieldType": "attachment" },
            { "idsName": "IDS_ENFORCESTATUS", "dataField": "senforcestatus", "width": "150px" },
            { "idsName": "IDS_CHECKLIST", "dataField": "schecklistname", "width": "125px", "fieldType": "checklistview", "checklistKey": "nchecklistversioncode" },
            { "idsName": "IDS_MINA", "dataField": "smina" },
            { "idsName": "IDS_MAXA", "dataField": "smaxa" },
            { "idsName": "IDS_MINB", "dataField": "sminb" },
            { "idsName": "IDS_MAXB", "dataField": "smaxb" },
            { "idsName": "IDS_ENTERBY", "dataField": "senteredby" },
            { "idsName": "IDS_ENTERROLE", "dataField": "suserrolename" },
            { "idsName": "IDS_ENTERDATE", "dataField": "sentereddate" },
            { "idsName": "IDS_SPECDESCRIPTION", "dataField": "sspecdesc" }, 
            { "idsName": "IDS_PARAMETERCOMMENTS", "dataField": "sresultcomment" },
            { "idsName": "IDS_ENFORCERESULTCOMMENTS", "dataField": "senforceresultcomment" }
        
        ]
        const attachmentParam = {
            classUrl: "approval",
            operation: "view",
            methodUrl: "Attachment",
            userinfo: this.props.userInfo

        }
        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <ResultGrid
                            primaryKeyField={"ntransactionresultcode"}
                            data={sortData(this.props.masterData.TestParameters,'descending','ntransactionresultcode') }
                            dataResult={process(this.props.masterData.TestParameters || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            expandField="expanded"
                            detailedFieldList={detailedFieldList}
                            extractedColumnList={extractedColumnList}
                            editParam={this.props.parameterParam}
                            checklistParam={this.props.checklistParam}
                            userInfo={this.props.userInfo}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            fetchRecord={this.props.fetchRecord}
                            editpredefinedcomments={this.props.editpredefinedcomments}
                            enforceResult={this.props.enforceResult}
                            formulaCalculation={this.props.formulaCalculation}
                            checkListRecord={this.props.checkListRecord}
                            pageable={true}
                            viewFile={this.props.viewFile}
                            isComponent={true}
                            isActionRequired={true}
                            isToolBarRequired={false}
                            scrollable={"scrollable"}
                            selectedId={this.props.selectedId}
                            gridHeight={"500px !important"}
                            attachmentParam={attachmentParam}
                            getMeanTestParameter={this.props.getMeanTestParameter}
                            meanParam={this.props.meanParam}
                        />
                    </Col>
                </Row>
            </>
        )
    }
    componentDidUpdate(previousProps){
        if(this.props.masterData.TestParameters!==previousProps.masterData.TestParameters){
            this.setState({
                testParameters:sortData(this.props.masterData.TestParameters,'ascending','ntransactionresultcode')
            })
        }
        if(this.props.masterData.TestParameters&&this.props.masterData.TestParameters!==this.state.testParameters){
            this.setState({
                testParameters:sortData(this.props.masterData.TestParameters,'ascending','ntransactionresultcode')
            })
        }
        
    }
}
export default injectIntl(ResultEntryResultsTab);