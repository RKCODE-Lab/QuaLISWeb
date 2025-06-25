import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';
import { viewAttachment } from '../../actions';
import { connect } from 'react-redux';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { constructOptionList } from "../../components/CommonScript";

class AddReleaseTestAttachment extends React.Component {
    constructor(props) {
        super(props)
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };
        this.state = {
            loading: false,
            ReleaseTestCommentDetails: this.props.ReleaseTestCommentDetails,
            dataState: dataState,
            openModal: false,
            inputParam: this.props.inputParam,
            loadEsign: false,
            operation: this.props.operation ? this.props.operation : "",
            selectedRecord: this.props.selectedRecord,
            isneedReport: this.props.isneedReport,
            SampleTestComments: this.props.SampleTestComments
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.ReleaseTestCommentDetails !== prevProps.ReleaseTestCommentDetails) {
            this.setState({ ReleaseTestCommentDetails: this.props.ReleaseTestCommentDetails })
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
        if (this.props.SampleTestComments !== prevProps.SampleTestComments) {
            this.setState({ SampleTestComments: this.props.SampleTestComments })
        }
    }

    render() {
        // const addReleaseTestComment =
        //     this.props.controlMap.has("AddReleaseTestComment") &&
        //     this.props.controlMap.get("AddReleaseTestComment").ncontrolcode;

        // const editReleaseTestComment =
        //     this.props.controlMap.has("EditReleaseTestComment") &&
        //     this.props.controlMap.get("EditReleaseTestComment").ncontrolcode;

        // const editReleaseTestCommentParam = {
        //     screenName: this.props.intl.formatMessage({ id: "IDS_RELEASETESTCOMMENT" }),
        //     operation: "update", primaryKeyField: "nreleasetestcommentcode",
        //     inputParam: this.state.inputParam,
        //     userInfo: this.props.userInfo,
        //     ncontrolCode: editReleaseTestComment
        // };

        this.fieldsForReleasedTestCommentGrid =
            [
                { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" }
            ];
        this.props.masterData.realRegSubTypeValue && this.props.masterData.realRegSubTypeValue.nneedsubsample &&
                this.fieldsForReleasedTestCommentGrid.push(
                    { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" }
                )
        this.fieldsForReleasedTestCommentGrid.push(
            { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_SCREENNAME", "dataField": "sformname", "width": "200px" },
            { "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "width": "200px" },
            { "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "width": "200px" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px" },
            { "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "200px" }
        );

        return (
            <>
                <Row>

                    {
                        <Col md="12" className="mt-4">
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_COMMENTNAME" })}
                                isSearchable={true}
                                name={"ncommentsubtypecode"}
                                showOption={true}
                                options={this.props.CommentSubType || []}
                                optionId='ncommentsubtypecode'
                                optionValue='scommentsubtype'
                                value={this.state.selectedRecord["ncommentsubtypecode"] && (this.state.selectedRecord["ncommentsubtypecode"] || "")}
                                onChange={value => this.onComboChange(value, 'ncommentsubtypecode')}
                                isMandatory={true}
                            />
                            {this.state.selectedRecord && this.state.selectedRecord["ncommentsubtypecode"] && this.state.selectedRecord["ncommentsubtypecode"].value === 3 ?
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_ABBREVIATIONNAME" })}
                                    isSearchable={true}
                                    name={"nsampletestcommentscode"}
                                    showOption={true}
                                    options={this.state.SampleTestComments || []}
                                    optionId='nsampletestcommentscode'
                                    optionValue='spredefinedname'
                                    value={this.state.selectedRecord["nsampletestcommentscode"] && (this.state.selectedRecord["nsampletestcommentscode"] || "")}
                                    onChange={value => this.onComboChange(value, 'nsampletestcommentscode')}
                                    isMandatory={true}
                                /> : ""}
                            <FormTextarea
                                formGroupClassName="remove-floating-label-margin"
                                label={this.props.intl.formatMessage({ id: "IDS_COMMENT" })}
                                name={"scomments"}
                                type="text"
                                required={false}
                                isMandatory={true}
                                value={this.state.selectedRecord["scomments"] && (this.state.selectedRecord["scomments"] || "")}
                                onChange={(event) => this.onInputOnChange(event)}
                                maxLength={1500}
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
                    {/* : ""} */}

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
        } else if (fieldName === "ncommentsubtypecode") {
            rsapi.post("/comments/getSampleTestCommentsListById", {
                userinfo: this.props.userInfo,
                ncommentsubtypecode: comboData.value
            })
                .then(response => {
                    let listSampleTestComments = response.data.SampleTestComments;
                    const lstSampleTestComments = constructOptionList(listSampleTestComments || [], "nsampletestcommentscode", "spredefinedname", false, false, true);
                    const SampleTestComments = lstSampleTestComments.get("OptionList");
                    selectedRecord["scommentsubtype"] = comboData.label;
                    selectedRecord["ncommentsubtypecode"] = comboData;
                    // ALPD-4948    Modified code by Vishakh for showing commentsubtype field as 'NA' instead of showing '-'
                    selectedRecord["nsampletestcommentscode"] = SampleTestComments && SampleTestComments.length > 0 && SampleTestComments[0];
                    selectedRecord["scomments"] = "";
                    selectedRecord["spredefinedname"] = "";
                    this.setState({
                        SampleTestComments, selectedRecord,
                    });
                    this.props.childDataChange(selectedRecord);
                }).catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }
                    this.setState({
                        loading: false
                    });
                });
        } else if (fieldName === "nsampletestcommentscode") {
            selectedRecord["nsampletestcommentscode"] = comboData;
            selectedRecord["spredefinedname"] = comboData.label;
            selectedRecord["scomments"] = comboData.item && comboData.item.sdescription ? comboData.item.sdescription : "";
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

}

export default connect(null, { viewAttachment })(injectIntl(AddReleaseTestAttachment));