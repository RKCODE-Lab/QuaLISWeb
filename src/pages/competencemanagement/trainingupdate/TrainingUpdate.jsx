
import React, { Component } from 'react';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { connect } from 'react-redux';

import {
    callService, crudMaster, getTrainingUpdate, updateStore
     , filterColumnData, validateEsignCredential,
    changeTechniqueFilter, viewAttachment,
    getTrainingParticipantsAttended,getTrainingParticipantsCertified,getTrainingParticipantsCompetent
} from '../../../actions'
import TechniqueFilter from './TechniqueFilter';
import { injectIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { getControlMap, constructOptionList, convertDateValuetoString, showEsign, formatInputDate } from '../../../components/CommonScript';
import ListMaster from '../../../components/list-master/list-master.component';

import { ReadOnlyText, ContentPanel, MediaLabel } from '../../../components/App.styles';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';

import 'react-perfect-scrollbar/dist/css/styles.css';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';

// import ReactTooltip from 'react-tooltip';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import TrainingUpdateChildTab from './TrainingUpdateChildTab';
import { ProductList } from '../../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { transactionStatus } from '../../../components/Enumeration';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class TrainingUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            selectedRecord: {},
            error: "",
            userRoleControlRights: [],
            controlMap: new Map(),
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[3] : 25,
            sidebarview: false
        });
        this.searchRef = React.createRef();
        this.searchFieldList = ["stechniquename", "strainingtopic", "strainername"]
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    render() {

        this.confirmMessage = new ConfirmMessage();

        const { TechniqueList, SelectedTrainingUpdate, searchedData } = this.props.Login.masterData;
        const { masterData, userInfo, testData, parameterData, otherTestData, linkMaster, editFiles } = this.props.Login;

        let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
            this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;

       
        const filterParam = {
            inputListName: "TechniqueList", selectedObject: "SelectedTrainingUpdate", primaryKeyField: "ntrainingcode",
            fetchUrl: "trainingupdate/getTrainingUpdateById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, unchangeList: ["FromDate", "ToDate"],
            searchFieldList: this.searchFieldList
        };
              
        this.props.Login.showAccordion = true;

        let breadCrumbData = this.state.filterData || [];
        const completeId = this.state.controlMap.has("CompleteTraining") && this.state.controlMap.get("CompleteTraining").ncontrolcode;


        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                masterData={masterData}
                                screenName={this.props.intl.formatMessage({ id: "IDS_TRAININGUPDATE" })}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.TechniqueList}
                                getMasterDetail={(TechniqueList) => this.props.getTrainingUpdate(TechniqueList, userInfo, masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedTrainingUpdate}
                                primaryKeyField="ntrainingcode"
                                mainField="strainingtopic"
                                firstField="strainername"
                                //secondField="strainername"
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                userRoleControlRights={this.state.userRoleControlRights}
                                searchRef={this.searchRef}
                                reloadData={this.reloadData1}
                                needAccordianFilter={false}
                                // skip={this.state.skip}
                                // take={this.state.take}
                                handlePageChange={this.handlePageChange}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                userInfo={this.props.Login.userInfo}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                filterComponent={[
                                    {
                                        "IDS_TRAININGUPDATEFILTER":
                                            <TechniqueFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                value={this.state.value || {}}
                                                handleDateChange={this.handleDateChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
                                                filterTechnique={this.state.filterTechnique || []}
                                                nfilterTechnique={this.state.nfilterTechnique||[]}
                                                onComboChange={this.onComboChange}
                                                onFilterChange={this.onFilterChange}
                                                handleFilterDateChange={this.handleFilterDateChange}
                                                FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                                                FilterStatus={this.state.stateFilterStatus || []}
                                            />
                                    }

                            
                                ]}
                            />
                        </Col>
                        <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                            <div className="sidebar-view-btn-block">
                                <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                    {!this.props.sidebarview ?                    
                                        <i class="fa fa-less-than"></i> :
                                        <i class="fa fa-greater-than"></i> 
                                    }
                                </div>
                            </div> 
                            {SelectedTrainingUpdate && Object.values(SelectedTrainingUpdate).length > 0 ?
                                <ContentPanel className="panel-main-content">
                                    <Card className="border-0">
                                        <Card.Header>
                                            {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                            <Card.Title className="product-title-main">
                                                {SelectedTrainingUpdate.stechniquename}
                                            </Card.Title>
                                            <Card.Subtitle>
                                            <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        <MediaLabel className={`btn btn-outlined ${SelectedTrainingUpdate.ntransactionstatus === transactionStatus.COMPLETED ? "outline-success" : "outline-secondary"} btn-sm ml-3`}>
                                                            {/* {SelectedTrainingUpdate.ntransactionstatus === 22 && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>} */}
                                                            {SelectedTrainingUpdate.stransdisplaystatus}
                                                        </MediaLabel>
                                                    </h2>
                                                    <div className="d-inline">
                                                   <ProductList className="d-flex justify-content-end">                                                            
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_COMPLETETRAINING" })}
                                                            //    data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(completeId) === -1}
                                                                onClick={() => this.completeTraining(this.state.version,completeId)}
                                                                >
                                                                <FontAwesomeIcon icon={faCheckCircle} />                                                                
                                                            </Nav.Link>
                                                        </ProductList>     
                                                         </div>                                           
                                            </div>
                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body className="form-static-wrap">
                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_VENUE" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTrainingUpdate.strainingvenue}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TRAININGDATETIME" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTrainingUpdate.strainingdatetime}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>

                                               
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TRAININGTOPIC" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTrainingUpdate.strainingtopic}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <FormLabel>{this.props.intl.formatMessage({ id: "IDS_TRAINERNAME" })}</FormLabel>
                                                        <ReadOnlyText>{SelectedTrainingUpdate.strainername}</ReadOnlyText>
                                                    </FormGroup>
                                                </Col>
                                               
                                            </Row>
                                            <TrainingUpdateChildTab 
                                                operation={this.props.Login.operation}
                                                inputParam={this.props.Login.inputParam}
                                                screenName={this.props.Login.screenName}
                                                userInfo={this.props.Login.userInfo}
                                                masterData={this.props.Login.masterData}
                                                crudMaster={this.props.crudMaster}
                                                errorCode={this.props.Login.errorCode}
                                                masterStatus={this.props.Login.masterStatus}
                                                openChildModal={this.props.Login.openChildModal}
                                                participants={this.props.Login.participants}
                                                updateStore={this.props.updateStore}
                                                selectedRecord={this.props.Login.selectedRecord}
                                                userRoleControlRights={this.state.userRoleControlRights}
                                                esignRights={this.props.Login.userRoleControlRights}
                                                screenData={this.props.Login.screenData}
                                                validateEsignCredential={this.props.validateEsignCredential}
                                                loadEsign={this.props.Login.loadEsign}
                                                controlMap={this.state.controlMap}
                                                showAccordian={this.state.showAccordian}
                                                dataState={this.props.Login.dataState}
                                                onTabChange={this.onTabChange}
                                                settings={this.props.Login.settings}
                                                nFlag={this.props.Login.nFlag}
                                                usersStatus={this.props.Login.usersStatus || []}
                                                nusercode={this.props.Login.nusercode || []}
                                                getTrainingParticipantsAttended={this.props.getTrainingParticipantsAttended}
                                                getTrainingParticipantsCertified={this.props.getTrainingParticipantsCertified}
                                                getTrainingParticipantsCompetent={this.props.getTrainingParticipantsCompetent}
                                                linkMaster={this.props.linkMaster}
                                                onComboChange={this.onComboChange}
                                                 ncontrolCode={this.props.Login.ncontrolCode}
                                                 viewAttachment ={this.props.viewAttachment} 

                                            />
                                        </Card.Body>
                                    </Card>
                                </ContentPanel>
                                : ""
                            }
                        </Col>

                    </Row>
                </div>

            </>
        );
    }

   
    
    completeTraining = (version,ncontrolCode) => {

        let inputData = [];
        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate, this.props.Login.masterData.ToDate, this.props.Login.userInfo);
        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        inputData["fromDate"] = fromDate;
        inputData["toDate"] = toDate;
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["ntechniquecode"]=this.props.Login.masterData.SelectedTrainingUpdate["ntechniquecode"];
        inputData["trainingupdate"] = {
            
            "ntrainingcode": this.props.Login.masterData.SelectedTrainingUpdate.ntrainingcode,
            "ntechniquecode":this.props.Login.masterData.selectedTechinque.ntechniquecode,
            "ntransactionstatus":this.props.Login.masterData.SelectedTrainingUpdate.ntransactionstatus,
            
        }
        const postParam = {
            inputListName: "TechniqueList", 
            selectedObject: "SelectedTrainingUpdate",
            primaryKeyField: "ntrainingcode",
            primaryKeyValue: this.props.Login.masterData.TechniqueList.ntrainingcode,
            fetchUrl: "trainingupdate/getTraningUpdateByTechnique",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "Training",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData, postParam,
            operation:"complete"
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, 
                    screenData: { inputParam, masterData }, 
                    openChildModal: true, 
                    operation:"complete", 
                   // screenName: '', 
                    id: 'TrainingUpdate'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData,'openChildModal');
        }
    }
    handlePageChange = (event) => {
        this.setState({
            skip: event.skip,
            take: event.take
        });
    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData && this.props.Login.masterData.filterTechnique && this.props.Login.masterData.FromDate) {
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
                {
                    "label": "IDS_TECHNIQUE",
                    "value": this.props.Login.masterData.selectedTechinque ? this.props.Login.masterData.selectedTechinque["stechniquename"]: "NA"
                }
            );
        }
        return breadCrumbData;
    }

    onComboChange = (comboData, fieldName, caseNo) => {
        let selectedRecord = this.state.selectedRecord || {};
        switch (caseNo) {
            case 1:
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
                break;
              case 2:
                selectedRecord[fieldName] = comboData;
                selectedRecord["nsectionusercode"] = comboData.value;
                this.props.getSectionUsers(
                  this.state.selectedRecord.nsectionusercode,
                  this.props.Login.userInfo,
                  selectedRecord,
                  this.props.Login.screenName
                );
                break;
            case 3:
                let nfilterTechnique = this.state.nfilterTechnique || {}
                nfilterTechnique = comboData;
                this.searchRef.current.value = "";
                this.setState({ nfilterTechnique })
                break;

            default:
                break;
        }
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

    reloadData1 = () => {
        this.searchRef.current.value = "";
let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
//ALPD-3748
        if (this.state.nfilterTechnique&&this.state.nfilterTechnique.value) {


            let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
            let inputParam = {
                inputData: {
                    ntechniquecode:this.props.Login.masterData.selectedTechinque.ntechniquecode,
                    selectedTechinque:this.props.Login.masterData.selectedTechinque,
                    userinfo: this.props.Login.userInfo,
                    currentdate: null,
                    fromDate:obj.fromDate,
                    toDate:obj.toDate
                },
                classUrl: "trainingupdate",
                methodUrl: "TrainingUpdate",
                userInfo: this.props.Login.userInfo,
                displayName: "IDS_TRAININGUPDATE"

            };
            this.props.callService(inputParam);
          
        }
        else {
//ALPD-3748
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TECHNIQUENOTAVAILABLE" }));
        }
    }
    onFilterSubmit = () => {
        this.reloadData(true);
    }

    reloadData = (isFilterSubmit) => {

        this.searchRef.current.value = "";

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
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        if (this.state.nfilterTechnique&&this.state.nfilterTechnique.value) {
            let inputParam = {
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    fromDate: obj.fromDate,
                    toDate: obj.toDate,
                    currentDate: null,
                    ntechniquecode: this.state.nfilterTechnique.value,
                    userinfo: this.props.Login.userInfo,
                    nfilterTechnique: this.state.nfilterTechnique
                },

                classUrl: "trainingupdate",
                methodUrl: "TraningUpdateByTechnique",
                displayName: "IDS_TRAININGCERTIFICATE",
                userInfo: this.props.Login.userInfo
            };
            this.props.changeTechniqueFilter(inputParam, this.props.Login.masterData.filterTechnique,this.state.nfilterTechnique);
        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TECHNIQUENOTAVAILABLE" }));
        }
    }


    componentDidUpdate(previousProps) {
        let isComponentUpdated = false;
        let selectedRecord = this.state.selectedRecord || {};
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            selectedRecord = this.props.Login.selectedRecord;
            isComponentUpdated = true;
        }

        let userRoleControlRights = this.state.userRoleControlRights || [];
        let controlMap = this.state.controlMap || new Map();
        if (this.props.Login.userInfo && this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            const nformCode = this.props.Login.userInfo.nformcode;
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[nformCode] && Object.values(this.props.Login.userRoleControlRights[nformCode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode));
            }
            controlMap = getControlMap(this.props.Login.userRoleControlRights, nformCode);
            isComponentUpdated = true;
        }
        let nfilterTechnique = this.state.nfilterTechnique || undefined;
        let filterTechnique = this.state.filterTechnique || {};

        if (this.props.Login.masterData.filterTechnique !== previousProps.Login.masterData.filterTechnique) {
            const trainingupdateMap = constructOptionList(this.props.Login.masterData.filterTechnique || [], "ntechniquecode",
                "stechniquename", 'ntechniquecode', 'ascending', false);
            filterTechnique = trainingupdateMap.get("OptionList");
            if (trainingupdateMap.get("DefaultValue")) {
                nfilterTechnique = trainingupdateMap.get("DefaultValue");
            } else if (this.state.filterTechnique===undefined){
//ALPD-3748
                nfilterTechnique=filterTechnique[0];

                
            }
          
            isComponentUpdated = true;
        } else if (this.props.Login.masterData.nfilterTechnique !== previousProps.Login.masterData.nfilterTechnique) {
            nfilterTechnique = this.props.Login.masterData.nfilterTechnique;
            isComponentUpdated = true;
        }
        if (isComponentUpdated) {
            this.setState({ nfilterTechnique, userRoleControlRights, controlMap, selectedRecord, filterTechnique });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }
}


export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,
    updateStore, filterColumnData, getTrainingUpdate, changeTechniqueFilter,getTrainingParticipantsAttended,
    getTrainingParticipantsCertified,getTrainingParticipantsCompetent
})(injectIntl(TrainingUpdate));

