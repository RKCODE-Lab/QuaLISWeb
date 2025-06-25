import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';


class ProjectMasterFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddProjectMasterFile") && this.props.controlMap.get("AddProjectMasterFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditProjectMasterFile") && this.props.controlMap.get("EditProjectMasterFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteProjectMasterFile") && this.props.controlMap.get("DeleteProjectMasterFile").ncontrolcode;

        const viewFileId = this.props.controlMap.has("ViewProjectMasterFile") && this.props.controlMap.get("ViewProjectMasterFile").ncontrolcode;
        const editParam = {
            screenName: "IDS_FILE", inputParam: this.props.inputParam,
            userInfo: this.props.userInfo, ncontrolCode: editFileId, modalName: "openChildModal", ntransactionstatus: this.props.ntransactionstatus
        };
 /*       const subFields = [

            { [designProperties.LABEL]: "IDS_DEFAULTSTATUS", [designProperties.VALUE]: "stransdisplaystatus" }

        ]; */
        const moreField = [
            { [designProperties.LABEL]: "IDS_LINK", [designProperties.VALUE]: "slinkname" },
            { [designProperties.LABEL]: "IDS_CREATEDDATE", [designProperties.VALUE]: "screateddate" },
            { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" },
            //{[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name="addprojectmasterfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.addProjectMasterFile({ userInfo: this.props.userInfo, operation: "create", ncontrolCode: addFileId, screenName: "IDS_FILE", modalName: "openChildModal", ntransactionstatus: this.props.ntransactionstatus })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_FILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.projectmasterfile}
                    fileName="sfilename"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "ProjectMasterFile" }}
                    editParam={editParam}
                    fetchRecord={this.props.addProjectMasterFile}
                    deleteId={deleteFileId}
                    editId={editFileId}

                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewProjectMasterFile}
               //   subFields={subFields}
                    moreField={moreField}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                />
            </>
        );
    }
}

export default injectIntl(ProjectMasterFileTab);