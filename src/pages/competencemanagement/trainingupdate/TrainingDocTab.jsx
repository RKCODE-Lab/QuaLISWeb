import React  from 'react'
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { designProperties } from '../../../components/Enumeration';
import ListAttachment from '../../../components/ListAttachment';
import { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { addtrainingdocfile } from '../../../actions';

import { DEFAULT_RETURN } from '../../../actions/LoginTypes';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}


class TrainingDocTab  extends Component {
    render() {
        const addFileId = this.props.controlMap.has("AddTrainingDocFile") && this.props.controlMap.get("AddTrainingDocFile").ncontrolcode;
        const deleteFileId = this.props.controlMap.has("DeleteTrainingDocFile") && this.props.controlMap.get("DeleteTrainingDocFile").ncontrolcode;
       
        const editFileId = this.props.controlMap.has("EditTrainingDocFile") && this.props.controlMap.get("EditTrainingDocFile").ncontrolcode;

        const viewFileId = this.props.controlMap.has("ViewTrainingDocFile") && this.props.controlMap.get("ViewTrainingDocFile").ncontrolcode;

        const editParam = {
            screenName: "IDS_TRAININGDOCUMENTS", operation: "update", inputParam: this.props.inputParam,
            userInfo: this.props.userInfo, ncontrolCode: editFileId, modalName: "openChildModal"
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
                <div className="actions-stripe border-bottom">
                    <div className="d-flex justify-content-end">
                        <Nav.Link 
                        name="addtrainingdocfile" className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addFileId) === -1}
                        onClick={()=>this.addtrainingdocfile({ncontrolCode: addFileId})}
                        >
                            <FontAwesomeIcon icon={faPlus} /> {" "}
                            <FormattedMessage id="IDS_ADDTRAININGFILE" defaultMessage="File" />
                        </Nav.Link>
                    </div>
                </div>
                <ListAttachment
                    attachmentList={this.props.TrainingDocument}
                    fileName="sfilename"
                    deleteRecord={this.props.deleteRecord}
                    deleteParam ={{operation:"delete", methodUrl: "TrainingDoc",screenName: "IDS_TRAININGDOCUMENTS"}}
                    fetchRecord={this.props.addtrainingdocfile}
                    deleteId={deleteFileId}
                    editId={editFileId}
                    editParam={editParam}
                    viewId={viewFileId}
                    controlMap={this.props.controlMap || []}
                    userRoleControlRights={this.props.userRoleControlRights || []}
                    subFields={subFields || []}
                    settings = {this.props.settings}
                    userInfo={this.props.userInfo}
                    moreField={moreField}
                    viewFile={this.props.viewTrainingDocumentFile}
                />
            </>
        );
    }

    addtrainingdocfile = (ncontrolCode) => {
        let openChildModal = this.props.Login.openChildModal;
        let operation = "create";
        let screenName = this.props.Login.screenName;
        screenName = "IDS_TRAININGDOCUMENTS";
        openChildModal = true;
        const selectedRecord = this.props.selectedRecord;
        const updateInfo = {
            userInfo: this.props.Login.userInfo, operation, selectedRecord, ncontrolCode, screenName
           };
           this.props.addtrainingdocfile(updateInfo);
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         openModal: true,
        //         operation: "create",
        //         selectedRecord: {},
        //         ncontrolcode: ncontrolcode,
        //         screenName:"IDS_TRAININGDOCUMENTS"
        //     }
        // }
        // this.props.updateStore(updateInfo);
    }


 
}

export default connect(mapStateToProps, {addtrainingdocfile})(injectIntl(TrainingDocTab));