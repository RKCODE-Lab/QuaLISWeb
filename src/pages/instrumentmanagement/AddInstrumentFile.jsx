import React from 'react';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';
import { Row, Col, Form } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { attachmentType } from '../../components/Enumeration';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';

const AddInstrumentFile = props => {
    const { nattachmenttypecode, disabled } = props.selectedRecord;
    const sdescription=nattachmenttypecode === attachmentType.LINK?"slinkdescription":"sfiledesc";

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
                        name={"sfilename"}
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
                        //attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}
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
                    name={sdescription}
                    type="text"
                    label={ props.intl.formatMessage({ id:"IDS_DESCRIPTION"})}                  
                    placeholder={ props.intl.formatMessage({ id:"IDS_DESCRIPTION"})}
                    //value ={ props.selectedRecord["sfiledesc"]}
                    value={props.selectedRecord[sdescription]?props.selectedRecord[sdescription]:""}
                    isMandatory={false}
                    required={true}
                    maxLength={255}
                    onChange={(event)=> props.onInputOnChange(event)}
                >
                </FormTextarea>
                {/* {props.hideDefaultToggle ? "" :
                    <CustomSwitch
                        label={props.intl.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                        type="switch"
                        name={nattachmenttypecode === attachmentType.LINK?"nlinkdefaultstatus":"ndefaultstatus"}
                        onChange={(event) => props.onInputOnChange(event, 1, [3, 4])}
                        placeholder={props.intl.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                        defaultValue={props.selectedRecord ? props.selectedRecord[nattachmenttypecode === attachmentType.LINK?"nlinkdefaultstatus":"ndefaultstatus"] === 3 ? true : false : ""}
                        isMandatory={false}
                        required={false}
                        checked={props.selectedRecord ? props.selectedRecord[nattachmenttypecode === attachmentType.LINK?"nlinkdefaultstatus":"ndefaultstatus"] === 3 ? true : false : false}
                    // disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                    >
                    </CustomSwitch>
                } */}
            </Col>
        </Row>
    );
};

export default injectIntl(AddInstrumentFile);