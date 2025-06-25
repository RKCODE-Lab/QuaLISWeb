import React from 'react';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import { transactionStatus } from '../../components/Enumeration';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
const AddImportFileData = props => {
   // const {  importTest,disabled } = props.selectedRecord;

    return (
        <Row>
            <Col md="12">
                    <DropZone
                        name={"sfilename"}
                        label={props.intl.formatMessage({ id: "IDS_FILENAME" })}
                        isMandatory={true}
                        maxFiles={"1"}
                        minSize={0}
                        maxSize={props.maxSize}
                        accept={".xlsx, .xls"}
                        onDrop={(event) => props.onDropFile(event, "sfilename", "1")}
                        actionType={props.actionType}
                        deleteAttachment={props.deleteAttachment}
                        multiple={props.multiple}
                        editFiles={props.selectedRecord ? props.selectedRecord : {}}
                        attachmentTypeCode={props.editFiles && props.editFiles.nattachmenttypecode}
                        fileSizeName="nfilesize"
                        fileName="sfilename"
                       // disabled={disabled}
                    />
            </Col>

            {/* ALPD-3596 Start */}
            <Col md="12">
                        <CustomSwitch
                            label={props.intl.formatMessage({ id: "IDS_IMPORTWITHSPECSALLTEST" })}
                            type="switch"
                            name={"importTest"}
                            onChange={(event) => props.onInputOnChange(event,'','')}
                            placeholder={props.intl.formatMessage({ id: "IDS_IMPORTWITHSPECSALLTEST" })}
                            defaultValue={props.selectedRecord ? props.selectedRecord["importTest"] === transactionStatus.YES ? true : false : ""}
                            isMandatory={false}
                            required={false}
                           checked={props.selectedRecord ? props.selectedRecord["importTest"] === transactionStatus.YES ? true : false : false}
                           //disabled={props.specBasedComponent && props.specBasedComponent === true ? true : false }

                        />
            </Col>
            <Col md="12">
            {props.specBasedComponent!==true && props.selectedRecord.importTest === transactionStatus.NO &&
                    <FormMultiSelect
                        name={"ntestgrouptestcode"}
                        label={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                        options={props.TestCombined || []}
                        optionId={"ntestgrouptestcode"}
                        optionValue="stestsynonym"
                        value={props.selectedTestData && props.selectedTestData["ntestgrouptestcode"] ?
                            props.selectedTestData["ntestgrouptestcode"] : []}
                        isMandatory={props.hasTest ? true : false}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange={(event) => props.TestChange(event, "ntestgrouptestcode")}

                    />
                }
            </Col>
            {/* ALPD-3596 End */}

           
        </Row>
    );
};

export default injectIntl(AddImportFileData);

