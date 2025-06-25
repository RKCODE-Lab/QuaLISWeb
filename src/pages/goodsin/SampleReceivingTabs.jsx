import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { process } from '@progress/kendo-data-query';

import {Row, Col, Card, Nav} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';

import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { formatInputDate, rearrangeDateFormat } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {showEsign} from '../../components/CommonScript';
import Esign from '../audittrail/Esign';
import AddChainCustody from './AddChainCustody';
import DataGrid from '../../components/data-grid/data-grid.component';
import {transactionStatus} from '../../components/Enumeration';

class SampleReceivingTabs extends React.Component{
    constructor(props){
        super(props);  
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };       
        this.state = {// isOpen:false, //activeTab:'chaincustody-tab', 
                        selectedRecord:{},  dataResult:[],
                        dataState:dataState};

        this.chainCustodyColumnList=[
                        {"idsName":"IDS_RECEIVEDOWNER","dataField":"sreceivedowner","width":"200px"},
                        //{"idsName":"IDS_DEPARTMENT","dataField":"sdeptname","width":"150px"},
                        {"idsName":"IDS_NPACKAGERSQTY","dataField":"npackagersqty","width":"200px"},
                       // {"idsName":"IDS_RECEIVEDDATE","dataField":"sreceiveddate","width":"150px"},                    
                       
                        ];   
                        
        this.detailedFieldList = [
                           // {"idsName":"IDS_RECEIVEDOWNER","dataField":"sreceivedowner"},
                            {"idsName":"IDS_DEPARTMENT","dataField":"sdeptname"},
                         //   {"idsName":"IDS_NPACKAGERSQTY","dataField":"npackagersqty"},
                            {"idsName":"IDS_RECEIVEDDATETIME","dataField":"sreceiveddate"},
                            {"idsName":"IDS_TIMEZONE","dataField":"stzreceiveddate"}, 
                            {"idsName":"IDS_COMMENTS","dataField":"scomments"},  
                                     
                        ];
                       
    } 

    ccDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.masterData["ChainCustody"], event.dataState),
            dataState: event.dataState
        });
    }

    render(){        
        const addChainCustodyId = this.props.controlMap.has("AddChainCustody") && this.props.controlMap.get("AddChainCustody").ncontrolcode
        const editChainCustodyId = this.props.controlMap.has("EditChainCustody") && this.props.controlMap.get("EditChainCustody").ncontrolcode;
        
        const ccAddParam = {screenName:"ChainCustody", operation:"create", primaryKeyField:"nchaincustodycode", 
                            primaryKeyValue:-2, masterData:this.props.masterData, userInfo:this.props.userInfo,
                            ncontrolCode:addChainCustodyId};
                            
        const ccEditParam = {screenName:"ChainCustody", operation:"update",  primaryKeyField:"nchaincustodycode", 
                            masterData:this.props.masterData,   userInfo:this.props.userInfo,  ncontrolCode:editChainCustodyId};

        const ccDeleteParam ={screenName:"ChainCustody",methodUrl:"ChainCustody", operation:"delete"};

        const mandatoryFields =[{"idsName":"IDS_NPACKAGERSQTY","dataField":"npackagersqty" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                    {"idsName":"IDS_RECEIVEDDATE","dataField":"dreceiveddate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                    {"idsName":"IDS_TIMEZONE","dataField":"ntzreceiveddate" , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}];
        return(
            <>
                <Row noGutters>
                    <Col md={12}>  
                        <Card>  
                            <Card.Header className="add-txt-btn">
                                <strong><FormattedMessage id="IDS_CHAINCUSTODY" defaultMessage="Chain Custody"/></strong> 
                            </Card.Header>   
                            <Card.Body>
                                {/* <Row className="no-gutters text-right border-bottom pb-2" >                                            
                                    <Col md={12}>
                                        <Nav.Link name="addchaincustody"  className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addChainCustodyId) === -1}
                                                    onClick={()=>this.props.getChainCustodyComboDataService(ccAddParam)}>
                                            <FontAwesomeIcon icon={faPlus} /> { }
                                            <FormattedMessage id='IDS_CHAINCUSTODY' defaultMessage='Chain Custody' />
                                        </Nav.Link>
                                    </Col>
                                </Row> */}

                                <div className="actions-stripe">
                                    <div className="d-flex justify-content-end">
                                        <Nav.Link name="addchaincustody"  className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addChainCustodyId) === -1}
                                                    onClick={()=>this.props.getChainCustodyComboDataService(ccAddParam)}>
                                            <FontAwesomeIcon icon={faPlus} /> { }
                                            <FormattedMessage id='IDS_CHAINCUSTODY' defaultMessage='Chain Custody' />
                                        </Nav.Link>
                                    </div>
                                </div>
                                       
                                <Row noGutters>
                                    <Col md={12}>
                                        <DataGrid
                                            primaryKeyField={"nchaincustodycode"}
                                            data={this.props.masterData["ChainCustody"]}
                                            dataResult={process(this.props.masterData["ChainCustody"], this.state.dataState)}
                                            dataState={this.state.dataState}
                                            dataStateChange={this.ccDataStateChange}
                                            extractedColumnList={this.chainCustodyColumnList}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights}
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.userInfo}
                                            methodUrl="ChainCustody"
                                            fetchRecord={this.props.getChainCustodyComboDataService}
                                            editParam={ccEditParam}
                                            deleteRecord={this.deleteRecord}   
                                            deleteParam={ccDeleteParam}                                                                                         
                                            pageable={true}
                                            scrollable={"scrollable"}
                                            //isComponent={true}
                                            isActionRequired={true}
                                            isToolBarRequired={false}
                                            selectedId={this.props.selectedId}
                                            expandField="expanded"
                                            detailedFieldList = {this.detailedFieldList}
                                        />                                                
                                    </Col>
                                </Row>        
                        </Card.Body>                   
                                                                       
                            {/* <Tab.Container defaultActiveKey={this.state.activeTab}>
                                <Card.Header className="d-flex tab-card-header">
                                    <Nav className="nav nav-tabs card-header-tabs flex-grow-1" as="ul">  
                                        <Nav.Item as='li'>
                                            <Nav.Link   name="chaincustodytab" eventKey="chaincustody-tab"> 
                                                <FormattedMessage id="IDS_CHAINCUSTODY" defaultMessage="Chain Custody"/>                                                      
                                            </Nav.Link>
                                        </Nav.Item>                                      
                                    </Nav>
                                </Card.Header>
                                <Tab.Content>
                                    <Tab.Pane className="fade p-0 " eventKey="chaincustody-tab">
                                        <Row className="no-gutters text-right border-bottom pt-2 pb-2" >                                            
                                            <Col md={12}>
                                                <Nav.Link name="addchaincustody"  className="add-txt-btn" hidden={this.props.userRoleControlRights.indexOf(addChainCustodyId) === -1}
                                                            onClick={()=>this.props.getChainCustodyComboDataService(ccAddParam)}>
                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                    <FormattedMessage id='IDS_ADDCHAINCUSTODY' defaultMessage='Add Chain Custody' />
                                                </Nav.Link>
                                            </Col>
                                        </Row>
                                       
                                        <Row className="no-gutters">
                                            <Col md={12}>
                                            <DataGrid
                                                        primaryKeyField={"nchaincustodycode"}
                                                        data={this.props.masterData["ChainCustody"]}
                                                        dataResult={process(this.props.masterData["ChainCustody"], this.state.dataState)}
                                                        dataState={this.state.dataState}
                                                        dataStateChange={this.ccDataStateChange}
                                                        extractedColumnList={this.chainCustodyColumnList}
                                                        controlMap={this.props.controlMap}
                                                        userRoleControlRights={this.props.userRoleControlRights}
                                                        inputParam={this.props.inputParam}
                                                        userInfo={this.props.userInfo}
                                                        methodUrl="ChainCustody"
                                                        fetchRecord={this.props.getChainCustodyComboDataService}
                                                        editParam={ccEditParam}
                                                        deleteRecord={this.deleteRecord}   
                                                        deleteParam={ccDeleteParam}                                                                                         
                                                        pageable={false}
                                                        scrollable={"scrollable"}
                                                        isComponent={true}
                                                        isActionRequired={true}
                                                        isToolBarRequired={false}
                                                        selectedId={this.props.selectedId}
                                                        expandField="expanded"
                                                        detailedFieldList = {this.detailedFieldList}
                                                    />                                                
                                            </Col>
                                        </Row>                                        
                                    </Tab.Pane> 
                                    
                                </Tab.Content>
                            </Tab.Container>  */}
                                                                       
                                                                 
                        </Card>   
                    </Col>
                </Row>
                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.openChildModal ? 
                <SlideOutModal show={this.props.openChildModal} 
                    closeModal={this.closeModal}  
                    operation={this.props.operation}
                    inputParam={this.props.inputParam}  
                    screenName={this.props.screenName}    
                    onSaveClick={this.onSaveClick} 
                    updateStore={this.props.updateStore}
                    esign={this.props.loadEsign}
                    validateEsign={this.validateEsign}   
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}               
                    addComponent ={this.props.loadEsign ? 
                                <Esign  operation={this.props.operation}
                                        //formatMessage={this.props.formatMessage}
                                        onInputOnChange={this.onInputOnChange}
                                        inputParam={this.props.inputParam}                                               
                                        selectedRecord={this.state.selectedRecord ||{}}
                                 /> : <AddChainCustody selectedRecord={this.state.selectedRecord ||{}}                                  
                                                            onInputOnChange={this.onInputOnChange}
                                                            onComboChange={this.onComboChange}
                                                            handleDateChange={this.handleDateChange}                                                                                                                      
                                                            onNumericInputOnChange={this.onNumericInputOnChange}                                                          
                                                            selectedGoodsIn={this.props.masterData.SelectedGoodsIn ||{}}
                                                            operation={this.props.operation}
                                                            userInfo={this.props.userInfo}
                                                            timeZoneList={this.props.timeZoneList || []}
                                                            currentTime={this.props.currentTime}
                                                         />
                                    }               
                        
                />:""}
            </>
        )
 
    }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        selectedRecord["dreceiveddate"] = rearrangeDateFormat(this.props.userInfo, selectedRecord["sreceiveddate"]);
        if (this.props.loadEsign){          
            if (this.props.operation === "delete"){
                loadEsign = false;
                openChildModal =  false;
            }
            else{
                loadEsign = false;
            }
        }
        else{
            openChildModal =  false;
            selectedRecord={};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {openChildModal, loadEsign, selectedRecord, selectedId:null}
        }
        this.props.updateStore(updateInfo);
        
    }

    handleDateChange = (dateName, dateValue) => {        
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue; 
        this.setState({selectedRecord});
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;

        if (fieldName === "ntzreceiveddate"){
            if (comboData === null) {
                selectedRecord["ntzreceiveddate"] = 0;
                selectedRecord["stzreceiveddate"] = "";
            }
            else {
                selectedRecord["stzreceiveddate"] = comboData.label;
            }
        }
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
      
        if (event.target.type === 'checkbox')
        {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else{
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({selectedRecord});
    }

    onNumericInputOnChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    componentDidUpdate(previousProps){       
        if (this.props.masterData !== previousProps.masterData ){
            let {dataState} = this.state;
            if(this.props.dataState === undefined){
               dataState = {skip:0,take:this.props.settings ? parseInt(this.props.settings[14]) : 5};
            }
                    
            this.setState({  activeTab:'chaincustody-tab', dataState});
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord ){             
            this.setState({selectedRecord:this.props.selectedRecord});
         }       
    }

    onSaveClick = (saveType, formRef) => {
              //add / edit         
     
        let inputData = [];
       
        inputData["fromDate"]=this.props.fromDate;
        inputData["toDate"]=this.props.toDate;
  
        inputData["userinfo"] = this.props.userInfo;
        inputData["chaincustody"] = {"nsitecode":this.props.userInfo.ntranssitecode};
       
        let selectedId = null;
        let dataState = undefined;
        let postParam = undefined;
        if ( this.props.operation === "update"){
            // edit            
          
            inputData["chaincustody"] = JSON.parse(JSON.stringify(this.props.selectedRecord));  
            selectedId = this.props.selectedRecord.nchaincustodycode;  
            dataState = this.state.dataState;       
        }
        else{       
            postParam =  { inputListName : "GoodsInList", selectedObject : "SelectedGoodsIn", primaryKeyField : "nrmsno", isSingleGet:true};
            inputData["chaincustody"]["nrmsno"] = this.props.masterData.SelectedGoodsIn.nrmsno;
        }
            
        inputData["chaincustody"]["npackagersqty"] =  this.state.selectedRecord["npackagersqty"] ;
        inputData["chaincustody"]["nreceivedownercode"] = this.props.userInfo.nusercode;
       // inputData["chaincustody"]["ndeptcode"] = this.props.userInfo.ndeptcode;
        inputData["chaincustody"]["dreceiveddate"]= this.state.selectedRecord["dreceiveddate"];
        inputData["chaincustody"]["scomments"]= this.state.selectedRecord["scomments"]||"";
        inputData["chaincustody"]["ntzreceiveddate"] = this.state.selectedRecord["ntzreceiveddate"] ? this.state.selectedRecord["ntzreceiveddate"].value : 1;
        inputData["chaincustody"]["stzreceiveddate"] = this.state.selectedRecord["stzreceiveddate"] || "";
      

        const receivedDate =  inputData["chaincustody"]["dreceiveddate"];
        //need this conversion when the datatype of the field is 'Instant'      
        inputData["chaincustody"]["dreceiveddate"] = //"2020-10-12T11:25:00.000Z";
        formatInputDate(receivedDate, false);

        if (Object.keys(inputData["chaincustody"]).indexOf("expanded") !== -1)
            delete inputData["chaincustody"]["expanded"]
        const inputParam = {
                                classUrl: this.props.inputParam.classUrl,
                                methodUrl: "ChainCustody", postParam,
                                inputData: inputData,  selectedId, dataState,
                                operation: this.props.operation , saveType, formRef       
                            }       
           
       if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData:this.props.masterData}, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else{
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }           
    }   

    deleteRecord = (deleteParam) =>{       
        if (deleteParam.selectedRecord.nreceivedownercode === this.props.userInfo.nusercode){ 

            if (Object.keys(deleteParam.selectedRecord).indexOf("expanded") !== -1)
            delete deleteParam.selectedRecord["expanded"]
            const inputParam = {
                                    classUrl: this.props.inputParam.classUrl,
                                    methodUrl:"ChainCustody",   
                                    displayName:"IDS_CHAINCUSTODY",                               
                                    inputData: {"chaincustody" :deleteParam.selectedRecord,
                                                "userinfo": this.props.userInfo,
                                                "fromDate":this.props.fromDate,
                                                "toDate":this.props.toDate},
                                    operation:deleteParam.operation ,
                                    dataState : this.state.dataState
                            }        
             
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)){
                const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign:true, screenData:{inputParam, masterData:this.props.masterData}, 
                            openChildModal:true, screenName:deleteParam.screenName, operation:deleteParam.operation
                            }
                        }
                this.props.updateStore(updateInfo);
            }
            else{
                
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
        else{
            toast.warn(this.props.intl.formatMessage({id:"IDS_INVALIDOWNERTODELETE"}));
        }
        
    }  

    validateEsign = () =>{       
        const inputParam = {
                                inputData: {"userinfo": {...this.props.userInfo, 
                                                        sreason: this.state.selectedRecord["esigncomments"],
                                                        nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                                                        spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                                                    },
                                             password : this.state.selectedRecord["esignpassword"]
                                            },
                                screenData : this.props.screenData
                            }        
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
}

export default injectIntl(SampleReceivingTabs);