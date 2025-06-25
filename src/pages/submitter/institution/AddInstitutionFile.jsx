import React from 'react';
import { injectIntl } from 'react-intl';
import DropZone from '../../../components/dropzone/dropzone.component';
import { Row, Col, Form } from 'react-bootstrap';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { attachmentType } from '../../../components/Enumeration';

const AddInstitutionFile = props => {
    const { nattachmenttypecode, disabled } = props.selectedRecord;
    const sfiledesc=nattachmenttypecode === attachmentType.LINK?"slinkdescription":"sfiledesc";
    return (
        <Row>
            <Col md="12">
                <Form.Group>
                    <Form.Check
                        name="nattachmenttypecode"
                        type="radio"
                        id="AddFiles"
                        label={props.intl.formatMessage({ id: "IDS_FTP" })}
                        inline={true}
                        onChange={(event) => props.onInputOnChange(event, attachmentType.FTP)}
                        checked={nattachmenttypecode === attachmentType.FTP ? true : false}
                        disabled={disabled}
                    >
                    </Form.Check>
                    <Form.Check
                        name="nattachmenttypecode"
                        type="radio"
                        id="AddLink"
                        label={props.intl.formatMessage({ id: "IDS_LINK" })}
                        inline={true}
                        onChange={(event) => props.onInputOnChange(event, attachmentType.LINK)}
                        checked={nattachmenttypecode === attachmentType.LINK ? true : false}
                        disabled={disabled}
                    >
                    </Form.Check>
                </Form.Group>
                {props.selectedRecord && nattachmenttypecode === attachmentType.FTP &&
                    <DropZone
                        name={props.name}
                        label={props.label}
                        isMandatory={true}
                        maxFiles={props.maxFiles}
                        minSize={0}
                        maxSize={props.maxSize}
                        onDrop={(event) => props.onDrop(event, "sfilename", props.maxFiles)}
                        actionType={props.actionType}
                        deleteAttachment={props.deleteAttachment}
                        multiple={props.multiple}
                        editFiles={props.selectedRecord ? props.selectedRecord : {}}
                        attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}
                        fileSizeName="nfilesize"
                        fileName="sfilename"
                    // disabled={disabled}
                    />}
                {props.selectedRecord && nattachmenttypecode === attachmentType.LINK &&
                    <>
                        <FormInput
                            name={"slinkfilename"}
                            label={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                            value={props.selectedRecord ? props.selectedRecord["slinkfilename"] : ""}
                            isMandatory="*"
                            required={true}
                            maxLength={100}
                        />
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_LINKNAME" })}
                            isSearchable={true}
                            name={"nlinkcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            showOption={true}
                            options={props.linkMaster || []}
                            optionId='nlinkcode'
                            optionValue='slinkname'
                            value={props.selectedRecord["nlinkcode"]}
                            onChange={value => props.onComboChange(value, "nlinkcode", 1)}
                            alphabeticalSort={true}
                        >
                        </FormSelectSearch>
                    </>}
                <FormTextarea
                    name={sfiledesc}
                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                    value={props.selectedRecord[sfiledesc] ? props.selectedRecord[sfiledesc] : ""}
                    rows="2"
                    required={false}
                    maxLength={255}
                >
                </FormTextarea>
                
            </Col>
        </Row>
    );
};

export default injectIntl(AddInstitutionFile);