import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import MultiColumnComboSearch from '../../components/multi-column-combo-search/multi-column-combo-search';
import ViewInfoDetails from "../../components/ViewInfoDetails";

const SchedulerMasterCombo = (props) => {
    return (

        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_SCHEDULER" })}
                    isSearchable={true}
                    name={"SchedulerMaster"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={props.schedulerList}
                    optionId="SchedulerMaster"
                    optionValue="sschedulename"
                    value={props.selectedRecord ? props.selectedRecord["SchedulerMaster"] : ""}
                    showOption={true}
                    onChange={(event) => props.onSchedulerComboChange(event, 'SchedulerMaster')}
                   // menuPosition="fixed"
                    >
                </FormSelectSearch>
           </Col>
             {/* 
                <Col md={6}>

            <ViewInfoDetails 
                                userInfo={props.userInfo}
                                selectedObject ={props.scheduleMasterDetails}
                                screenHiddenDetails={false}   
                                screenName={"View"}
                               dataTip={props.formatMessage({ id: "IDS_VIEW" })}
                               // hidden={(this.state.userRoleControlRights.indexOf(viewClosureFileId) === -1) ? true : this.props.Login.masterData.SelectedProjectMaster&& this.props.Login.masterData.SelectedProjectMaster.sfilename&&this.props.Login.masterData.SelectedProjectMaster.sfilename==='-'? true : false}
                               // downLoadIcon={this.props.Login.masterData.SelectedProjectMaster&& this.props.Login.masterData.SelectedProjectMaster.sfilename&&this.props.Login.masterData.SelectedProjectMaster.sfilename!='-'? true : false}
                                rowList={[
                                  [
                                    {dataField:"stempscheduleType", idsName:"IDS_SCHEDULETYPE"},                                    
                                    {dataField:"sstarttime", idsName:"IDS_STARTDATETIME"}                      
                                  ],
                                  [
                                    {dataField:"sendtime", idsName:"IDS_ENDDATETIME"}               
                                  ]

                                ]}

                            />
                                                            </Col>
       <Col md={12}>
                <MultiColumnComboSearch
                    data={props.scheduleMasterDetails}
                    visibility='show-all'
                    alphabeticalSort="true"
                    selectedId={props.selectedRecord["nschedulecode"]}
                    labelledBy="IDS_SCHEDULEEE"
                    // selectedId={props.selectedRecord["smanufname"] || ""}
                    fieldToShow={["stempscheduleType","sstarttime","sendtime"]}
                    idslabelfield={["IDS_SCHEDULETYPE","IDS_STARTDATETIME","IDS_ENDDATETIME"]}
                    showInputkey="sschedulename"
                    value={[props.selectedRecord]}
                    isMandatory={true}
                   // menuPosition="fixed"
                    //getValue={(value) => props.onProductManufChange(value, ["nproductmanufcode","smanufname"])}
                />
            </Col>
             */}
            
        </Row>
    );
}

export default SchedulerMasterCombo;