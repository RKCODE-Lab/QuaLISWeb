import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';
import { viewAttachment } from '../../actions';
import { connect } from 'react-redux';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { updateStore } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class ReleaseTestAttachment extends React.Component {
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
        const addReleaseTestAttachment =
            this.props.controlMap.has("AddReleaseTestAttachment") &&
            this.props.controlMap.get("AddReleaseTestAttachment").ncontrolcode;

        const editReleaseTestAttachment =
            this.props.controlMap.has("EditReleaseTestAttachment") &&
            this.props.controlMap.get("EditReleaseTestAttachment").ncontrolcode;

        const editReleaseTestAttachmentParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_RELEASETESTATTACHMENT" }),
            operation: "update", primaryKeyField: "nreleasetestattachmentcode",
            inputParam: this.state.inputParam,
            userInfo: this.props.userInfo,
            ncontrolCode: editReleaseTestAttachment
        };

        this.fieldsForReleasedTestAttachmentGrid = [
            { "idsName": "IDS_FILENAME", "dataField": "sfilename", "width": "200px" },
            { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
        ];
        {
            this.props.masterData.realRegSubTypeValue && this.props.masterData.realRegSubTypeValue.nneedsubsample &&
                this.fieldsForReleasedTestAttachmentGrid.push(
                    { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" }
                )
        }
        this.fieldsForReleasedTestAttachmentGrid.push(
            { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_SCREENNAME", "dataField": "sformname", "width": "200px" },
            { "idsName": "IDS_HEADER", "dataField": "sheader", "width": "200px" },
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" },
            { "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" },
            { "idsName": "IDS_SORT", "dataField": "nsortorder", "width": "200px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "200px" },
            { "idsName": "IDS_CREATEDDATE", "dataField": "screateddate", "width": "200px" }
        );

        return (
            <>
                <Row>
                    <Col>
                        <DataGrid
                            primaryKeyField="nreleasetestattachmentcode"
                            data={this.state.ReleaseTestAttachmentDetails || []}
                            dataResult={process(this.state.ReleaseTestAttachmentDetails && this.state.ReleaseTestAttachmentDetails || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            isExportExcelRequired={false}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            userInfo={this.props.userInfo}
                            editParam={editReleaseTestAttachmentParam}
                            extractedColumnList={this.fieldsForReleasedTestAttachmentGrid}
                            pageable={true}
                            dataStateChange={this.props.dataStateChange}
                            scrollable={'scrollable'}
                            gridHeight={'630px'}
                            isActionRequired={true}
                            addRecord={(event) => this.getSampleDetails(event, addReleaseTestAttachment, "create")}
                            isToolBarRequired={true}
                            methodUrl={'ReleaseTestAttachment'}
                            isAddRequired={this.props.isAddRequired}
                            isRefreshRequired={this.props.isRefreshRequired}
                            isImportRequired={this.props.isImportRequired}
                            isDownloadPDFRequired={this.props.isDownloadPDFRequired}
                            isDownloadExcelRequired={this.props.isDownloadExcelRequired}
                            fetchRecord={(event) => { this.getSampleDetails(event, editReleaseTestAttachment, "update") }}
                            deleteRecord={this.props.deleteRecord}
                            viewDownloadFile={this.viewReleaseTestAttachmentFile}
                        />
                    </Col>
                </Row>
            </>
        );
    };

    getSampleDetails = (event, ncontrolCode, operation) => {
        const url = "release/getActiveReleaseTestAttachmentById";
        let masterData = this.props.masterData;
        // let screenName = this.props.screenName;
        const isInitialRender = true;
        if (this.props.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED
            && this.props.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
            if (operation === "update") {
                let screenName = "IDS_EDITRELEASETESTATTACHMENT";
                rsapi.post(url, {
                    "ncoaparentcode": event.editRow.ncoaparentcode,
                    "npreregno": event.editRow.npreregno,
                    "ntransactionsamplecode": event.editRow.ntransactionsamplecode,
                    "ntransactiontestcode": event.editRow.ntransactiontestcode,
                    "nreleasetestattachmentcode": event.editRow.nreleasetestattachmentcode,
                    "userinfo": this.props.userInfo
                })
                    .then(response => {
                        let responseData = response.data;
                        if (responseData.ntransactionstatus !== transactionStatus.RELEASED && responseData.ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
                            let selectedReleaseTestAttachment = event.editRow;
                            let nneedreport = responseData && responseData.nneedreport ? responseData.nneedreport : transactionStatus.NO;
                            let sdescription = responseData && responseData.sdescription ? responseData.sdescription : "";
                            let sheader = responseData && responseData.sheader ? responseData.sheader : "";
                            let nsortorder = responseData && responseData.nsortorder ? responseData.nsortorder : "";
                            let sfilename = event.editRow && event.editRow.sfilename;
                            let npreregno;
                            let ntransactionsamplecode;
                            let ntransactiontestcode;
                            let sarno;
                            let ssamplearno;
                            let stestsynonym;
                            masterData.RegistrationArno.map(item => {
                                if (item.value === responseData.npreregno) {
                                    npreregno = item;
                                    sarno = item.label;
                                }
                            });
                            masterData.RegistrationSampleArno.map(item => {
                                if (item.value === responseData.ntransactionsamplecode) {
                                    ntransactionsamplecode = item;
                                    ssamplearno = item.label;
                                }
                            });
                            masterData.RegistrationTest.map(item => {
                                if (item.value === responseData.ntransactiontestcode) {
                                    ntransactiontestcode = item;
                                    stestsynonym = item.label;
                                }
                            });
                            let selectedRecord = {
                                ...this.state.selectedRecord, npreregno, ntransactionsamplecode, ntransactiontestcode, sfilename, sarno, ssamplearno, stestsynonym, nneedreport, sdescription, selectedReleaseTestAttachment
                                , sheader, nsortorder
                            };
                            masterData["selectedRecord"] = selectedRecord;
                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: { isReleaseTestAttachment: false, isAddReleaseTestAttachment: true, masterData, operation, selectedRecord, screenName, ncontrolCode, isInitialRender }
                            }
                            this.props.updateStore(updateInfo);
                        } else {
                            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
                        }
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
            } else {
                let screenName = "IDS_ADDRELEASETESTATTACHMENT"
                let RegistrationArno = this.props.masterData.RegistrationArno;
                let selectedRecord = {
                    RegistrationArno: RegistrationArno,
                    ReleaseTestAttachmentDetails: this.props.masterData.ReleaseTestAttachmentDetails,
                    nneedreport: transactionStatus.NO
                };
                masterData["selectedRecord"] = selectedRecord;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { isReleaseTestAttachment: false, isAddReleaseTestAttachment: true, masterData, operation, selectedRecord, screenName, ncontrolCode, isInitialRender }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }

    deleteRecord = (deleteParam) => {
        const url = "release/deleteReleaseTestAttachment";
        if (this.props.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED
            && this.props.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
            let releasetestattachment = {
                "ncoaparentcode": deleteParam.selectedRecord.ncoaparentcode,
                "npreregno": deleteParam.selectedRecord.npreregno,
                "ntransactionsamplecode": deleteParam.selectedRecord.ntransactionsamplecode,
                "ntransactiontestcode": deleteParam.selectedRecord.ntransactiontestcode,
                "nreleasetestattachmentcode": deleteParam.selectedRecord.nreleasetestattachmentcode
            }
            rsapi.post(url, {
                releasetestattachment, "userinfo": this.props.userInfo
            })
                .then(response => {
                    let ReleaseTestAttachmentDetails = response.data.ReleaseTestAttachmentDetails;
                    let selectedRecord = {
                        ...this.state.selectedRecord, ...response.data
                    };
                    let masterData = this.props.masterData;
                    masterData["ReleaseTestAttachmentDetails"] = ReleaseTestAttachmentDetails;
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { selectedRecord, ReleaseTestAttachmentDetails, masterData }
                    }
                    this.props.updateStore(updateInfo);

                    this.setState({
                        selectedRecord, ReleaseTestAttachmentDetails
                    });
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
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }

    viewReleaseTestAttachmentFile = (filedata) => {
        delete (filedata.inputData.userinfo);
        const inputParam = {
            inputData: {
                releasetestattachment: filedata.inputData,
                userinfo: this.props.userInfo,
                ncontrolcode: filedata.ncontrolCode
            },
            classUrl: "release",
            operation: "view",
            methodUrl: "ReleaseTestAttachment",
        }
        this.props.viewAttachment(inputParam);
    }
}

export default connect(mapStateToProps, { viewAttachment, updateStore })(injectIntl(ReleaseTestAttachment));