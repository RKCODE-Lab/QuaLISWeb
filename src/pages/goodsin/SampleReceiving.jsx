import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPrint } from '@fortawesome/free-solid-svg-icons';
import {
    showUnderDevelopment,
    callService, crudMaster, validateEsignCredential, updateStore, getGoodsInDetail, getGoodsInPrinterComboService,
    getGoodsInComboService, getChainCustodyComboDataService, filterColumnData,reloadGoodsIn
} from '../../actions';
import { showEsign, getControlMap, formatInputDate,  convertDateValuetoString, rearrangeDateFormat } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import SampleReceivingTabs from './SampleReceivingTabs';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import AddGoodsIn from './AddGoodsIn';
//import SampleReceivingFilter from './SampleReceivingFilter';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import { transactionStatus } from '../../components/Enumeration';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import { ReactComponent as GoodsReceivedIcon } from '../../assets/image/goods-received.svg';
import DateFilter from '../../components/DateFilter';
import AddPrinter from '../registration/AddPrinter';
import { Affix } from 'rsuite';
// import ReactTooltip from 'react-tooltip';
// import { Tooltip } from '@progress/kendo-react-tooltip';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SampleReceiving extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            selectedGoodsIn: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            showSaveContinue: true
        };
        // this.breadCrumbData = [];
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["nnoofpackages", "nrecipientcode", "nrmsno", "scomments",
            "sconsignmentno", "scouriername", "sdeptname",
            "sdisplaystatus", "sgoodsindate", "smanufname",
            "soutofhours", "sreceiveddate", "ssecurityrefno", "stzgoodsindate",
            "suserfullname"];
    }

    static getDerivedStateFromProps(props, state) {
        // if (props.Login.masterStatus !== "") {
        //     if (props.screenName === "IDS_GOODSIN") {
        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";

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

    render() {
        let goodsInStatusCSS = "";
        if (this.props.Login.masterData.SelectedGoodsIn && this.props.Login.masterData.SelectedGoodsIn.ntransactionstatus === 15) {
            goodsInStatusCSS = "outline-secondary";
        }
        else if (this.props.Login.masterData.SelectedGoodsIn && this.props.Login.masterData.SelectedGoodsIn.ntransactionstatus === 16) {
            goodsInStatusCSS = "outline-success";
        }

        const addId = this.state.controlMap.has("AddGoodsIn") && this.state.controlMap.get("AddGoodsIn").ncontrolcode;
        const editId = this.state.controlMap.has("EditGoodsIn") && this.state.controlMap.get("EditGoodsIn").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteGoodsIn") && this.state.controlMap.get("DeleteGoodsIn").ncontrolcode
        const receiveId = this.state.controlMap.has("ReceiveGoodsIn") && this.state.controlMap.get("ReceiveGoodsIn").ncontrolcode
        const printBarcodeId = this.state.controlMap.has("PrintBarcode") ? this.state.controlMap.get("PrintBarcode").ncontrolcode : -1;

        const addParam = {
            screenName: "IDS_GOODSIN", primaryeyField: "nrmsno",
            primaryKeyValue: undefined, operation: "create", inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo, ncontrolCode: addId
        };


        const editParam = {
            screenName: "IDS_GOODSIN", operation: "update", primaryKeyField: "nrmsno",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: editId
        };

        const deleteParam = { screenName: "IDS_GOODSIN", methodUrl: "GoodsIn", operation: "delete", selectedRecord: this.props.Login.masterData.SelectedGoodsIn, ncontrolCode: deleteId };
        const receiveParam = {
            screenName: "IDS_GOODSIN", methodUrl: "GoodsIn", selectedRecord: this.props.Login.masterData.SelectedGoodsIn,
            operation: "receive", ncontrolCode: receiveId
        };

        // let obj = this.convertDatetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
        //     this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate))
        let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
                                            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
                                            this.props.Login.userInfo)
       
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;

        const filterParam = {
            inputListName: "GoodsInList",
            selectedObject: "SelectedGoodsIn",
            primaryKeyField: "nrmsno",
            fetchUrl: "goodsin/getGoodsIn",
            fecthInputObject: { userinfo: this.props.Login.userInfo, fromDate, toDate },
            masterData: this.props.Login.masterData,
            unchangeList: ["FromDate", "ToDate"],
            searchFieldList: this.searchFieldList
        }
        const mandatoryFields = [{ "idsName": "IDS_MANUFACTURER", "dataField": "nmanufcode" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_RECIPIENT", "dataField": "nrecipientcode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
        { "idsName": "IDS_NOOFPACKAGES", "dataField": "nnoofpackages" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox" },
        { "idsName": "IDS_GOODSINDATE", "dataField": "dgoodsindate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
        { "idsName": "IDS_TIMEZONE", "dataField": "ntzgoodsindate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }];

        if (this.state.selectedRecord["noutofhours"] === transactionStatus.YES) {
            mandatoryFields.push({ "idsName": "IDS_SECURITYREFNO", "dataField": "ssecurityrefno"  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"});
        }
        //let breadCrumbDataDate = this.convertDatetoString(this.props.Login.masterData && this.props.Login.masterData.FromDate, this.props.Login.masterData && this.props.Login.masterData.ToDate)
        let breadCrumbDataDate = convertDateValuetoString(this.props.Login.masterData && this.props.Login.masterData.FromDate, 
                        this.props.Login.masterData && this.props.Login.masterData.ToDate,
                        this.props.Login.userInfo)
        
        const breadCrumbData = [
            {
                "label": "IDS_FROM",
                "value": breadCrumbDataDate.breadCrumbFrom
            },
            {
                "label": "IDS_TO",
                "value": breadCrumbDataDate.breadCrumbto
            }
        ];

        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }

                    {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* Start of get display*/}
                    <Row noGutters={true}>
                        <Col md={4}>
                            <ListMaster //formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_GOODSIN" })}
                                masterData={this.props.Login.masterData}
                                userInfo={this.props.Login.userInfo}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.GoodsInList}
                                getMasterDetail={(goodsIn) => this.props.getGoodsInDetail(goodsIn, fromDate, toDate,
                                    this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedGoodsIn}
                                primaryKeyField="nrmsno"
                                mainField="suserfullname"
                                firstField="nrmsno"
                                secondField="sdisplaystatus"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                hidePaging={false}
                                addId={addId}
                                openModal={() => this.props.getGoodsInComboService(addParam)}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData}
                                needAccordianFilter={false}

                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}


                                filterComponent={[
                                    {
                                        "IDS_FILTER":
                                            <DateFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                handleDateChange={this.handleDateChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
                                            />
                                    }
                                ]}
                            />
                        </Col>
                        <Col md={8}>
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.GoodsInList && this.props.Login.masterData.GoodsInList.length > 0 && this.props.Login.masterData.SelectedGoodsIn ?
                                        <>
                                            <Card.Header>
                                                <Card.Title className="product-title-main">{this.props.Login.masterData.SelectedGoodsIn.nrmsno}</Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex">
                                                            <h2 className="product-title-sub flex-grow-1">

                                                                <span className={`btn btn-outlined ${goodsInStatusCSS} btn-sm ml-3`}>
                                                                    {/* <i class="fas fa-check "></i>  */}
                                                                    <FormattedMessage id={this.props.Login.masterData.SelectedGoodsIn.sdisplaystatus} message={this.props.Login.masterData.SelectedGoodsIn.sdisplaystatus} />
                                                                </span>
                                                            </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                            <div className="d-flex product-category" style={{ float: "right" }}>

                                                                <Nav.Link name="editgoodsin" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                  //  data-for="tooltip_list_wrap"
                                                                    className="btn btn-circle outline-grey mr-2"
                                                                    onClick={() => this.props.getGoodsInComboService({ ...editParam, primaryKeyValue: this.props.Login.masterData.SelectedGoodsIn.nrmsno, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>

                                                                <Nav.Link name="deletegoodsin"
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                    className="btn btn-circle outline-grey mr-2"
                                                                //    data-for="tooltip_list_wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                    onClick={() => this.ConfirmDelete({ ...deleteParam })}>
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                    {/* <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" })}
                                                                            doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                            handleClickDelete={() => this.deleteOrReceiveRecord({ ...deleteParam })}
                                                                        /> */}
                                                                </Nav.Link>
                                                                <ContentPanel className="d-flex justify-content-end dropdown badget_menu icon-group-wrap">
                                                                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                        hidden={this.state.userRoleControlRights.indexOf(receiveId) === -1}
                                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_RECEIVEDGOODS" })}
                                                                     //   data-for="tooltip_list_wrap"
                                                                        onClick={() => this.deleteOrReceiveRecord({ ...receiveParam })}>
                                                                        {/* <Image src={checkedIcon} alt="filer-icon" width="20" height="20" /> */}
                                                                        <GoodsReceivedIcon className="custom_icons" width="20" height="20"
                                                                            name="goodsreceivedicon"
                                                                            //title={this.props.intl.formatMessage({ id: "IDS_RECEIVEDGOODS" })} 
                                                                            />
                                                                    </Nav.Link>

                                                                </ContentPanel>
                                                                <Nav.Link name="printbarcode"
                                                                    data-tip={this.props.intl.formatMessage({ id: "IDS_PRINTBARCODE" })}
                                                                 //   data-for="tooltip_list_wrap"
                                                                    hidden={this.state.userRoleControlRights.indexOf(printBarcodeId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2"

                                                                    onClick={() => this.props.getGoodsInPrinterComboService({
                                                                        selectedGoodsIn: this.props.Login.masterData.SelectedGoodsIn,
                                                                        ncontrolcode: printBarcodeId,
                                                                        userInfo: this.props.Login.userInfo
                                                                    })}
                                                                    // onClick={this.props.showUnderDevelopment}
                                                                >
                                                                    <FontAwesomeIcon icon={faPrint} />
                                                                </Nav.Link>
                                                            </div>
                                                            {/* </Tooltip> */}
                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className='form-static-wrap'>
                                                {/* <Card.Text> */}
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_RECIPIENT" message="Recipient" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.suserfullname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_DEPARTMENT" message="Division" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.sdeptname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.smanufname}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_NOOFPACKAGES" message="No. Of Packages" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.nnoofpackages}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_GOODSINDATE" message="GoodsIn Date" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.sgoodsindate}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_TIMEZONE" message="Time Zone" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.stzgoodsindate}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_OUTOFHOURS" message="Out Of Hours" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedGoodsIn.soutofhours}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_RECEIVEDDATETIME" message="Received Date" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedGoodsIn.sreceiveddate === null || this.props.Login.masterData.SelectedGoodsIn.sreceiveddate.length === 0
                                                                    ? '-' : this.props.Login.masterData.SelectedGoodsIn.sreceiveddate}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_COURIERCARRIER" message="Courier" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedGoodsIn.ncouriercode === -1 ? '-' : this.props.Login.masterData.SelectedGoodsIn.scouriername}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_CONSIGNMENTNO" message="Consignment No." /></FormLabel>
                                                            <ReadOnlyText>

                                                                {this.props.Login.masterData.SelectedGoodsIn.sconsignmentno === null || this.props.Login.masterData.SelectedGoodsIn.sconsignmentno.length === 0
                                                                    ? '-' : this.props.Login.masterData.SelectedGoodsIn.sconsignmentno}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_SECURITYREFNO" message="Security Ref No." /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedGoodsIn.ssecurityrefno === null || this.props.Login.masterData.SelectedGoodsIn.ssecurityrefno.length === 0
                                                                    ? '-' : this.props.Login.masterData.SelectedGoodsIn.ssecurityrefno}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_COMMENTS" message="Comments" /></FormLabel>
                                                            <ReadOnlyText>
                                                                {this.props.Login.masterData.SelectedGoodsIn.scomments === null || this.props.Login.masterData.SelectedGoodsIn.scomments.length === 0
                                                                    ? '-' : this.props.Login.masterData.SelectedGoodsIn.scomments}
                                                            </ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                {/* </Card.Text> */}

                                                <SampleReceivingTabs
                                                    operation={this.props.Login.operation}
                                                    inputParam={this.props.Login.inputParam}
                                                    screenName={this.props.Login.screenName}
                                                    userInfo={this.props.Login.userInfo}
                                                    masterData={this.props.Login.masterData}
                                                    crudMaster={this.props.crudMaster}
                                                    errorCode={this.props.Login.errorCode}
                                                    masterStatus={this.props.Login.masterStatus}
                                                    openChildModal={this.props.Login.openChildModal}
                                                    updateStore={this.props.updateStore}
                                                    selectedRecord={this.props.Login.selectedRecord}
                                                    getChainCustodyComboDataService={this.props.getChainCustodyComboDataService}
                                                    ncontrolCode={this.props.Login.ncontrolCode}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    esignRights={this.props.Login.userRoleControlRights}
                                                    screenData={this.props.Login.screenData}
                                                    validateEsignCredential={this.props.validateEsignCredential}
                                                    loadEsign={this.props.Login.loadEsign}
                                                    controlMap={this.state.controlMap}
                                                    selectedId={this.props.Login.selectedId}
                                                    fromDate={fromDate}
                                                    toDate={toDate}
                                                    dataState={this.props.Login.dataState}
                                                    timeZoneList={this.props.Login.timeZoneList || []}
                                                    currentTime={this.props.Login.currentTime}
                                                    settings = {this.props.Login.settings}
                                                />
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col>
                    </Row>
                    {/* </div> */}
                </ListWrapper>
                {/* End of get display*/}

                {/* Start of Modal Sideout*/}
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.Login.openModal ?
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.Login.operation === "printer" ?
                            this.onSavePrinterClick : this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        showSaveContinue={this.state.showSaveContinue}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.props.Login.operation === "printer" ?
                            [{ "idsName": "IDS_PRINTER", "dataField": "sprintername" }]
                            : mandatoryFields}
                        buttonLabel = { this.props.Login.operation === "printer" ?"print":undefined}
                        loginoperation = { this.props.Login.operation === "printer" ? true : false }
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.Login.operation === "printer" ?
                                <AddPrinter
                                    printer={this.props.Login.printerList}
                                    selectedPrinterData={this.state.selectedRecord || {}}
                                    PrinterChange={this.onComboChange}
                                />
                                : <AddGoodsIn
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onInputOnChange={this.onInputOnChange}
                                    onNumericInputOnChange={this.onNumericInputOnChange}
                                    onComboChange={this.onComboChange}
                                    handleDateChange={this.handleDateChange}
                                    operation={this.props.Login.operation}
                                    inputParam={this.props.Login.inputParam}
                                    manufacturerList={this.props.Login.manufacturerList || []}
                                    courierList={this.props.Login.courierList || []}
                                    recipientList={this.props.Login.recipientList || []}
                                    timeZoneList={this.props.Login.timeZoneList || []}
                                    userInfo={this.props.Login.userInfo}
                                    currentTime={this.props.Login.currentTime}
                                />}
                    /> : ""}
                {/* End of Modal Sideout for GoodsIn Creation */}
            </>
        );
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
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }

    }


    ConfirmDelete = (deleteParam) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteOrReceiveRecord(deleteParam));
    };

    generateBreadCrumData() {
        const breadCrumbData = [];
        //let selectedRecord = this.state.selectedRecord
       //  let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate)
          
       if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            //let obj = this.convertDatetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate);
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, 
                                               this.props.Login.masterData.ToDate,
                                               this.props.Login.userInfo);         
            
            breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                },
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

        if (selectedRecord["sgoodsindate"])
            selectedRecord["dgoodsindate"] = rearrangeDateFormat(this.props.Login.userInfo, selectedRecord["sgoodsindate"]);

        let operation = this.props.Login.operation;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "receive") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, operation: operation }
        }
        this.props.updateStore(updateInfo);

    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;

        if (fieldName === "nrecipientcode") {
            if (comboData === null) {
                selectedRecord["sdeptname"] = "";
                //selectedRecord["sdeptcode"] = 0;
            }
            else {
                this.props.Login.recipientList.map(dataItem => {
                    if (dataItem.value === comboData.value) {
                        selectedRecord["sdeptname"] = dataItem.item.sdeptname
                        //selectedRecord["ndeptcode"] = dataItem.item.ndeptcode;
                    }
                    return null;
                })
            }
        }
        else if (fieldName === "ntzgoodsindate") {
            if (comboData === null) {
                selectedRecord["ntzgoodsindate"] = 0;
                selectedRecord["stzgoodsindate"] = "";
            }
            else {
                selectedRecord["stzgoodsindate"] = comboData.label;
            }
        }

        this.setState({ selectedRecord });
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
        this.reloadData(true);
    }

    reloadData = (isFilterSubmit) => {
       
        this.searchRef.current.value = "";
        // let obj = this.convertDatetoString(selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
        //     selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate))
    
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        if (isFilterSubmit) {
            let selectedRecord = this.state.selectedRecord || {};
            if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
                fromDate = selectedRecord["fromdate"];
            }
            if (selectedRecord && selectedRecord["todate"] !== undefined) {
                toDate = selectedRecord["todate"];
            }
        }
        //let obj = this.convertDatetoString(fromDate, toDate); 
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);   
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                currentDate:null
                //currentdate: isDateChange === true ? null : formatInputDate(new Date(), true)
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "GoodsIn",
            displayName: "IDS_GOODSIN",
            userInfo: this.props.Login.userInfo
        };
        //this.props.callService(inputParam);
        this.props.reloadGoodsIn(inputParam);
    }

    onSaveClick = (saveType, formRef) => {

        if (this.state.selectedRecord["nnoofpackages"] <= 0) {
            return (toast.warn(this.props.intl.formatMessage({ id: "IDS_ENTERTHEPACKAGEGREATERTHANZERO" })));
        }
        let inputData = [];
        inputData["ncontrolcode"] = this.props.Login.ncontrolCode;
        inputData["userinfo"] = this.props.Login.userInfo;
        // let obj = this.convertDatetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
        //     this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate))
         let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate,this.props.Login.userInfo);
      
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;

        let postParam = undefined;

        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "GoodsInList", selectedObject: "SelectedGoodsIn", primaryKeyField: "nrmsno", unchangeList: ["FromDate", "ToDate"] };
            inputData["goodsin"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));
        }
        else {
            //add               
            inputData["goodsin"] = { "nsitecode": this.props.Login.userInfo.ntranssitecode };
        }

        inputData["goodsin"]["noutofhours"] = this.state.selectedRecord["noutofhours"] ? this.state.selectedRecord["noutofhours"] : transactionStatus.NO;
        inputData["goodsin"]["nmanufcode"] = this.state.selectedRecord["nmanufcode"] ? this.state.selectedRecord["nmanufcode"].value : -1;
        inputData["goodsin"]["nrecipientcode"] = this.state.selectedRecord["nrecipientcode"] ? this.state.selectedRecord["nrecipientcode"].value : -1;
        //inputData["goodsin"]["ndeptcode"] = this.state.selectedRecord["ndeptcode"] ? this.state.selectedRecord["ndeptcode"] : -1;
        inputData["goodsin"]["ncouriercode"] = this.state.selectedRecord["ncouriercode"] ? this.state.selectedRecord["ncouriercode"].value : transactionStatus.NA;
        inputData["goodsin"]["sconsignmentno"] = this.state.selectedRecord["sconsignmentno"] || "";
        inputData["goodsin"]["dgoodsindate"] = this.state.selectedRecord["dgoodsindate"];
        inputData["goodsin"]["nnoofpackages"] = this.state.selectedRecord["nnoofpackages"];
        inputData["goodsin"]["ssecurityrefno"] = this.state.selectedRecord["ssecurityrefno"] || "";
        inputData["goodsin"]["scomments"] = this.state.selectedRecord["scomments"] || "";
        inputData["goodsin"]["ntzgoodsindate"] = this.state.selectedRecord["ntzgoodsindate"] ? this.state.selectedRecord["ntzgoodsindate"].value : 1;
        inputData["goodsin"]["stzgoodsindate"] = this.state.selectedRecord["stzgoodsindate"] || "";

        const goodsInDate = inputData["goodsin"]["dgoodsindate"];

        //need this conversion when the datatype of the field is 'Instant'
        inputData["goodsin"]["dgoodsindate"] = formatInputDate(goodsInDate, false);

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "GoodsIn",
            displayName: "IDS_GOODSIN",
            inputData: inputData, postParam, searchRef: this.searchRef,
            operation: this.props.Login.operation, saveType, formRef
        }
      
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: "IDS_GOODSIN",
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {

            const selectedRecord = {
                "dgoodsindate": this.props.Login.currentTime,//new Date(),
                "stzgoodsindate": this.props.Login.userInfo.stimezoneid,
                "ntzgoodsindate": { "value": this.props.Login.userInfo.ntimezonecode, "label": this.props.Login.userInfo.stimezoneid },
            };
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal", selectedRecord);
        }
    }

    onSavePrinterClick = () => {
        const inputParam = {
            classUrl: 'barcode',
            methodUrl: 'Barcode',
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                nrmsno: this.props.Login.dataToPrint,
                sprintername: this.state.selectedRecord.sprintername ?
                    this.state.selectedRecord.sprintername.value : '',
                userinfo: this.props.Login.userInfo,
                ncontrolcode: this.props.Login.ncontrolcode
            },
            operation: 'printer'
        };

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: 'printer'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    deleteOrReceiveRecord = (deleteParam) => {

        if (deleteParam.selectedRecord.ntransactionstatus === transactionStatus.GOODS_RECEIVED) {
            let message = "IDS_CANNOTDELETERECIVEDGOODS";
            if (deleteParam.operation === "receive") {
                message = "IDS_GOODSALREADYRECEIVED";
            }
            toast.warn(this.props.intl.formatMessage({ id: message }));
        }
        else {
            let validUser = true;
            if (deleteParam.operation === "receive" && deleteParam.selectedRecord.nrecipientcode !== this.props.Login.userInfo.nusercode) {
                validUser = false;
            }

            if (validUser) {
                // let obj = this.convertDatetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
                //     this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate))
                
                let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
                                                    this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
                                                    this.props.Login.userInfo)
                   
                let fromDate = obj.fromDate;
                let toDate = obj.toDate;

                const postParam = {
                    inputListName: "GoodsInList", selectedObject: "SelectedGoodsIn",
                    primaryKeyField: "nrmsno",
                    primaryKeyValue: deleteParam.selectedRecord.nrmsno,
                    fetchUrl: "goodsin/getGoodsIn",
                    fecthInputObject: { userinfo: this.props.Login.userInfo, fromDate, toDate },
                    unchangeList: ["FromDate", "ToDate"]
                }

                const inputParam = {
                    classUrl: this.props.Login.inputParam.classUrl,
                    methodUrl: "GoodsIn",
                    displayName: "IDS_GOODSIN",
                    inputData: {
                        "ncontrolcode": deleteParam.ncontrolCode,
                        "goodsin": deleteParam.selectedRecord,
                        fromDate, toDate,
                        "userinfo": this.props.Login.userInfo
                    },
                    operation: deleteParam.operation, postParam
                }

                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: "IDS_GOODSIN",
                            operation: deleteParam.operation, selectedId: deleteParam.selectedRecord.nrmsno
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                }
            }
            else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_INVALIDUSERTORECEIVE" }));
            }
        }
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
        this.props.validateEsignCredential(inputParam, "openModal");
    }
    // convertDatetoString(startDateValue, endDateValue) {
    //     const startDate = startDateValue ? new Date(startDateValue) : new Date();
    //     const endDate = endDateValue ? new Date(endDateValue) : new Date();

    //     const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
    //     const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
    //     const prevDay = validateTwoDigitDate(String(startDate.getDate()));
    //     const currentDay = validateTwoDigitDate(String(endDate.getDate()));

    //     const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
    //     const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
    //     const fromDate = fromDateOnly + "T00:00:00";
    //     const toDate = toDateOnly + "T23:59:59";
    //     return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
    // }

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
    callService, crudMaster, validateEsignCredential, updateStore, getGoodsInPrinterComboService,
    getGoodsInDetail, getGoodsInComboService, getChainCustodyComboDataService, filterColumnData,
    showUnderDevelopment, reloadGoodsIn
})(injectIntl(SampleReceiving));

