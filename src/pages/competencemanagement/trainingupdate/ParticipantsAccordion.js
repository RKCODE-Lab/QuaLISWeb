import React from 'react'
import { injectIntl, FormattedMessage } from "react-intl";
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { ReadOnlyText } from '../../../components/App.styles';
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListAttachment from '../../../components/ListAttachment';
import { designProperties } from '../../../components/Enumeration';


const ParticipantsAccordion = (props) => {
    const adddocId = props.controlMap.has("AddTraineeDocFile") && props.controlMap.get("AddTraineeDocFile").ncontrolcode
         
    const editFileId = props.controlMap.has("EditTraineeDocFile") && props.controlMap.get("EditTraineeDocFile").ncontrolcode;

    const viewFileId = props.controlMap.has("ViewTraineeDocFile") && props.controlMap.get("ViewTraineeDocFile").ncontrolcode;
   
    const attendanceId = props.controlMap.has("Attendance") && props.controlMap.get("Attendance").ncontrolcode;
    const certifiedId = props.controlMap.has("Certified") && props.controlMap.get("Certified").ncontrolcode;
    const competentId = props.controlMap.has("Competent") && props.controlMap.get("Competent").ncontrolcode;
    const deleteFileId = props.controlMap.has("DeleteTraineeDocFile") && props.controlMap.get("DeleteTraineeDocFile").ncontrolcode;


    const editParam = {
        screenName: "IDS_TRAINEEDOCUMENTS", operation: "update", inputParam: props.inputParam,
        userInfo: props.userInfo, ncontrolCode: editFileId, modalName: "openChildModal"
    };

    const subFields=[
        {[designProperties.LABEL]: "IDS_FILESIZE",[designProperties.VALUE]:"sfilesize","fieldType":"size"},];
    const moreField=[
            {[designProperties.LABEL]: "IDS_LINK",[designProperties.VALUE]:"slinkname"}, 
            {[designProperties.LABEL]: "IDS_CREATEDDATE",[designProperties.VALUE]:"screateddate"}, 
            {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"}
            // {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"},
            //{[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];
    return (
        <>
            {/* <Row>
                <Col md={12} className="d-flex justify-content-end " >
                 
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={props.intl.formatMessage({ id: "IDS_ATTENDANCE" })}
                            data-for="tooltip_list_wrap"
                            hidden={props.userRoleControlRights.indexOf(attendanceId) === -1}
                            onClick={() => props.fetchParticipantsRecordByID('attend',props.version,attendanceId)}
                        >
                        <FontAwesomeIcon icon={faUser} />
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                            data-tip={props.intl.formatMessage({ id: "IDS_CERTIFIED" })}
                             data-for="tooltip_list_wrap"
                             hidden={props.userRoleControlRights.indexOf(certifiedId) === -1}
                            onClick={() => props.fetchParticipantsRecordByID('certify',props.version,certifiedId)}
                        >
                                <FontAwesomeIcon icon={faCertificate} />
                           
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                         data-tip={props.intl.formatMessage({ id: "IDS_COMPETENT" })}
                          data-for="tooltip_list_wrap"
                          hidden={props.userRoleControlRights.indexOf(competentId) === -1}
                          onClick={() => props.fetchParticipantsRecordByID('competent',props.version,competentId)}
                        >
                            <FontAwesomeIcon icon={faCogs} />
                        </Nav.Link>
                       
                </Col>
            </Row> */}
            <Row>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_PARTICIPANTSSTATUS"} message="Checklist Version No:" /></FormLabel>
                        <ReadOnlyText>{props.version.sattendancestatus}</ReadOnlyText>
                    </FormGroup>
                </Col>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_CERTIFIED"} message="Status" /></FormLabel>
                        <ReadOnlyText>{props.version.stransdisplaystatuscertified}</ReadOnlyText>
                    </FormGroup>
                </Col>
                <Col md="6">
                    <FormGroup>
                        <FormLabel><FormattedMessage id={"IDS_COMPETENT"} message="Status" /></FormLabel>
                        <ReadOnlyText>{props.version.stransdisplaystatuscompotent}</ReadOnlyText>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                
                <Col md={12}>
                
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                         <Nav.Link 
                         name="addtraineedoc" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(adddocId) === -1}
                         onClick={()=>props.addtraineedoc({ncontrolCode: adddocId})}
                            >
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />

                        </Nav.Link> 
                    </div>
                </div>
                <ListAttachment
                    attachmentList={props.masterData.TraineeDocuments}
                    fileName="sfilename"
                    deleteRecord={props.deleteRecord}
                    deleteParam ={{operation:"delete", methodUrl: "TrainieeDoc",screenName: "TrainieeDocuments"}}
                    deleteId={deleteFileId}
                    userRoleControlRights={props.userRoleControlRights || []}
                    subFields={subFields || []}
                    settings = {props.settings}
                    userInfo={props.userInfo}
                    moreField={moreField}
                    fetchRecord={props.addtraineedocfile}
                    editId={editFileId}
                    editParam={editParam}
                    viewId={viewFileId}
                    viewFile={props.viewTraineeDocumentFile}
                  
                />
                </Col>
            </Row>
        </>
    )

    
}


export default injectIntl(ParticipantsAccordion);