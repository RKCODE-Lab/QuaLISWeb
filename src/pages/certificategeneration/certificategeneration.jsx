import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import {callService, crudMaster, validateEsignCredential, updateStore, getCerGenDetail,
    getTestParameter, onClickCertificate,filterTransactionList} from '../../actions';
import { showEsign, getControlMap, getStartOfDay, getEndOfDay, formatInputDate} from '../../components/CommonScript';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../components/Enumeration';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { ListWrapper } from '../../components/client-group.styles';
import SplitterLayout from "react-splitter-layout";
import { ReadOnlyText, ContentPanel } from '../../components/App.styles';
import CertificateGenerationFilter from './CertificateGenerationFilter';
import CertificateGenerationTab from './CertificateGenerationTab';
import { getStatusIcon } from '../../components/StatusIcon';
import TransactionListMaster from '../../components/TransactionListMaster';
import PerfectScrollbar from 'react-perfect-scrollbar';
import rsapi from '../../rsapi';
import { intl } from '../../components/App';

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
            showSaveContinue: true
        };
        this.breadCrumbData = [];
        this.searchRef = React.createRef();
        this.searchFieldList = [
            "suserrolename"];
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.screenName === "CertificateGeneration") {
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
        const {searchedData, CerGen} = this.props.Login.masterData;
        let goodsInStatusCSS = "";
        if (this.props.Login.masterData.SelectedCerGen && this.props.Login.masterData.SelectedCerGen.ntransactionstatus === 15) {
            goodsInStatusCSS = "outline-secondary";
        }
        else {
            goodsInStatusCSS = "outline-success";
        }

        const certificateId = this.state.controlMap.has("BatchCertificate") && this.state.controlMap.get("BatchCertificate").ncontrolcode;
        const correctionId = this.state.controlMap.has("BatchCorrection") && this.state.controlMap.get("BatchCorrection").ncontrolcode;
        const sendId = this.state.controlMap.has("BatchSendCertificate") && this.state.controlMap.get("BatchSendCertificate").ncontrolcode
        const XmlId = this.state.controlMap.has("BatchXMLExport") && this.state.controlMap.get("BatchXMLExport").ncontrolcode
        const ReportId = this.state.controlMap.has("BatchNullified") && this.state.controlMap.get("BatchNullified").ncontrolcode
        const nullifiedId = this.state.controlMap.has("BatchReport") && this.state.controlMap.get("BatchReport").ncontrolcode


        const addParam = {
            screenName: "IDS_CERTIFICATEGENERATION", primaryeyField: "nreleasebatchcode",
            primaryKeyValue: undefined, operation: "create", inputParam: this.props.Login.inputParam,
            userInfo: this.props.Login.userInfo, ncontrolCode: certificateId
        };

        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || new Date(this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || new Date(this.props.Login.masterData.ToDate);
        }

        const certificate = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: certificateId,fromDate,toDate
        };
        const correction = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: correctionId,fromDate,toDate
        }; 
         const sent = {
            screenName: "CertificateGeneration", operation: "update", primaryKeyField: "nreleasebatchcode",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo,
            ncontrolCode: sendId,fromDate,toDate
        };



        const deleteParam = { screenName: "GoodsIn", methodUrl: "GoodsIn", operation: "delete", selectedRecord: this.props.Login.masterData.SelectedGoodsIn, ncontrolCode: sendId };
        const receiveParam = {
            screenName: "GoodsIn", methodUrl: "GoodsIn", selectedRecord: this.props.Login.masterData.SelectedGoodsIn,
            operation: "receive", ncontrolCode: XmlId
        };



        const filterParam = {
                                inputListName: "CerGen", 
                                selectedObject: "SelectedCerGen", 
                                primaryKeyField: "nreleasebatchcode",
                                fetchUrl: "certificategeneration/getCertificateGeneration", 
                                fecthInputObject: { userinfo: this.props.Login.userInfo, 
                                                                fromDate, toDate },
                                masterData: this.props.Login.masterData, unchangeList: ["FromDate", "ToDate"], 
                                searchFieldList:this.searchFieldList
                            }
       
       

        const breadCrumbData = this.state.filterData || [];
        this.confirmMessage = new ConfirmMessage();
        return (
            <>
             <ListWrapper className="client-listing-wrap mtop-4 screen-height-window">
                 
               {breadCrumbData.length > 0 ? 
                <BreadcrumbComponent breadCrumbItem={breadCrumbData}/> :""
               }
             
                {/* <div className="client-listing-wrap mtop-4"> */}
                    {/* Start of get display*/}
                    <Row noGutters={true}>
                    <Col md={4} Col md={12} className="parent-port-height sticky_head_parent" ref={(parentHeight) => { this.parentHeight = parentHeight }}>
                        
                        <SplitterLayout borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={30}
                                >
                                   
                        <TransactionListMaster
                                      //  paneHeight={this.state.parentHeight}
                                        masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.CerGen}
                                        selectedMaster={this.props.Login.masterData.SelectedCerGen}
                                        primaryKeyField="nreleasebatchcode"
                                        getMasterDetail={(CerGen) => this.props.getCerGenDetail(CerGen, fromDate, toDate,
                                            this.props.Login.userInfo, this.props.Login.masterData)}
                                        inputParam={""}
                                        mainField="scertificatehistorycode"
                                        selectedListName="SelectedCerGen"
                                        objectName="Select"
                                        listName="IDS_CERTIFITEGENERATION"
                                        needValidation={false}
                                        subFields={[{2:"sproductname"},{2:"smanufname"},{1:"IDS_RELEASEBATCHCODE",2:"nreleasebatchcode"},{2:"stransactionstatus"}] || []}
                                        needFilter={true}
                                        needMultiSelect={false}
                                        subFieldsLabel={true}
                                        mainFieldLabel={"Certificate Version"}
                                        openFilter={this.openFilter}
                                        closeFilter={this.closeFilter}
                                        onFilterSubmit={this.onFilterSubmit}
                                        filterColumnData={this.props.filterTransactionList}
                                        searchListName="searchedData"
                                        searchRef={this.searchRef}
                                        filterParam={filterParam}
                                        filterComponent={[
                                            {
                                                "IDS_FILTER":
                                                    <CertificateGenerationFilter
                                                        selectedRecord={this.state.selectedRecord || {}}
                                                        handleDateChange={this.handleDateChange}
                                                        fromDate={fromDate}
                                                        toDate={toDate}
                                                        userInfo ={this.props.Login.userInfo}
                                                    />
                                            }
                                        ]}
                                       
                                       
                                    />  
                                    
                       
                          {/* </Col> */}
                         <SplitterLayout vertical borderColor="#999" percentage={true} primaryIndex={1} secondaryInitialSize={400}
                                        customClassName="fixed_list_height">
                        <PerfectScrollbar>
                         {/* <Col md={8}>  */}
                         <div className="card_group">
                        
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.CerGen && this.props.Login.masterData.CerGen.length > 0 && this.props.Login.masterData.SelectedCerGen ?
                                        <>
                                            <Card.Header>
                                                <Card.Title className="product-title-main">{this.props.Login.masterData.SelectedCerGen[0].scertificatetype}/{this.props.Login.masterData.SelectedCerGen[0].scertificatehistorycode}</Card.Title>
                                                <Card.Subtitle className="text-muted font-weight-normal">
                                                    <Row>
                                                        <Col md={10} className="d-flex">
                                                           {/* <ContentPanel className="d-flex product-category">
                                                              <MediaLabel className={`btn btn-outlined ${ selectedTest.ntransactionstatus===1 ? "outline-success":"outline-secondary" } btn-sm ml-3` }>
                                                                  { selectedTest.ntransactionstatus===1 && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> }
                                                                   {selectedTest.stransactionstatus}
                                                               </MediaLabel>
                                                            <MediaLabel className={ `btn-normal ${ selectedTest.naccredited===70 ? "outline-success":"normal-danger" } btn-sm mr-3` }>
                                                                 {selectedTest.saccredited}
                                                             </MediaLabel>
                                                         </ContentPanel> */}
                                                            <h2 className="product-title-sub flex-grow-1">

                                                                
                                                               
                                                               <span className={`btn btn-outlined ${goodsInStatusCSS} btn-sm ml-3`} >
                                                                   {getStatusIcon(this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode)}
                                                                   <span >
                                                                    <FormattedMessage id={this.props.Login.masterData.SelectedCerGen[0].stransactionstatus} message={this.props.Login.masterData.SelectedCerGen[0].stransactionstatus} />

                                                                </span>
                                                                </span>
                                                                <span className={`btn btn-outlined ${goodsInStatusCSS} btn-sm ml-3`}>
                                                                  {getStatusIcon(this.props.Login.masterData.SelectedCerGen[0].ndecisionstatuscode)}
                                                                    <FormattedMessage id={this.props.Login.masterData.SelectedCerGen[0].sdecision} message={this.props.Login.masterData.SelectedCerGen[0].sdecision} />

                                                                </span>

                                                            </h2>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="d-flex product-category" style={{ float: "right" }}>
                                                                <Nav.Link name="GenerateCerificate" hidden={this.state.userRoleControlRights.indexOf(certificateId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.onClickCertificate({ ...certificate, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>

                                                                <Nav.Link name="Correction" hidden={this.state.userRoleControlRights.indexOf(correctionId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.onClickCorrection({ ...correction, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>

                                                                <Nav.Link name="SendCertificate" hidden={this.state.userRoleControlRights.indexOf(sendId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.onClickSent({ ...sent, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>
                                                                <Nav.Link name="XML Export" hidden={this.state.userRoleControlRights.indexOf(XmlId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.props.onClickCertificate({ ...correction, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>
                                                                <Nav.Link name="Report" hidden={this.state.userRoleControlRights.indexOf(ReportId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.props.onClickCertificate({ ...correction, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>
                                                                <Nav.Link name="Nullified" hidden={this.state.userRoleControlRights.indexOf(nullifiedId) === -1}
                                                                    className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                    onClick={() => this.props.onClickCertificate({ ...correction, primaryKeyValue: this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, fromDate, toDate })}
                                                                >
                                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                                </Nav.Link>
                                                            
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className = 'form-static-wrap'>
                                            <Card.Text>
                                                        <Row>                                              
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_BATCHREGISTRATIONDATE" message="Batch Registration Date"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].sbatchregdate}</ReadOnlyText>
                                                                    </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_GENERICPRODUCT" message="Generic Product"/></FormLabel>
                                                                    <ReadOnlyText>
                                                                         {this.props.Login.masterData.SelectedCerGen[0].sproductname }
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_MANUFACTURENAME" message="Manufacturename"/></FormLabel>
                                                                    <ReadOnlyText>
                                                                            {this.props.Login.masterData.SelectedCerGen[0].smanufname }                                                        
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_STUDYPLANNAME" message="StudyPlan"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].sspecname}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_BATCHFILLINGLOTNO" message="Batch Filling Lot No"/></FormLabel>
                                                                    <ReadOnlyText>
                                                                    {this.props.Login.masterData.SelectedCerGen[0].sbatchfillinglotno } 
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                
                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_PACKINGLOTNO" message="Packing Lot No"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].spackinglotno }
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_MAHOLDERNAME" message="MA Holder Name"/></FormLabel>
                                                                    <ReadOnlyText>                                                        
                                                                        {this.props.Login.masterData.SelectedCerGen[0].smahname } 
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_NOOFCONTAINER" message="No Of Container"/></FormLabel>
                                                                    <ReadOnlyText>
                                                                         {this.props.Login.masterData.SelectedCerGen[0].nnoofcontainer} 
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_VALIDITYSTARTDATE" message="Validity Start Date"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].svaliditystartdate}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_EXPIRYDATE" message="Expiry Date"/></FormLabel>
                                                                    <ReadOnlyText>
                                                                         {this.props.Login.masterData.SelectedCerGen[0].sexpirydate }
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                      
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_LICENCENO" message="Licence No"/></FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.SelectedCerGen[0].slicencenumber } 
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                
                                                          
                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].scertificatetype}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                
                                                            
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_DECISIONSTATUS" message="Decision Status"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].sdecision}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_USERNAME" message="User Name"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].sloginid}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_USERROLE" message="User Role"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].suserrolename}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_CERTIFIEDDATE" message="Certified Date"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].scertificatedate}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                                
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_CERTIFIEDCOMMENTS" message="Certified Comments"/></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedCerGen[0].scomments===null?"-":this.props.Login.masterData.SelectedCerGen.scomments}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            
                                                            
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <div className="horizontal-line"></div>
                                                            </Col>
                                                        </Row>
                                                                              
                                                    </Card.Text>
                                                       
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                            <ContentPanel >
                              <Card className="border-0">
                                   <Card.Body className='p-0'>
                                        <Row className='no-gutters'>
                                          <Col md={12}>
                                                <Card className='p-0'>
                                                   <Card.Body>
                                                       {this.props.Login.masterData.CerGen && this.props.Login.masterData.CerGen.length > 0 && this.props.Login.masterData.SelectedCerGen ?
                                                            <> <CertificateGenerationTab
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
                                                                      //selectedId={this.props.Login.selectedId}
                                                                      userRoleControlRights={this.state.userRoleControlRights}
                                                                      controlMap={this.state.controlMap}
                                                                      dataState={this.props.Login.dataState}
                                                                      onTabChange={this.onTabChange}
                                                                      searchRef = {this.searchRef}
                                                                      handleExpandChange={this.handleExpandChange}
                                                                      childList ={this.props.Login.TestMap || new Map()}
                                                                       /></>
                                                                           :""
                                                                        }
                                                                     </Card.Body>
                                                                   </Card>
                                                                 </Col>
                                                             </Row>
                                                            </Card.Body>
                                                        </Card>
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
                        /> :""}
                {/* End of Modal Sideout for GoodsIn Creation */}
            </>
        );
    }
    onClickSent=(Param)=>{

        const ntransactionstatus=this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if(ntransactionstatus===transactionStatus.CERTIFICATE||ntransactionstatus===transactionStatus.SEND ){
            let postParam =  {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
               // primaryKeyValue: fieldArray,
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                methodUrl: "InsertCertificateSent",
                classUrl: "certificategeneration",
                inputData: { "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, 
                            "userinfo": this.props.Login.userInfo},
                            masterData:this.props.Login.masterData,
                operation: "certificate", postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.sendId,
                fromDate: Param.fromDate,
                toDate:Param.toDate
            }
             
            return rsapi.post("certificategeneration/getSentCertifiedStatus", {"nreleasebatchcode":this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode ,"userinfo": this.props.Login.userInfo 
            }) .then(response => {
               if(response.data===transactionStatus.SEND){
               // let onClickCertificate = this.onClickSentesign(inputParam);
                this.confirmMessage.confirm("Re-Sent", "Do you Want Re-Sent!",  undefined, "ok", undefined, () => this.onClickSentesign(inputParam), false, undefined);
               }else{
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolcode)) {
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
               

            }) .catch(error => {
                if (error.response.status === 500) {
                    toast.error(intl.formatMessage({ id: error.message }));
                }
                else {

                    toast.warn(intl.formatMessage({ id: error.response }));
                }

            })
        }else{
      toast.info("Select certified record to Sent");
        }
    }

    onClickSentesign=(inputParam)=>{
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

    
    onClickCorrection=(Param)=>{
        const ntransactionstatus=this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
        if(ntransactionstatus===transactionStatus.CERTIFICATE ||
            ntransactionstatus!==transactionStatus.SEND){
             
                let postParam =  {
                    inputListName: "CerGen", selectedObject: "SelectedCerGen",
                    primaryKeyField: "nreleasebatchcode",
                   // primaryKeyValue: fieldArray,
                    fetchUrl: "certificate/getCertificateGeneration",
                    fecthInputObject: { userinfo: this.props.Login.userInfo },
                }
                const inputParam = {
                    methodUrl: "InsertCertificateCorrection",
                    classUrl: "certificategeneration",
                    inputData: { "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, 
                                "userinfo": this.props.Login.userInfo},
                                masterData:this.props.Login.masterData,
                    operation: "certificate", postParam,
                    displayName: "Certificate Generation",
                    ncontrolcode: Param.correctionId,
                    fromDate: Param.fromDate,
                    toDate:Param.toDate
                }
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.ncontrolcode)) {
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
              
        }else{
      toast.info("Select certified record to Re-Certified");
        }
    }

    onClickCertificate=(Param)=>{
    const ntransactionstatus=this.props.Login.masterData.SelectedCerGen[0].nbatchstatuscode;
    if(ntransactionstatus!==transactionStatus.CERTIFICATE 
        &&ntransactionstatus!==transactionStatus.NULLIFIED
        &&ntransactionstatus!==transactionStatus.SEND&&ntransactionstatus!==transactionStatus.CERTIFICATECORRECTION ){
         
            let postParam =  {
                inputListName: "CerGen", selectedObject: "SelectedCerGen",
                primaryKeyField: "nreleasebatchcode",
               // primaryKeyValue: fieldArray,
                fetchUrl: "certificate/getCertificateGeneration",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }
            const inputParam = {
                methodUrl: "InsertCertificate",
                classUrl: "certificategeneration",
                inputData: { "nreleasebatchcode": this.props.Login.masterData.SelectedCerGen[0].nreleasebatchcode, 
                            "userinfo": this.props.Login.userInfo},
                            masterData:this.props.Login.masterData,
                operation: "certificate", postParam,
                displayName: "Certificate Generation",
                ncontrolcode: Param.certificateId,
                fromDate: Param.fromDate,
                toDate:Param.toDate
            }
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, Param.certificateId)) {
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
          
    }else{
  toast.info("Select Approved record to certificate")
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
        if (this.props.Login.masterData !== previousProps.Login.masterData){
            const filterData = this.generateBreadCrumData();
            this.setState({filterData});
        }

        
    //     if (this.props.Login.operation === "create" && this.props.Login.inputParam.saveType === 2) {
    //         this.props.Login.inputParam.formRef.current && this.props.Login.inputParam.formRef.current.reset();
    //    }
    }    
    
    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
       
           breadCrumbData.push(
                {
                    "label": "IDS_FROM",
                    "value": (this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) 
                                    || this.props.Login.masterData.FromDate
                }, 
                {
                    "label":  "IDS_TO",
                    "value": (this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) 
                    || this.props.Login.masterData.ToDate
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

    onFilterSubmit = () => {
        this.reloadData(this.state.selectedRecord, true);
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        
        selectedRecord["dgoodsindate"] = new Date(selectedRecord["sgoodsindate"]);
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
        this.setState({selectedRecord});    
    }

    onFilterSubmit =()=>{
        this.reloadData(this.state.selectedRecord, true);
    }

    reloadData = (selectedRecord, isDateChange) => {
       this.searchRef.current.value = "";
       let fromDate = this.props.Login.masterData.FromDate;
       let toDate = this.props.Login.masterData.ToDate;
       let obj = this.convertDatetoString((selectedRecord && selectedRecord["fromdate"]) || this.props.Login.masterData.FromDate, 
       (selectedRecord && selectedRecord["todate"]) || this.props.Login.masterData.ToDate)
        // if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
        //     fromDate = getStartOfDay(selectedRecord["fromdate"]);
        //     //fromDate = formatDate(selectedRecord["fromdate"]);
        // }
        // if (selectedRecord && selectedRecord["todate"] !== undefined) {
        //     toDate = getEndOfDay(selectedRecord["todate"]);
        //     //toDate = formatDate(selectedRecord["todate"]);
        // }
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
               fromDate:obj.fromDate,
               toDate:obj.toDate,
               currentdate: isDateChange === true ? null :formatInputDate(new Date(), true)
            },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "CertificateGeneration",
            displayName: "IDS_CERTIFICATEGENERATION",
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
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
            
                let fromDate = this.props.Login.masterData.FromDate;
                let toDate = this.props.Login.masterData.ToDate;
                if (this.state.selectedRecord["fromdate"] !== undefined) {
                    fromDate = getStartOfDay(this.state.selectedRecord["fromdate"]);
                 }
                if (this.state.selectedRecord["todate"] !== undefined) {
                    toDate = getEndOfDay(this.state.selectedRecord["todate"]);
                }

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
                    methodUrl: "CertificateGeneration",
                    displayName: "IDS_CERTIFICATEGENERATION",
                    inputData: {
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
                            openModal: true, screenName: "GoodsIn",
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
    handleExpandChange = (row, dataState) =>{
        const viewParam = {
                            userInfo:this.props.Login.userInfo, primaryKeyField:"npreregno",
                            masterData:this.props.Login.masterData};
      
        this.props.getTestParameter({...viewParam, dataState,
                primaryKeyValue:row["dataItem"][viewParam.primaryKeyField], viewRow:row["dataItem"]});
     
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
    convertDatetoString(startDateValue, endDateValue) {
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);

        const prevMonth = validateTwoDigitDate(String(startDate.getMonth() + 1));
        const currentMonth = validateTwoDigitDate(String(endDate.getMonth() + 1));
        const prevDay = validateTwoDigitDate(String(startDate.getDate()));
        const currentDay = validateTwoDigitDate(String(endDate.getDate()));

        const fromDateOnly = startDate.getFullYear() + '-' + prevMonth + '-' + prevDay
        const toDateOnly = endDate.getFullYear() + '-' + currentMonth + '-' + currentDay
        const fromDate = fromDateOnly + "T00:00:00";
        const toDate = toDateOnly + "T23:59:00";
        return ({ fromDate, toDate, breadCrumbFrom: fromDateOnly, breadCrumbto: toDateOnly })
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
    callService, crudMaster, validateEsignCredential, updateStore,
    getCerGenDetail, getTestParameter, filterTransactionList,onClickCertificate
})(injectIntl(Certificategeneration));

