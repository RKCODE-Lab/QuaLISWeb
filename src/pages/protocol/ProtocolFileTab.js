import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { designProperties } from '../../components/Enumeration';


class ProtocolFileTab extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddProtocolFile") && this.props.controlMap.get("AddProtocolFile").ncontrolcode;
        const editFileId = this.props.controlMap.has("EditProtocolFile") && this.props.controlMap.get("EditProtocolFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteProtocolFile") && this.props.controlMap.get("DeleteProtocolFile").ncontrolcode;
        
        const viewFileId = this.props.controlMap.has("ViewProtocolFile") && this.props.controlMap.get("ViewProtocolFile").ncontrolcode;
        const editParam = { screenName: "IDS_PROTOCOLFILE" , operation: "update", inputParam: this.props.inputParam,
            userInfo: this.props.userInfo, genericLabel:this.props.genericLabel, ncontrolCode: editFileId, modalName: "openChildModal"
        };
        
        // const subFields = [
        //     { [designProperties.LABEL]: "IDS_DEFAULTSTATUS", [designProperties.VALUE]: "stransdisplaystatus" }
        // ];
        const moreField = [
            { [designProperties.LABEL]: "IDS_LINK", [designProperties.VALUE]: "slinkname" },
            { [designProperties.LABEL]: "IDS_CREATEDDATE", [designProperties.VALUE]: "screateddate" },
            { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" },
        ];
        return (
            <>
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link name="addprotocolfile" className="add-txt-btn" 
                            //hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                            onClick={() => this.props.addProtocolFile({ userInfo: this.props.userInfo,genericLabel:this.props.genericLabel,  
                            operation: "create", ncontrolCode: addFileId, screenName:"IDS_PROTOCOLFILE",modalName: "openChildModal",masterData:this.props.masterData })}>
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.protocolFile}
                    fileName="sfilename"                  
                    deleteRecord={this.props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "ProtocolFile" }}
                    editParam={editParam}
                    fetchRecord={this.props.addProtocolFile}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    viewId={viewFileId}
                    userRoleControlRights={this.props.userRoleControlRights}
                    viewFile={this.props.viewProtocolFile}
                    //subFields={subFields}
                    moreField={moreField}
                    settings={this.props.settings}
                    userInfo={this.props.userInfo}
                    genericLabel={this.props.genericLabel} 
                />
            </>
        );
    }
}

export default injectIntl(ProtocolFileTab);