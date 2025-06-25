import React from 'react';
import { injectIntl} from 'react-intl';
import ListAttachment from '../../../components/ListAttachment';

const UserViewTrainingDocumentTab = (props) => {
    return (
        <>
                    <ListAttachment
                     attachmentList={props.TrainingDocuments&&props.TrainingDocuments}
                     fileName="sfilename"
                     isjsonfield ={false}  
                     userRoleControlRights={props.userRoleControlRights}
                     userInfo={props.userInfo}
                     viewFile={props.viewTrainingDocumentFile}
                     viewId={props.controlMap.has("ViewTrainingDocFile") && props.controlMap.get("ViewTrainingDocFile").ncontrolcode}
                     moreField={props.moreField}
                     subFields={props.subFields || []}
                />  
          </>      
    );
}

export default injectIntl(UserViewTrainingDocumentTab);