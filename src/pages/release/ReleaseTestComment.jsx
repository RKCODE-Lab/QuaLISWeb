import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';
import { updateStore } from '../../actions';
import { connect } from 'react-redux';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import rsapi from '../../rsapi';
import { toast } from 'react-toastify';
import { constructOptionList } from "../../components/CommonScript";
import Axios from "axios";
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

class ReleaseTestComment extends React.Component {
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
            operation: "",
            selectedRecord: {},
            isneedReport: this.props.isneedReport
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.ReleaseTestCommentDetails !== prevProps.ReleaseTestCommentDetails) {
            this.setState({ ReleaseTestCommentDetails: this.props.ReleaseTestCommentDetails })
        }
        if (this.props.inputParam !== prevProps.inputParam) {
            this.setState({ inputParam: this.props.inputParam })
        }

    }

    render() {
        const addReleaseTestComment =
            this.props.controlMap.has("AddReleaseTestComment") &&
            this.props.controlMap.get("AddReleaseTestComment").ncontrolcode;

        const editReleaseTestComment =
            this.props.controlMap.has("EditReleaseTestComment") &&
            this.props.controlMap.get("EditReleaseTestComment").ncontrolcode;

        const editReleaseTestCommentParam = {
            screenName: this.props.intl.formatMessage({ id: "IDS_RELEASETESTCOMMENT" }),
            operation: "update", primaryKeyField: "nreleasetestcommentcode",
            inputParam: this.state.inputParam,
            userInfo: this.props.userInfo,
            ncontrolCode: editReleaseTestComment
        };

        this.fieldsForReleasedTestCommentGrid = [
            { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "200px" },
        ];
        {
            this.props.masterData.realRegSubTypeValue && this.props.masterData.realRegSubTypeValue.nneedsubsample &&
                this.fieldsForReleasedTestCommentGrid.push(
                    { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "200px" }
                )
        }
        this.fieldsForReleasedTestCommentGrid.push(
            { "idsName": "IDS_TESTSYNONYM", "dataField": "stestsynonym", "width": "200px" },
            { "idsName": "IDS_SCREENNAME", "dataField": "sformname", "width": "200px" },
            { "idsName": "IDS_COMMENTNAME", "dataField": "scommentsubtype", "width": "200px" },
            { "idsName": "IDS_ABBREVIATIONNAME", "dataField": "spredefinedname", "width": "200px" },
            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "200px" },
            { "idsName": "IDS_INCULDEINREPORT", "dataField": "sneedreport", "width": "200px" },
            { "idsName": "IDS_USERNAME", "dataField": "susername", "width": "200px" },
            { "idsName": "IDS_USERROLENAME", "dataField": "suserrolename", "width": "200px" }
        )

        return (
            <>
                <Row>
                    <Col>
                        <DataGrid
                            primaryKeyField="nreleasetestcommentcode"
                            data={this.state.ReleaseTestCommentDetails || []}
                            dataResult={process(this.state.ReleaseTestCommentDetails && this.state.ReleaseTestCommentDetails || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            isExportExcelRequired={false}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            userInfo={this.props.userInfo}
                            editParam={editReleaseTestCommentParam}
                            extractedColumnList={this.fieldsForReleasedTestCommentGrid}
                            pageable={true}
                            dataStateChange={this.props.dataStateChange}
                            scrollable={'scrollable'}
                            gridHeight={'630px'}
                            isActionRequired={true}
                            addRecord={(event) => this.getSampleDetails(event, addReleaseTestComment, "create")}
                            isToolBarRequired={true}
                            methodUrl={'ReleaseTestComment'}
                            isAddRequired={this.props.isAddRequired}
                            isRefreshRequired={this.props.isRefreshRequired}
                            isImportRequired={this.props.isImportRequired}
                            isDownloadPDFRequired={this.props.isDownloadPDFRequired}
                            isDownloadExcelRequired={this.props.isDownloadExcelRequired}
                            fetchRecord={(event) => { this.getSampleDetails(event, editReleaseTestComment, "update") }}
                            deleteRecord={this.props.deleteRecord}
                        />
                    </Col>
                </Row>
            </>
        );
    };

    getSampleDetails = (event, ncontrolCode, operation) => {
        const url = "release/getActiveReleaseTestCommentById";
        let masterData = this.props.masterData;
        const isInitialRender = true;
        if (this.props.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.RELEASED
            && this.props.masterData.selectedReleaseHistory[0].ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
            if (operation === "update") {
                let urlArray = [];
                urlArray.push(rsapi.post(url, {
                    "ncoaparentcode": event.editRow.ncoaparentcode,
                    "npreregno": event.editRow.npreregno,
                    "ntransactionsamplecode": event.editRow.ntransactionsamplecode,
                    "ntransactiontestcode": event.editRow.ntransactiontestcode,
                    "nreleasetestcommentcode": event.editRow.nreleasetestcommentcode,
                    "userinfo": this.props.userInfo
                }));
                urlArray.push(
                    rsapi.post("/comments/getSampleTestCommentsListById", {
                        userinfo: this.props.userInfo,
                        ncommentsubtypecode: event.editRow && event.editRow.ncommentsubtypecode && event.editRow.ncommentsubtypecode
                    })
                );
                Axios.all(urlArray)
                    .then(response => {
                        let responseData = response[0].data;
                        const lstSampleTestComments = constructOptionList(response[1].data.SampleTestComments || [], "nsampletestcommentscode", "spredefinedname", false, false, true);
                        const SampleTestComments = lstSampleTestComments.get("OptionList");
                        if (responseData.ntransactionstatus !== transactionStatus.RELEASED && responseData.ntransactionstatus !== transactionStatus.PRELIMINARYRELEASE) {
                            let selectedReleaseTestComment = event.editRow;
                            let nneedreport = responseData && responseData.nneedreport ? responseData.nneedreport : transactionStatus.NO;
                            let scomments = responseData && responseData.scomments ? responseData.scomments : "";
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
                                ...this.state.selectedRecord, npreregno, ntransactionsamplecode, ntransactiontestcode, sarno, ssamplearno, stestsynonym, nneedreport,
                                scomments, selectedReleaseTestComment,
                            };
                            selectedRecord["scommentsubtype"] = responseData.scommentsubtype;
                            selectedRecord["ncommentsubtypecode"] = {
                                label: responseData.scommentsubtype,
                                value: responseData.ncommentsubtypecode
                            };
                            selectedRecord["spredefinedname"] = responseData.spredefinedname;
                            selectedRecord["nsampletestcommentscode"] = {
                                label: responseData.spredefinedname,
                                value: responseData.nsampletestcommentscode
                            };
                            masterData["selectedRecord"] = selectedRecord;
                            let screenName = "IDS_EDITRELEASETESTCOMMENT";
                            const updateInfo = {
                                typeName: DEFAULT_RETURN,
                                data: { isReleaseTestComment: false, isAddReleaseTestComment: true, masterData, operation, selectedRecord, screenName, ncontrolCode, isInitialRender, SampleTestComments }
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
                let screenName = "IDS_ADDRELEASETESTCOMMENT";
                let RegistrationArno = this.props.masterData.RegistrationArno;
                let commentSubType = this.props.CommentSubType;
                let SampleTestComments = this.props.SampleTestComments;
                let selectedRecord = {
                    RegistrationArno: RegistrationArno,
                    ReleaseTestCommentDetails: this.props.masterData.ReleaseTestCommentDetails,
                    nneedreport: transactionStatus.NO,
                    ncommentsubtypecode: commentSubType && commentSubType[0],
                    scommentsubtype: commentSubType && commentSubType[0] && commentSubType[0].label,
                    //ALPD-4948 Passed sampletestcomments and predefined details when open add test comment slideout
                    nsampletestcommentscode: SampleTestComments && SampleTestComments[0],
                    spredefinedname: SampleTestComments && SampleTestComments[0] && SampleTestComments[0].label
                };
                masterData["selectedRecord"] = selectedRecord;
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: { isReleaseTestComment: false, isAddReleaseTestComment: true, masterData, operation, selectedRecord, screenName, ncontrolCode, isInitialRender }
                }
                this.props.updateStore(updateInfo);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTCORRECTEDRECORD" }));
        }
    }
}

export default connect(null, { updateStore })(injectIntl(ReleaseTestComment));