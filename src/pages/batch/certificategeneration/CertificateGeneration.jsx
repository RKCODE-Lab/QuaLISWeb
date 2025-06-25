import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Row, Col, Card, Nav, FormGroup, FormLabel, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFileCode, faSync } from '@fortawesome/free-solid-svg-icons';
import {
    callService, onClickReport, crudMaster, validateEsignCredential, updateStore, getCerGenDetail, certifyBatch,
    getTestParameter, onClickCertificate, filterTransactionList, onClickXmlExport, validateEsignforCerGen, viewAttachment,viewReport
} from '../../../actions';
import { showEsign, getControlMap, getStartOfDay, formatInputDate, constructOptionList, rearrangeDateFormat, convertDateValuetoString, getEndOfDay } from '../../../components/CommonScript';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import { designProperties, reportCOAType, reportTypeEnum, transactionStatus } from '../../../components/Enumeration';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { ListWrapper } from '../../../components/client-group.styles';
import SplitterLayout from "react-splitter-layout";
import { ReadOnlyText, ContentPanel, OutlineTransactionStatus, DecisionStatus } from '../../../components/App.styles';
import { ReactComponent as NullificationIcon } from '../../../assets/image/Nullification.svg';
import { ReactComponent as CertificateCorrectionicon } from '../../../assets/image/certificate-correction.svg';
import { ReactComponent as CertificateSend } from '../../../assets/image/certificate-Send.svg';
import { ReactComponent as Certified } from '../../../assets/image/generate-certificate.svg';
import CertificateGenerationTab from './CertificateGenerationTab';
import TransactionListMaster from '../../../components/TransactionListMaster';
import PerfectScrollbar from 'react-perfect-scrollbar';
import rsapi, { fileViewUrl } from '../../../rsapi';
//import { intl } from '../../../components/App';
import BatchFilter from '../../../components/BatchFilter';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';
import { ProductList } from '../../testmanagement/testmaster-styled';
import DocViewer from '../../../components/doc-viewer/doc-viewer.component';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Certificategeneration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedCerGen: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            showSaveContinue: true,
            certificateStatus: [],
            fromdate:undefined,
            todate:undefined,
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3]
        };
        this.breadCrumbData = [];
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = [
            "scertificatehistorycode", "nreleasebatchcode", "sloginid", "suserrolename", "scomments", "scertificatetype"];
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.screenName === "IDS_CERTIFICATEGENERATION") {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    componentDidMount() {
        if (this.parentHeight) {
            const height = this.parentHeight.clientHeight;
            this.setState({
                firstPane: height - 80,
                parentHeight: height
            });
        }
    }

    render() {

        const certificateId = this.state.controlMap.has("BatchCertificate") && this.state.controlMap.get("BatchCertificate").ncontrolcode;
        const correctionId = this.state.controlMap.has("BatchCorrection") && this.state.controlMap.get("BatchCorrection").ncontrolcode;
        const sendId = this.state.controlMap.has("BatchSendCertificate") && this.state.controlMap.get("BatchSendCertificate").ncontrolcode
        const XmlId = this.state.controlMap.has("BatchXMLExport") && this.state.controlMap.get("BatchXMLExport").ncontrolcode
        const nullifiedId = this.state.controlMap.has("BatchNullified") && this.state.controlMap.get("BatchNullified").ncontrolcode
        const ReportId = this.state.controlMap.has("BatchReport") && this.state.controlMap.get("BatchReport").ncontrolcode

        let fromDate = this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"]);
        let toDate =  this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"]);
        let obj = convertDateValuetoString(fromDate,toDate,this.props.Login.userInfo)
        fromDate = obj.fromDate ;
        toDate = obj.toDate ;
        // if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
        //     fromDate = new Date(this.props.Login.masterData.FromDate)||(this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"]))  ;
        //     toDate = new Date(this.props.Login.masterData.ToDate)||(this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) ;
        // }

        const certificate = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: certificateId, fromDate, toDate
        };
        const correction = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: correctionId, fromDate, toDate
        };
        const sent = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: sendId, fromDate, toDate
        };
        const nullified = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: nullifiedId, fromDate, toDate
        };
        const xml = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: XmlId, fromDate, toDate
        };


        const filterParam = {
            inputListName: "CerGen",
            selectedObject: "SelectedCerGen",
            primaryKeyField: "nreleasebatchcode",
            fetchUrl: "certificategeneration/getCertificateGeneration",
            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                fromDate, toDate
            },
            masterData: this.props.Login.masterData,
            unchangeList: ["FromDate", "ToDate", "CerGen"],
            changeList: ["Component", "PrintHistory", "NullifiedHistory", "ClockHistory"],
            searchFieldList: this.searchFieldList
        }

        const breadCrumbData = this.state.filterData || [];
        this.confirmMessage = new ConfirmMessage();
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                    {breadCrumbData.length > 0 ?
                        <BreadcrumbComponent breadCrumbItem={breadCrumbData} /> : ""
                    }
                    {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* Start of get display*/}
                    <Row noGutters={true}>
                        <Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                            <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={30}>
                                <TransactionListMaster
                                    //  paneHeight={this.state.parentHeight}
                                    masterList={this.props.Login.masterData.searchedData || (this.props.Login.masterData.CerGen || [])}
                                    selectedMaster={this.props.Login.masterData.SelectedCerGen}
                                    primaryKeyField="nreleasebatchcode"
                                    getMasterDetail={(CerGen) => this.props.getCerGenDetail(CerGen, fromDate, toDate,
                                        this.props.Login.userInfo, this.props.Login.masterData)}
                                    inputParam={""}
                                    mainField="scertificatehistorycode"
                                    selectedListName="SelectedCerGen"
                                    objectName="Select"
                                    listName="IDS_CERTIFICATEGENERATION"
                                    needValidation={false}
                                    subFields={[{ [designProperties.VALUE]: "sproductname" }
                                        , { [designProperties.VALUE]: "smanufname" },
                                    { [designProperties.LABEL]: "IDS_RELEASEBATCHCODE", [designProperties.VALUE]: "nreleasebatchcode" },
                                    { [designProperties.VALUE]: "stransactionstatus", [designProperties.COLOUR]: "transstatuscolor" }]}
                                    needFilter={true}
                                    needMultiSelect={false}
                                    subFieldsLabel={true}
                                    mainFieldLabel={this.props.intl.formatMessage({id:"IDS_CERTIFICATENO"})}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    handlePageChange={this.handlePageChange}
                                    filterColumnData={this.props.filterTransactionList}
                                    searchListName="searchedData"
                                    searchRef={this.searchRef}
                                    filterParam={filterParam}

                                    commonActions={
                                        <ProductList className="d-flex product-category float-right icon-group-wrap">
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}
                                               // data-for="tooltip-common-wrap"
                                                onClick={() => this.reloadData(this.state.selectedRecord, false, "reload")} >
                                                <RefreshIcon className='custom_icons'/>
                                            </Button>
                                        </ProductList>
                                    }

                                    filterComponent={[
                                        {
                                            "IDS_FILTER":
                                                <BatchFilter
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    handleDateChange={this.handleDateChange}
                                                    fromDate={this.state.fromDate}
                                                    toDate={this.state.toDate}
                                                    userInfo={this.props.Login.userInfo}
                                                    statusList={this.state.certificateStatus}
                                                    onFilterComboChange={this.onFilterComboChange}
                                                //filterStatusValue={this.props.Login.masterData["CertificateStatusDefault"]}
                                                />
                                        }
                                    ]
                                    }
                                />
                                {/* </Col> */}
                                <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400} customClassName="fixed_list_height">
                                    <PerfectScrollbar>
                                        {/* <Col md={8}>  */}
                                        <div className="card_group">
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    {this.props.Login.masterData.CerGen && this.props.Login.masterData.CerGen.length > 0 && this.props.Login.masterData.SelectedCerGen ?
                                                        <>
                                                            <Card.Header>
                                                                {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                                <Card.Title className="product-title-main">
                                                                    {this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode}/
                                                                    {this.props.Login.masterData.SelectedCerGen[0].scertificatehistorycode} 
                                                                    {this.props.Login.masterData.SelectedCerGen[0].nversioncode>0? ` (Suppl ${this.props.Login.masterData.SelectedCerGen[0].nversioncode})`:""}
                                                                </Card.Title>
                                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                                    <Row>
                                                                        <Col md={6} >
                                                                            <h2 className="product-title-sub flex-grow-1">

                                                                                <OutlineTransactionStatus transcolor={this.props.Login.masterData.SelectedCerGen[0].transstatuscolor}>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].stransactionstatus}
                                                                                </OutlineTransactionStatus>

                                                                                {/* {this.props.Login.masterData.SelectedCerGen[0].ndecision !== transactionStatus.DRAFT ?
                                                                                        <DecisionStatus decisioncolor={this.props.Login.masterData.SelectedCerGen[0].decisioncolor}>
                                                                                        {this.props.Login.masterData.SelectedCerGen[0].sdecision}
                                                                                        </DecisionStatus>
                                                                                    :""}  */}

                                                                                {/* <span className={`btn btn-outlined ${goodsInStatusCSS} btn-sm ml-3`} >
                                                                                 
                                                                                    <span >
                                                                                        <FormattedMessage id={this.props.Login.masterData.SelectedCerGen[0].stransactionstatus} message={this.props.Login.masterData.SelectedCerGen[0].stransactionstatus} />
                                                                                    </span>
                                                                                </span>
                                                                                <span className={`btn btn-outlined ${goodsInStatusCSS} btn-sm ml-3`}>
                                                                                    <FormattedMessage id={this.props.Login.masterData.SelectedCerGen[0].sdecision} message={this.props.Login.masterData.SelectedCerGen[0].sdecision} />
                                                                                </span> */}
                                                                            </h2>
                                                                        </Col>
                                                                        
                                                                        <Col md={6}>
                                                                            <div className="d-flex product-category justify-content-end icon-group-wrap" >
                                                                                {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                                                <Nav.Link name="GenerateCerificate"
                                                                                    //data-tip={this.props.intl.formatMessage({ id: "IDS_CERTIFY" })} 
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_GENERATECERTIFICATE" })}
                                                                                  //  data-for="tooltip-common-wrap"
                                                                                    hidden={this.state.userRoleControlRights.indexOf(certificateId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.onClickCertificate({ ...certificate, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                                >
                                                                                    <Certified className="custom_icons" width="20" height="20"
                                                                                        name="Certified"
                                                                                    //title={this.props.intl.formatMessage({ id: "IDS_CERTIFIED" })} 
                                                                                    />
                                                                                </Nav.Link>
                                                                                <Nav.Link name="Correction"
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_RECERTIFICATECORRECTION" })}
                                                                                   // data-for="tooltip-common-wrap"
                                                                                    //data-tip={this.props.intl.formatMessage({ id: "IDS_SENDTOCORRECTION" })} 
                                                                                    hidden={this.state.userRoleControlRights.indexOf(correctionId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.onClickCorrection({ ...correction, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                                >
                                                                                    <CertificateCorrectionicon className="custom_icons" width="20" height="20"
                                                                                        name="Correction"
                                                                                    />
                                                                                </Nav.Link>
                                                                                <Nav.Link name="SendCertificate"
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_SENDCERTIFICATE" })} 
                                                                                   // data-for="tooltip-common-wrap" 
                                                                                    hidden={this.state.userRoleControlRights.indexOf(sendId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.onClickSent({ ...sent, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                                >
                                                                                    <CertificateSend className="custom_icons" width="20" height="20"
                                                                                        name="Sent"
                                                                                    />
                                                                                </Nav.Link>
                                                                                <Nav.Link name="XML Export"
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_XMLEXPORT" })}
                                                                                    // data-for="tooltip-common-wrap" 
                                                                                    hidden={this.state.userRoleControlRights.indexOf(XmlId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.onClickXML({ ...xml, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                                >
                                                                                    {/* <xlsIcon className="custom_icons" width="20" height="20" 
                                                                                        name="XmlExport"
                                                                                        title={this.props.intl.formatMessage({id:"IDS_XMLEXPORT"})}/> */}
                                                                                    <FontAwesomeIcon icon={faFileCode} />

                                                                                </Nav.Link>
                                                                                <Nav.Link name="Report"
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_REGENREATEREPORT" })}
                                                                                    // data-for="tooltip-common-wrap" 
                                                                                    hidden={this.state.userRoleControlRights.indexOf(ReportId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.showConfirmAlert(this.props.Login.masterData.SelectedCerGen[0], 1, ReportId)}
                                                                                >
                                                                                    <CertificateSend className="custom_icons" width="20" height="20"
                                                                                        name="ReportView"
                                                                                    />
                                                                                </Nav.Link>
                                                                                <Nav.Link name="Nullified"
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_NULLIFY" })} 
                                                                                    //data-for="tooltip-common-wrap" 
                                                                                    hidden={this.state.userRoleControlRights.indexOf(nullifiedId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.onClickNullified({ ...nullified, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                                >
                                                                                    <NullificationIcon className="custom_icons" width="20" height="20"
                                                                                        name="Nullified"
                                                                                    />
                                                                                </Nav.Link>
                                                                                {/* <Nav.Link name="reportview"
                                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_VIEWREPORT" })} data-for="tooltip-common-wrap" hidden={this.state.userRoleControlRights.indexOf(nullifiedId) === -1}
                                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                                    onClick={() => this.onClickViewReport({ primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode })}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faEye}/>
                                                                                </Nav.Link> */}
                                                                                {/* </Tooltip> */}
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Subtitle>
                                                            </Card.Header>
                                                            <Card.Body className='form-static-wrap'>
                                                                <Card.Text>
                                                                    <Row>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_PRODUCTCATEGORY" message="Product Category" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sproductcatname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_GENERICPRODUCT" message="Generic Product" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sproductname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_BATCHREGISTRATIONDATETIME" message="Batch Registration Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sbatchregdate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_CHARGEBAND" message="Charge Band" /></FormLabel>
                                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].schargebandname}</ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_MANUFACTURENAME" message="Manufacturename" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].smanufname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_EPROTOCOL" message="e-Protocol" /></FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].seprotocolname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_STUDYPLANNAME" message="StudyPlan" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sspecname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_VERSION" message="Version" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].nversioncode}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_BATCHFILLINGLOTNO" message="Batch Filling Lot No" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sbatchfillinglotno}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_PACKINGLOTNO" message="Packing Lot No" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].spackinglotno === "" ? "-" : this.props.Login.masterData.SelectedCerGen[0].spackinglotno}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_MAHOLDERNAME" message="MA Holder Name" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].smahname}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel><FormattedMessage id="IDS_CONTAINERTYPE" message="Container Type" /></FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].scontainertype}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_NOOFCONTAINER" message="No Of Container" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].nnoofcontainer}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_VALIDITYSTARTDATETIME" message="Validity Start Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].svaliditystartdate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_EXPIRYDATETIME" message="Expiry Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sexpirydate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_LICENCENO" message="Licence No" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].slicencenumber}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].scertificatetype}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_DECISIONSTATUS" message="Decision Status" />
                                                                                </FormLabel>
                                                                                <DecisionStatus style={{ marginLeft: "0rem" }}
                                                                                    decisioncolor={this.props.Login.masterData.SelectedCerGen[0].decisioncolor}>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sdecision}
                                                                                </DecisionStatus>
                                                                                {/* <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sdecision}
                                                                                </ReadOnlyText> */}
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <div className="horizontal-line"></div>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_USERNAME" message="User Name" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].sloginid === null ? '-' : this.props.Login.masterData.SelectedCerGen[0].sloginid}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_USERROLE" message="User Role" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].suserrolename === null ? '-' : this.props.Login.masterData.SelectedCerGen[0].suserrolename}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_CERTIFIEDDATETIME" message="Certified Date" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].scertificatedate === null ? '-' : this.props.Login.masterData.SelectedCerGen[0].scertificatedate}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                        <Col md={12}>
                                                                            <FormGroup>
                                                                                <FormLabel>
                                                                                    <FormattedMessage id="IDS_CERTIFIEDCOMMENTS" message="Certified Comments" />
                                                                                </FormLabel>
                                                                                <ReadOnlyText>
                                                                                    {this.props.Login.masterData.SelectedCerGen[0].scomments === null || this.props.Login.masterData.SelectedCerGen[0].scomments === "" ? "-" : this.props.Login.masterData.SelectedCerGen[0].scomments}
                                                                                </ReadOnlyText>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Text>
                                                            </Card.Body>
                                                        </>
                                                        : ""}
                                                </Card>
                                            </ContentPanel>
                                            <ContentPanel >
                                                {this.props.Login.masterData.CerGen && this.props.Login.masterData.CerGen.length > 0 && this.props.Login.masterData.SelectedCerGen ?
                                                    <Card className="border-0">
                                                        <Card.Body className='p-0'>
                                                            <Row className='no-gutters'>
                                                                <Col md={12}>
                                                                    <Card className='p-0'>
                                                                        <Card.Body>
                                                                            {this.props.Login.masterData.CerGen && this.props.Login.masterData.CerGen.length > 0 && this.props.Login.masterData.SelectedCerGen ?
                                                                                <>
                                                                                    <CertificateGenerationTab
                                                                                        formatMessage={this.props.intl.formatMessage}
                                                                                        operation={this.props.Login.operation}
                                                                                        inputParam={this.props.Login.inputParam}
                                                                                        screenName={this.props.Login.screenName}
                                                                                        userInfo={this.props.Login.userInfo}
                                                                                        masterData={this.props.Login.masterData}
                                                                                        masterStatus={this.props.Login.masterStatus}
                                                                                        selectedRecord={this.props.Login.selectedRecord}
                                                                                        screenData={this.props.Login.screenData}
                                                                                        showAccordian={this.state.showAccordian}
                                                                                        userRoleControlRights={this.state.userRoleControlRights}
                                                                                        controlMap={this.state.controlMap}
                                                                                        dataState={this.props.Login.dataState}
                                                                                        onTabChange={this.onTabChange}
                                                                                        searchRef={this.searchRef}
                                                                                        handleExpandChange={this.handleExpandChange}
                                                                                        childList={this.props.Login.testMap || new Map()}
                                                                                        viewDownloadFile={this.props.viewAttachment}
                                                                                        viewReportFile={this.props.viewReport}
                                                                                        handleClickRegenrate={this.handleClickRegenrate}
                                                                                        settings = {this.props.Login.settings}
                                                                                    />
                                                                                </>
                                                                                : ""}
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                    : ""}
                                            </ContentPanel>
                                            {/* </Col> */}
                                        </div>
                                    </PerfectScrollbar>
                                </SplitterLayout>
                            </SplitterLayout >
                        </Col>
                    </Row>
                    {/* </div> */}
                </ListWrapper>
                {/* End of get display*/}
                {/* Start of Modal Sideout*/}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.showReport ?
                    <DocViewer file={fileViewUrl() + this.props.Login.ViewUrl} 
                    showReport = {this.props.Login.showReport}
                    closeModal = {this.closeModal}
                    type={"pdf"}>
                    </DocViewer>  
                    :""
                }

                {this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSaveContinue={this.state.showSaveContinue}
                        selectedRecord={this.state.selectedRecord || {}}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : ""}
                    />
                    : ""}
                {/* End of Modal Sideout for GoodsIn Creation */}
            </>
        );
    }



    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
        // setTimeout(() => { this._scrollBarRef.updateScroll() })
    };

    onClickXML = (Param) => {
        const ntransactionstatus = this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if (ntransactionstatus === transactionStatus.CERTIFIED
            || ntransactionstatus === transactionStatus.SENT) {
            let postParam = {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: "xmlExport",
                classUrl: "certificategeneration",
                inputData: {
                    "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                    "userinfo": this.props.Login.userInfo
                },
                masterData: this.props.Login.masterData,
                operation: "xml", postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.ncontrolCode,
                fromDate: Param.fromDate,
                toDate: Param.toDate,
                nversioncode: this.props.Login.masterData.SelectedCerGen[0].nversioncode,
                scertificatehistorycode: this.props.Login.masterData.SelectedCerGen[0].scertificatehistorycode
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: this.props.Login.screenName,
                        operation: 'certified'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.onClickXmlExport(inputParam)
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDANDSENTRECORDTOXMLEXPORT" }))
        }
    }


    /*onClickViewReport = (Param) =>{
        const ntransactionstatus = this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if (ntransactionstatus === transactionStatus.CERTIFIED || ntransactionstatus === transactionStatus.SENT) {
            
        const inputParam = {
            methodUrl: "viewCertificateReport",
            classUrl: "certificategeneration",
            inputData: {
                "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                "userinfo": this.props.Login.userInfo,
                //"ncontrolcode": Param.ncontrolCode
            },
            masterData: this.props.Login.masterData,
            operation: "viewreport",
            displayName: "Certificate Generation",
            //ncontrolcode: Param.ncontrolCode
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: this.props.Login.screenName,
                    operation: 'viewreport'
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.viewReport(inputParam)
        }
    }
    else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDTOCERTIFIED" }))
        }
    }*/

    
    /*onClickViewReport = (Param) =>{
        if (this.props.masterData["ReportHistory"]) {
        const inputParam = {
            methodUrl: "viewCertificateReport",
            classUrl: "certificategeneration",
            inputData: {
                // "nbatchreporthistorycode":
                "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                "userinfo": this.props.Login.userInfo,
                //"ncontrolcode": Param.ncontrolCode
            },
            masterData: this.props.Login.masterData,
            operation: "viewreport",
            displayName: "Certificate Generation",
            //ncontrolcode: Param.ncontrolCode
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: this.props.Login.screenName,
                    operation: 'viewreport'
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.viewReport(inputParam)
        }
    }
    else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDTOCERTIFIED" }))
        }
    }*/
    

    onClickNullified = (Param) => {
        const ntransactionstatus = this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if (ntransactionstatus === transactionStatus.CERTIFIED
            || ntransactionstatus === transactionStatus.SENT) {
            let postParam = {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
                // primaryKeyValue: fieldArray,
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: "insertCertificateNullified",
                classUrl: "certificategeneration",
                inputData: {
                    "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                    "userinfo": this.props.Login.userInfo,
                    "ncontrolcode": Param.ncontrolCode
                },
                masterData: this.props.Login.masterData,
                operation: "nullified",
                postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.ncontrolCode,
                fromDate: Param.fromDate,
                toDate: Param.toDate
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: this.props.Login.screenName,
                        operation: 'nullified'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.certifyBatch(inputParam);
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDTONULLIFIED" }))
        }
    }

    onClickSent = (Param) => {
        const ntransactionstatus = this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if (ntransactionstatus === transactionStatus.CERTIFIED || ntransactionstatus === transactionStatus.SENT) {
            let postParam = {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
                // primaryKeyValue: fieldArray,
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                methodUrl: "InsertCertificateSent",
                classUrl: "certificategeneration",
                inputData: {
                    "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                    "userinfo": this.props.Login.userInfo,
                    "ncontrolcode": Param.ncontrolCode,
                },
                masterData: this.props.Login.masterData,
                operation: "sent", postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.ncontrolCode,
                fromDate: Param.fromDate,
                toDate: Param.toDate
            }
            return rsapi.post("certificategeneration/getSentCertifiedStatus", {
                "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, "userinfo": this.props.Login.userInfo,
                "ncontrolcode": Param.ncontrolCode
            }).then(response => {
                if (response.status === 202) {
                    toast.warn(response.data);
                }
                else {
                    this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        response.data,
                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                        () => this.onClickSentesign(inputParam),
                        false,
                        undefined);

                    // this.confirmMessage.confirm(response.data, undefined, "ok", undefined, 
                    //                 () => this.onClickSentesign(inputParam), false, undefined);
                }
                // if (response.data === transactionStatus.SENT) {
                //     // let onClickCertificate = this.onClickSentesign(inputParam);
                //     this.confirmMessage.confirm("Re-Sent", "Do you Want Re-Sent!", undefined, "ok", undefined, () => this.onClickSentesign(inputParam), false, undefined);
                // } else {
                //     if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
                //         const updateInfo = {
                //             typeName: DEFAULT_RETURN,
                //             data: {
                //                 loadEsign: true,
                //                 screenData: { inputParam, masterData: this.props.Login.masterData },
                //                 openModal: true,
                //                 screenName: this.props.Login.screenName,
                //                 operation: 'certified'
                //             }
                //         }
                //         this.props.updateStore(updateInfo);
                //     } else {
                //         this.props.onClickCertificate(inputParam)
                //     }
                // }
            }).catch(error => {
                if (error.response.status === 500) {
                    toast.error(this.props.intl.formatMessage({ id: error.message }));
                }
                else {
                    toast.warn(this.props.intl.formatMessage({ id: error.response }));
                }
            })
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDRECORDTOSEND" }));
        }
    }

    onClickSentesign = (inputParam) => {
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputParam.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: this.props.Login.screenName,
                    operation: 'certified'
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.onClickCertificate(inputParam)
        }
    }


    onClickCorrection = (Param) => {
        const ntransactionstatus = this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if (ntransactionstatus === transactionStatus.CERTIFIED) {
            let postParam = {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: "InsertCertificateCorrection",
                classUrl: "certificategeneration",
                inputData: {
                    "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                    "userinfo": this.props.Login.userInfo
                },
                masterData: this.props.Login.masterData,
                operation: "correction", postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.correctionId,
                fromDate: Param.fromDate,
                toDate: Param.toDate
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true,
                        screenData: { inputParam, masterData: this.props.Login.masterData },
                        openModal: true,
                        screenName: this.props.Login.screenName,
                        operation: 'certified'
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.onClickCertificate(inputParam)
            }
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCERTIFIEDRECORDTORECERTIFIED" }));
        }
    }

    onClickCertificate = (Param) => {
        const ntransactionstatus = this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if (ntransactionstatus !== transactionStatus.CERTIFIED
            && ntransactionstatus !== transactionStatus.NULLIFIED
            && ntransactionstatus !== transactionStatus.SENT && ntransactionstatus !== transactionStatus.CERTIFICATECORRECTION) {
            let postParam = {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
                // primaryKeyValue: fieldArray,
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: "InsertCertificate",
                classUrl: "certificategeneration",
                inputData: {
                    "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                    "userinfo": this.props.Login.userInfo,
                    "ncontrolcode": Param.ncontrolCode
                },
                masterData: this.props.Login.masterData,
                operation: "certificate", postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.certificateId,
                fromDate: Param.fromDate,
                toDate: Param.toDate,
                showEsign: showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)
            }
            return rsapi.post("batchcreation/validateBatchComponentToComplete", {
                "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode,
                "userinfo": this.props.Login.userInfo
            }).then(response => {
                if (response.data === false) {
                    // let onClickCertificate = this.onClickSentesign(inputParam);
                    this.confirmMessage.confirm(this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }), this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),
                        //this.props.intl.formatMessage({ id: "IDS_TESTISNOTREACHFINALLEVEL.DOYOUWANTCONTINUE" }), 
                        this.props.intl.formatMessage({ id: "IDS_ADDEDTESTRESULTISNOTCOMPLETEDORAPPROVEDDOYOUWANTTOCONTINUE" }),
                        this.props.intl.formatMessage({ id: "IDS_OK" }),
                        this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                        () => this.checkEsignForActions(inputParam),
                        false, undefined);
                } else {
                    if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolCode)) {
                        const updateInfo = {
                            typeName: DEFAULT_RETURN,
                            data: {
                                loadEsign: true,
                                screenData: { inputParam, masterData: this.props.Login.masterData },
                                openModal: true,
                                screenName: this.props.Login.screenName,
                                operation: 'certified'
                            }
                        }
                        this.props.updateStore(updateInfo);
                    } else {
                        this.props.certifyBatch(inputParam)
                    }
                }
            })
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTAPPROVEDRECORDTOCERTIFIED" }))
        }
    }
    checkEsignForActions = (inputParam) => {
        if (inputParam.showEsign) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: this.props.Login.screenName,
                    operation: 'certified'
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.certifyBatch(inputParam)
        }
    }
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }
    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }
            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({ userRoleControlRights, controlMap });
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const Certificate = constructOptionList(this.props.Login.masterData.CertificateStatus || [], "nfiltertransstatus",
                "sfilterstatus", undefined, undefined, undefined);
            const CertificateList = Certificate.get("OptionList");

            if (this.props.Login.masterData.CertificateStatusDefault) {
                let selectedRecord = this.state.selectedRecord || [];
                if(this.props.Login.masterData.hasOwnProperty("FromDate")){
                    selectedRecord["fromdate"]=rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.FromDate )
                    selectedRecord["todate"]=rearrangeDateFormat(this.props.Login.userInfo,this.props.Login.masterData.ToDate )
            }
                    selectedRecord["nfiltertransstatus"] = { "value": this.props.Login.masterData.CertificateStatusDefault.ntransactionstatus, "label": this.props.Login.masterData.CertificateStatusDefault.sfilterstatus }
                this.setState({ certificateStatus: CertificateList, selectedRecord: selectedRecord });
            }
            else {
                this.setState({ selectedRecord: this.state.selectedRecord });
            }
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            // let selectedRecord = this.state.selectedRecord
            // let obj = this.convertDatetoString(this.props.Login.masterData && this.props.Login.masterData.FromDate?this.props.Login.masterData.FromDate:"",
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,this.props.Login.masterData.ToDate,this.props.Login.userInfo)
            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
                {
                    "label": "IDS_FILTERSTATUS",
                    // "value": this.props.Login.masterData.CertificateStatus ?
                    //     this.props.intl.formatMessage({ id: this.state.selectedRecord.nfiltertransstatus.label || "IDS_ALL" }) : 
                    "value": this.props.Login.masterData.TransactionStatus ? this.props.Login.masterData.TransactionStatus[0].sfilterstatus :
                        this.props.intl.formatMessage({ id: "IDS_ALL" })
                }
            );
        }
        return breadCrumbData;
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

   
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let operation = this.props.Login.operation;
        let showReport = this.props.Login.showReport;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation) {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            showReport = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, operation: operation,showReport }
        }
        this.props.updateStore(updateInfo);
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    onFilterSubmit = () => {
        this.reloadData(this.state.selectedRecord, true, "filtersubmit");
    }

    reloadData = (selectedRecord, isDateChange, operation) => {
        this.searchRef.current.value = "";
        let nfiltertransstatus = this.props.Login.masterData.TransactionStatus ?
            this.props.Login.masterData.TransactionStatus[0].ntransactionstatus
            : selectedRecord.nfiltertransstatus ? selectedRecord.nfiltertransstatus.value : [];
        // let obj = this.convertDatetoString(this.props.Login.masterData.FromDate?this.props.Login.masterData.FromDate:this.state.filterData[0].value, this.props.Login.masterData.ToDate?this.props.Login.masterData.ToDate:this.state.filterData[1].value)
        let fromDate1 = this.props.Login.masterData.FromDate ? this.props.Login.masterData.FromDate : this.state.filterData[0].value ;
        let toDate1 = this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.state.filterData[1].value
        let obj = convertDateValuetoString(fromDate1,toDate1,this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        let currentdate = "";
        const dataState= undefined;
        // if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
        //     fromDate = getStartOfDay(selectedRecord["fromdate"]);
        //     //fromDate = formatDate(selectedRecord["fromdate"]);
        // }
        // if (selectedRecord && selectedRecord["todate"] !== undefined) {
        //     toDate = getEndOfDay(selectedRecord["todate"]);
        //     //toDate = formatDate(selectedRecord["todate"]);
        // }
        if (operation === "filtersubmit") {
            // obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate,
            //     (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate)
            let fromDate2 = (selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate;
            let toDate2 = (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate;
            obj = convertDateValuetoString(fromDate2,toDate2,this.props.Login.userInfo)
            currentdate = isDateChange === true ? null : formatInputDate(new Date(), true);
            fromDate = obj.fromDate;
            toDate = obj.toDate;
            nfiltertransstatus = selectedRecord.nfiltertransstatus.value;
        }
        //else{

        //     fromDate=this.state.filterData[0].value,
        //     toDate=this.state.filterData[1].value,
        //           //  currentdate: isDateChange === true ? null : formatInputDate(new Date(), true),
        //     nfiltertransstatus=this.props.Login.masterData? 
        //             this.props.Login.masterData.TransactionStatus[0].ntransactionstatus:[]
        // }


        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: fromDate,
                toDate: toDate,
                nfiltertransstatus: nfiltertransstatus,
                currentdate: currentdate
                
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "CertificateGeneration",
            displayName: "IDS_CERTIFICATEGENERATION",
            userInfo: this.props.Login.userInfo,
            dataState:dataState
        };


        this.props.callService(inputParam);
    }

    onFilterComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            let selectedRecord = this.state.selectedRecord || [];
            selectedRecord[fieldName] = comboData
            this.setState({ selectedRecord: selectedRecord });
        }
    }


    handleExpandChange = (row, dataState) => {
        const viewParam = {
            userInfo: this.props.Login.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.Login.masterData
        };
        this.props.getTestParameter({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField], viewRow: row["dataItem"]
        });
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignforCerGen(inputParam, "openModal");
    }

    onClickReport = (selectedRecord, flag, ReportId) => {
        const reportParam = {
            classUrl: "certificategeneration",
            methodUrl: "reportGeneration",
            screenName: "CertificateGeneration",
            operation: "update",
            primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: ReportId,
            inputData: {
                sprimarykeyname: 'nreleasebatchcode',
                nprimarykey: selectedRecord.nreleasebatchcode,
                nreleasebatchcode: selectedRecord.nreleasebatchcode,
                ncertificatetypecode: selectedRecord.ndecisionstatuscode === transactionStatus.PASS && flag === 1 ? selectedRecord.ncertificatetypecode : -1,
                ndecisionstatus: selectedRecord.ndecisionstatuscode,
                ncontrolcode: ReportId,
                nreporttypecode: reportTypeEnum.BATCH,
                ncoareporttypecode: reportCOAType.BATCH,
                userinfo: this.props.Login.userInfo,
                nflag: flag,
                isregerate:true
            }
        };
        //this.props.onClickReport(reportParam)


        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ReportId)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam:reportParam, masterData: this.props.Login.masterData },
                    openModal: true,
                    screenName: this.props.Login.screenName,
                    operation: 'update'
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.onClickReport(reportParam);
        }
    }
    handleClickRegenrate = (inputData) => {
        let selectedRecord = inputData.selectedRecord;
        const inputParam = {
            classUrl: "certificategeneration",
            methodUrl: "Certificate",
            screenName: "CertificateGeneration",
            operation: "regenerate",
            primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo,
            ncontrolCode: this.state.controlMap.has("BatchNullified") && this.state.controlMap.get("BatchNullified").ncontrolcode,
            inputData: {
                sprimarykeyname: 'nreleasebatchcode',
                nprimarykey: selectedRecord.nreleasebatchcode,
                nreleasebatchcode: selectedRecord.nreleasebatchcode,
                ncertificatetypecode: this.props.Login.masterData.SelectedCerGen[0].ncertificatetypecode,
                nreporttypecode: reportTypeEnum.BATCH,
                ncoareporttypecode: reportCOAType.BATCH,
                nbatchreporthistorycode: selectedRecord.nbatchreporthistorycode,
                nreportdetailcode: selectedRecord.nreportdetailcode,
                sreportcomments: selectedRecord.sreportcomments,
                ssystemfilename: selectedRecord.ssystemfilename,
                userinfo: this.props.Login.userInfo,
                nflag: 1
            }
        };


        this.props.viewAttachment(inputParam)
    }
    showConfirmAlert = (selectedRecord, flag, ReportId) => {
        this.confirmMessage.confirm(
            "regenerate",//name
            this.props.intl.formatMessage({ id: "IDS_CONFIRMATION" }),//tittle
            this.props.intl.formatMessage({ id: "IDS_REGENERATECONFIRMATION" }),//message
            this.props.intl.formatMessage({ id: "IDS_OK" }),//do Label
            this.props.intl.formatMessage({ id: "IDS_CANCEL" }),//Do not label
            () => this.onClickReport(selectedRecord, flag, ReportId),
            undefined,
            () => this.closeConfirmAlert());
    }
    closeConfirmAlert = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showConfirmAlert: false }
        }
        this.props.updateStore(updateInfo);
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential, updateStore, certifyBatch, viewAttachment,
    getCerGenDetail, getTestParameter, onClickReport, filterTransactionList, onClickCertificate, onClickXmlExport, validateEsignforCerGen,viewReport
})(injectIntl(Certificategeneration));

