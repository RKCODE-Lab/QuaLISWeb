import React from 'react';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';


const AddFile = (props) => {
    return (
        <DropZone
            name='TestFile'
            label={props.intl.formatMessage({ id: "IDS_TESTFILE" })}
            isMandatory={true}
            maxFiles={props.maxFiles}
            // accept="image/png"
            minSize={0}
            maxSize={props.maxSize}
            onDrop={(event)=>props.onDrop(event,'sfilename',props.maxFiles)}
            editFiles={props.selectedFile?props.selectedFile:{}}
            multiple={false}
            fileSizeName="nfilesize"
            fileName="sfilename"
            deleteAttachment={props.deleteAttachment}
            actionType={props.actionType}
        />
    )
}
export default injectIntl(AddFile);