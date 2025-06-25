import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav } from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


class ResultEntryTaskTab extends React.Component {

    render() {
        const addResultUsedTaskId = this.props.controlMap.has("AddResultUsedTask") && this.props.controlMap.get("AddResultUsedTask").ncontrolcode
        const extractedColumnList = [];
        // if (this.props.masterData["RegSubTypeValue"] && this.props.masterData["RegSubTypeValue"].nneedsubsample){
            if (this.props.masterData["realRegSubTypeValue"] && this.props.masterData["realRegSubTypeValue"].nneedsubsample){
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["SubARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
        }
        else{
            extractedColumnList.push({"idsName":this.props.genericLabel ? this.props.genericLabel["ARNo"]["jsondata"]["sdisplayname"][this.props.userInfo.slanguagetypecode]:"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
        }
            extractedColumnList.push(
            //{ "idsName": "IDS_ARNO", "dataField": "sarno", "width": "155px" },
            //{ "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "155px" },
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "150px" },
            { "idsName": "IDS_PREANALYSISTIME", "dataField": "spreanalysistime", "width": "170px" },
            { "idsName": "IDS_PREPARATIONTIME", "dataField": "spreparationtime", "width": "170px" },
            { "idsName": "IDS_ANALYSISTIME", "dataField": "sanalysistime", "width": "150px" },
            { "idsName": "IDS_MISCTIME", "dataField": "smisctime", "width": "180px" },
            { "idsName": "IDS_USERNAME", "dataField": "sanalyst", "width": "150px" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px" }
            );

            const detailedFieldList = [
                { "idsName": "IDS_TASKPROCEDURE", "dataField": "staskprocedure" },
             
            ]

        return (
            <>
                <Row>
                    <Col md={12}>
                        <div className="actions-stripe border-bottom">
                            <div className="d-flex justify-content-end">
                                <Nav.Link name="resultusedtask" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addResultUsedTaskId) === -1}
                                    onClick={() => this.props.addResultEntryTask({
                                        userInfo: this.props.userInfo,
                                        ntransactiontestcode: this.props.masterData.RESelectedTest.map(test => test.ntransactiontestcode).join(","),
                                        stestsynonym: this.props.masterData.RESelectedTest.map(test => test.stestsynonym).join(","),
                                        addResultUsedTaskId: addResultUsedTaskId, screenName: this.props.screenName
                                    })}>
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id="IDS_ADDTASK" defaultMessage="Task" />
                                </Nav.Link>
                            </div>
                        </div>
                        <DataGrid
                            primaryKeyField={"nresultusedtaskcode"}
                            data={this.props.masterData.ResultUsedTasks}
                            dataResult={process(this.props.masterData.ResultUsedTasks || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            extractedColumnList={extractedColumnList}
                            detailedFieldList={detailedFieldList}
                            userInfo={this.props.userInfo}
                            controlMap={this.props.controlMap}
                            methodUrl={this.props.methodUrl}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            hideDetailBand={false}
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
            </>
        )
    }
}
export default injectIntl(ResultEntryTaskTab);