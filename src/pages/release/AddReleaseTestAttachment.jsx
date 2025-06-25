import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';
import { attachmentType, transactionStatus } from '../../components/Enumeration';
import { deleteAttachmentDropZone, onDropAttachFileList } from '../../components/CommonScript';
import { viewAttachment } from '../../actions';
import { connect } from 'react-redux';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { toast } from 'react-toastify';
import { updateStore } from '../../actions';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class AddReleaseTestAttachment extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            loading: false,
            ReleaseTestAttachmentDetails: this.props.ReleaseTestAttachmentDetails,
            dataState: dataState,
            openModal: false,
            inputParam: this.props.inputParam,
            loadEsign: false,
            operation: this.props.operation ? this.props.operation : "",
            selectedRecord: this.props.selectedRecord,
            isneedReport: this.props.isneedReport
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.ReleaseTestAttachmentDetails !== prevProps.ReleaseTestAttachmentDetails) {
            this.setState({ ReleaseTestAttachmentDetails: this.props.ReleaseTestAttachmentDetails })
        }
        if (this.props.inputParam !== prevProps.inputParam) {
            this.setState({ inputParam: this.props.inputParam })
        }
        if (this.props.selectedRecord !== prevProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord })
        }
        if (this.props.operation !== prevProps.operation) {
            this.setState({ operation: this.props.operation })
        }
    }

    render() {
        // const addReleaseTestAttachment =
        //     this.props.controlMap.has("AddReleaseTestAttachment") &&
        //     this.props.controlMap.get("AddReleaseTestAttachment").ncontrolcode;

        const editReleaseTestAttachment =
            this.props.controlMap.has("EditReleaseTestAttachment") &&
            this.props.controlMap.get("EditReleaseTestAttachment").ncontrolcode;

        // const editReleaseTestAttachmentParam = {
        //     screenName: this.props.intl.formatMessage({ id: "IDS_RELEASETESTATTACHMENT" }),
        //     operation: "update", primaryKeyField: "nreleasetestattachmentcode",
        //     inputParam: this.state.inputParam,
        //     userInfo: this.props.userInfo,
        //     ncontrolCode: editReleaseTestAttachment
        // };

        this.fieldsForReleasedTestAttachmentGrid =
            [
                { "idsName": "IDS_FILENAME", "dataField": "sfilename", "width": "200px" },
                { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" }
            ]
        {
            this.props.masterData.realRegSubTypeValue && this.props.masterData.realRegSubTypeValue.nneedsubsample &&
                this.fieldsForReleasedTestAttachmentGrid.push(
                    { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" }
                )
        }
        this.fieldsForReleasedTestAttachmentGrid.push(
            { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_SCREENNAME", "dataField": "sformname", "width": "200px" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" },
            { "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "200px" },
            { "idsName": "IDS_CREATEDDATE", "dataField": "screateddate", "width": "200px" }
        );

        const sdescrption = this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK ? "slinkdescription" : "sdescription";
        return (
            <>
                <Row>
                    {
                        <Col md={12}>
                            <DropZone
                                name='AttachmentFile'
                                label={this.props.intl.formatMessage({ id: "IDS_FILE" })}
                                isMandatory={true}
                                accept={this.state.selectedRecord && this.state.selectedRecord.nneedreport === transactionStatus.YES ? this.props.settings && this.props.settings[32] : ""}
                                maxFiles={1}
                                minSize={0}
                                maxSize={this.props.maxSize}
                                onDrop={(event) => this.onDrop(event, 'sfilename', 1)}
                                deleteAttachment={this.deleteAttachment}
                                actionType={this.actionType}
                                fileNameLength={this.fileNameLength}
                                editFiles={this.state.selectedRecord ? this.state.selectedRecord : {}}
                                attachmentTypeCode={this.state.selectedRecord && this.state.selectedRecord.selectedAttachmentFile && this.state.selectedRecord.selectedAttachmentFile.nattachmenttypecode}
                                fileSizeName="nfilesize"
                                fileName="sfilename"
                            />
                        </Col>
                    }

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_ARNUMBER" })}
                            isSearchable={true}
                            name={"npreregno"}
                            isDisabled={this.state.operation === "create" ? false : true}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.state.selectedRecord ? this.state.selectedRecord.RegistrationArno : []}
                            optionId='npreregno'
                            optionValue='sarno'
                            value={this.state.selectedRecord ? this.state.selectedRecord.npreregno : ""}
                            onChange={(event) => this.onComboChange(event, 'npreregno')}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>

                    {this.props.masterData.realRegSubTypeValue && this.props.masterData.realRegSubTypeValue.nneedsubsample &&
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLEARNO" })}
                                isSearchable={true}
                                name={"ntransactionsamplecode"}
                                isDisabled={this.state.operation === "create" ? false : true}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={this.state.selectedRecord ? this.state.selectedRecord.RegistrationSampleArno : []}
                                optionId='ntransactionsamplecode'
                                optionValue='ssamplearno'
                                value={this.state.selectedRecord ? this.state.selectedRecord.ntransactionsamplecode : ""}
                                onChange={(event) => this.onComboChange(event, 'ntransactionsamplecode')}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                            />
                        </Col>
                    }


                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_TESTSYNONYM" })}
                            isSearchable={true}
                            name={"ntransactiontestcode"}
                            isDisabled={this.state.operation === "create" ? false : true}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.state.selectedRecord ? this.state.selectedRecord.RegistrationTest : []}
                            optionId='ntransactiontestcode'
                            optionValue='stestsynonym'
                            value={this.state.selectedRecord ? this.state.selectedRecord.ntransactiontestcode : ""}
                            onChange={(event) => this.onComboChange(event, 'ntransactiontestcode')}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                        />
                    </Col>

                    <Col md="12" className="mt-4">
                        <FormTextarea
                            name={"sheader"}
                            label={this.props.intl.formatMessage({ id: "IDS_HEADER" })}
                            onChange={(event) => this.onInputOnChange(event, 1)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_HEADER" })}
                            value={this.state.selectedRecord && this.state.selectedRecord["sheader"] ? this.state.selectedRecord["sheader"] : ""}
                            rows="2"
                            required={false}
                            //isMandatory={true}
                            maxLength={255}
                        >
                        </FormTextarea>
                    </Col>
                    <Col md={12}>
                        <FormNumericInput
                            name={"nsortorder"}
                            label={this.props.intl.formatMessage({ id: "IDS_SORT" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SORT" })}
                            type="number"
                            value={this.state.selectedRecord && this.state.selectedRecord["nsortorder"] !== null ? this.state.selectedRecord["nsortorder"] : null}
                            max={99}
                            min={0}
                            strict={true}
                            maxLength={2}
                            onChange={(event) => this.onNumericInputOnChange(event, 'nsortorder')}
                            noStyle={true}
                            precision={0}
                            className="form-control"
                            isMandatory={false}
                            errors="Please provide a valid number."
                        />
                    </Col>

                    <Col md="12" className="mt-4">
                        <FormTextarea
                            name={sdescrption}
                            label={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            onChange={(event) => this.onInputOnChange(event, 1)}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            value={this.state.selectedRecord && this.state.selectedRecord[sdescrption] ? this.state.selectedRecord[sdescrption] : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                        >
                        </FormTextarea>
                    </Col>

                    <Col md="12" className="mt-4">
                        <CustomSwitch
                            label={this.props.intl.formatMessage({ id: "IDS_INCULDEINREPORT" })}
                            type="switch"
                            name={"nneedreport"}
                            onChange={(event) => this.onInputOnChange(event, 1)}
                            defaultValue={false}
                            isMandatory={false}
                            required={true}
                            checked={this.state.selectedRecord ? this.state.selectedRecord.nneedreport === transactionStatus.YES ? true : false : false}
                        />
                    </Col>
                </Row>
            </>
        );
    };

    onComboChange = (comboData, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        let lstRegistrationSampleArno = this.props.masterData.RegistrationSampleArno;
        let lstRegistrationTest = this.props.masterData.RegistrationTest;
        let RegistrationSampleArno = [];
        let RegistrationTest = [];
        let ntransactionsamplecode = "";
        let ntransactiontestcode = "";
        let ssamplearno = null;
        let stestsynonym = null;
        const needSubSample = this.props.masterData.realRegSubTypeValue && this.props.masterData.realRegSubTypeValue.nneedsubsample;
        if (fieldName === "npreregno") {
            lstRegistrationSampleArno.map(item => {
                if (item.item.npreregno === comboData.value) {
                    RegistrationSampleArno.push(item);
                }
            });
            if (!needSubSample) {
                lstRegistrationTest.map(item => {
                    if (item.item.ntransactionsamplecode === RegistrationSampleArno[0].item.ntransactionsamplecode) {
                        RegistrationTest.push(item);
                    }
                });
                ntransactionsamplecode = {
                    item: RegistrationSampleArno[0],
                    label: RegistrationSampleArno[0].label,
                    value: RegistrationSampleArno[0].value
                }
                ssamplearno = RegistrationSampleArno[0].item.ssamplearno
            }
            let npreregno = {
                item: comboData.item,
                label: comboData.label,
                value: comboData.value
            };
            let sarno = comboData.item.sarno;
            selectedRecord = {
                ...selectedRecord, RegistrationSampleArno, RegistrationTest, npreregno
                , sarno, ntransactionsamplecode, ntransactiontestcode, ssamplearno, stestsynonym
            };
            this.setState({ selectedRecord });
        } else if (fieldName === "ntransactionsamplecode") {
            lstRegistrationTest.map(item => {
                if (item.item.ntransactionsamplecode === comboData.value) {
                    RegistrationTest.push(item);
                }
            });
            ntransactionsamplecode = {
                item: comboData.item,
                label: comboData.label,
                value: comboData.value
            }
            ssamplearno = comboData.item.ssamplearno;
            selectedRecord = {
                ...selectedRecord, RegistrationTest, ntransactionsamplecode
                , ssamplearno, ntransactiontestcode, stestsynonym
            };
            this.setState({ selectedRecord });
        } else if (fieldName === "ntransactiontestcode") {
            ntransactiontestcode = {
                item: comboData.item,
                label: comboData.label,
                value: comboData.value
            }
            stestsynonym = comboData.item.stestsynonym;
            selectedRecord = {
                ...selectedRecord, ntransactiontestcode
                , stestsynonym
            }
            this.setState({ selectedRecord });
        }
        this.props.childDataChange(selectedRecord);
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[event.target.name] = event.target.value;
        if (event.target.type === 'checkbox') {
            if (event.target.name === "nneedreport") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        if (selectedRecord["nneedreport"] && selectedRecord["nneedreport"] === transactionStatus.YES && selectedRecord["sfilename"] !== undefined && selectedRecord["sfilename"].length > 0) {
            let fileFormat = false;
            let requiredFileFormat = this.props.settings && this.props.settings[32] && this.props.settings[32].split(",");
            let fileNameSplit = selectedRecord["sfilename"] && Array.isArray(selectedRecord["sfilename"]) ? selectedRecord["sfilename"][0].name.split(".") : selectedRecord["sfilename"].split(".");
            requiredFileFormat.map(item => {
                if (item.slice(1) === fileNameSplit[fileNameSplit.length - 1]) {
                    fileFormat = true;
                }
            });
            selectedRecord["nneedreport"] = fileFormat ? selectedRecord["nneedreport"] : transactionStatus.NO;
            !fileFormat && toast.warn(this.props.intl.formatMessage({ id: "IDS_REPORTSUPPORTSONLYFILEFORMATS" }));
        }
        this.setState({ selectedRecord })
        this.props.childDataChange(selectedRecord);
    }
    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    onDrop = (attachedFiles, fieldName, maxSize) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles, maxSize)
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)
        this.setState({
            selectedRecord
        });
        this.props.childDataChange(selectedRecord);
    }
}

export default connect(mapStateToProps, { viewAttachment, updateStore })(injectIntl(AddReleaseTestAttachment));