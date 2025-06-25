import React from 'react';
import { Col, Row } from 'react-bootstrap';
import DropZone from '../../components/dropzone/dropzone.component';
import { injectIntl } from 'react-intl';


const ResultEntryImport = (props) => {


    return (
        <Row>
            <Col md={12}>
                <DropZone
                    name={"sfilename"}
                    label={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                    isMandatory={true}
                    maxFiles={"1"}
                    minSize={0}
                    maxSize={props.maxSize}
                    accept={".xlsx, .xls"}
                    multiple={props.multiple}
                    // attachmentTypeCode={attachmentType.FTP}
                    editFiles={props.selectedImportFile && props.selectedImportFile}
                    fileSizeName="nfilesize"
                    fileName="sfilename"
                    onDrop={(event) => props.onDropFile(event)}
                    deleteAttachment = {props.deleteAttachment}
                    actionType={props.actionType}
                />
            </Col>
        </Row>
    )
}


export default injectIntl(ResultEntryImport);