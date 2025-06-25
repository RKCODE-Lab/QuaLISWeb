import React from 'react'
import { Row, Col, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ParticipantsAccordion from './ParticipantsAccordion';
import CustomAccordion from '../../../components/custom-accordion/custom-accordion.component';
import {
    getParticipantsAccordion,addtraineedocfile
} from '../../../actions';
import { faCertificate, faCogs, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

const TrainingParticipantsTab = (props) => {
    const attendanceId = props.controlMap.has("Attendance") && props.controlMap.get("Attendance").ncontrolcode;
    const certifiedId = props.controlMap.has("Certified") && props.controlMap.get("Certified").ncontrolcode;
    const competentId = props.controlMap.has("Competent") && props.controlMap.get("Competent").ncontrolcode;
    
    return (
       <>
<div className="d-flex justify-content-end">      
          <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={props.intl.formatMessage({ id: "IDS_ATTENDANCE" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(attendanceId) === -1}
                            onClick={() => props.getTrainingParticipantsAttended(props.Login.masterData.SelectedTrainingUpdate,props.selectedRecord,props.Login.userInfo,"attended",attendanceId)}
                        >
                        <FontAwesomeIcon icon={faUser} />
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={props.intl.formatMessage({ id: "IDS_CERTIFIED" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(certifiedId) === -1}
                            onClick={() => props.getTrainingParticipantsCertified(props.Login.masterData.SelectedTrainingUpdate,props.selectedRecord,props.Login.userInfo,"certify",certifiedId)}
                        >
                                <FontAwesomeIcon icon={faCertificate} />
                           
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={props.intl.formatMessage({ id: "IDS_COMPETENT" })}
                            //data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(competentId) === -1}
                            onClick={() => props.getTrainingParticipantsCompetent(props.Login.masterData.SelectedTrainingUpdate,props.selectedRecord,props.Login.userInfo,"competent",competentId)}
                        >
                            <FontAwesomeIcon icon={faCogs} />
                        </Nav.Link>
            </div>
           
                {props.Login.masterData.Participants && props.Login.masterData.Participants.length > 0 ?
                    <CustomAccordion
                        key="Participants"
                        accordionTitle={"sfullname"}
                        accordionComponent={participantsAccordion(props)}
                        inputParam={{ masterData: props.Login.masterData, userInfo: props.Login.userInfo }}
                        accordionClick={props.getParticipantsAccordion}
                        accordionPrimaryKey={"nparticipantcode"}
                        accordionObjectName={"version"}
                        //addtraineedocfile={props.addtraineedocfile}
                        selectedKey={props.Login.masterData.selectedParticipants.nparticipantcode}
                    />
                    : ""}
    </>
    );

}


const participantsAccordion = (props) => {
    const accordionMap = new Map();
    props.Login.masterData.Participants.map((version) =>
        accordionMap.set(version.nparticipantcode,
            <ParticipantsAccordion
                version={version}
                addtraineedoc={props.addtraineedoc}
                addtraineedocfile={props.addtraineedocfile}
                userRoleControlRights={props.userRoleControlRights}
                controlMap={props.controlMap}
                userInfo={props.Login.userInfo}
                masterData={props.Login.masterData}
                inputParam={props.Login.inputParam}
                deleteRecord={props.deleteRecord}
                fetchParticipantsRecordByID={props.fetchParticipantsRecordByID}
                selectedId={props.Login.selectedId}
                viewVersionTemplate={props.viewVersionTemplate}
                viewTraineeDocumentFile={props.viewTraineeDocumentFile}
                
            />)
    )
    return accordionMap;
}

export default connect(mapStateToProps, {getParticipantsAccordion,addtraineedocfile})(injectIntl(TrainingParticipantsTab));