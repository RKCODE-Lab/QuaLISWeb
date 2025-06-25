import React from 'react';
import {ListWrapper} from '../../components/client-group.styles';
import {Row, Col} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';

import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callService, crudMaster,updateStore, validateEsignCredential,getPackageService } from '../../actions';

import DataGrid from '../../components/data-grid/data-grid.component';

import Esign from '../../pages/audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddTestPackage from './AddTestPackage';

import {showEsign, getControlMap} from '../../components/CommonScript';
import {transactionStatus} from '../../components/Enumeration';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Method extends React.Component
{
    constructor(props){
        super(props);        
        this.formRef = React.createRef();
     
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {        
            data:[], masterStatus:"", error:"", selectedRecord:{},
            dataResult: [],
            dataState: dataState,
            userRoleControlRights:[],
            controlMap :new Map()
        };

        this.extractedColumnList =[{"idsName":"IDS_PACKAGENAME","dataField":"stestpackagename","width":"200px"},
                                    //{"idsName":"IDS_PACKAGEREFRANCECODE","dataField":"smethodname","width":"200px"},
                                    {"idsName":"IDS_PACKAGEPRICE","dataField":"ntestpackageprice","width":"200px"},
                                    {"idsName":"IDS_PACKAGETATPRICE","dataField":"ntestpackagetatdays","width":"200px"},
                                    {"idsName":"IDS_OPENMRSREFERENCECODE","dataField":"sopenmrsrefcode","width":"250px"},
                                    {"idsName":"IDS_PREVENTTBREFERENCECODE","dataField":"spreventtbrefcode","width":"250px"},
                                    {"idsName":"IDS_PORTALREFERENCECODE","dataField":"sportalrefcode","width":"250px"},
                                    {"idsName":"IDS_DESCRIPTION","dataField":"sdescription","width":"200px"}                                    
                                    ];


    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.props.Login.selectedId;
        if (this.props.Login.loadEsign){          
            if (this.props.Login.operation === "delete"){
                loadEsign = false;
                openModal =  false;
                selectedRecord = {};
            }
            else{
                loadEsign = false;   
                // delete selectedRecord['esignpassword'] 
                // delete selectedRecord['esigncomments']   
                // delete selectedRecord['esignreason']  
                 
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
          
            }
        }
        else{
            openModal =  false;
            selectedRecord ={};
            selectedId = null;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {openModal, loadEsign, selectedRecord, selectedId}
        }
        this.props.updateStore(updateInfo);
        
    }
    
    static getDerivedStateFromProps(props, state){
    
        if (props.Login.masterStatus !== ""  && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";           
        } 
         
        if (props.Login.error !== state.error){
            toast.error(props.Login.error)
            props.Login.error = "";
        }   
        
        return null;
     }    


    render(){
         const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
                        && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        
       // const addId = this.state.controlMap.has("AddTestPackage") && this.state.controlMap.get("AddTestPackage").ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
                        && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
       // const editId = this.state.controlMap.has("EditTestPackage") && this.state.controlMap.get("EditTestPackage").ncontrolcode;
            
         const addParam = {screenName: this.props.intl.formatMessage({ id: "IDS_TESTPACKAGE"}), primaryeyField: "ntestpackagecode", primaryKeyValue:undefined,  
                            operation:"create", inputParam:this.props.Login.inputParam, userInfo : this.props.Login.userInfo, ncontrolCode: addId};

        const editParam = {screenName:this.props.Login.inputParam && this.props.Login.inputParam.displayName && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation:"update", 
                           primaryKeyField:"ntestpackagecode", inputParam:this.props.Login.inputParam,  userInfo:this.props.Login.userInfo,  ncontrolCode:editId};

        const deleteParam ={operation:"delete"};

    return (
        <>
        <Row>
            <Col>
                <ListWrapper className="client-list-content">
                    {/* <PrimaryHeader className="d-flex justify-content-between mb-3">
                        <HeaderName className="header-primary-md">
                           {this.props.Login.inputParam ? 
                            <FormattedMessage id={this.props.Login.inputParam.methodUrl} /> :""}
                        </HeaderName>
                        <Button name="addMethod" className="btn btn-user btn-primary-blue"  
                                hidden ={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                onClick={()=>this.props.getMethodComboService(addParam) } 
                                role="button">
                            <FontAwesomeIcon icon={faPlus} /> { }                          
                            <FormattedMessage id="IDS_ADD" defaultMessage='Add'/> 
                        </Button>
                    </PrimaryHeader> */}
                   
                    {this.state.data ? 
                        <DataGrid
                            primaryKeyField = {"ntestpackagecode"}
                            data = {this.state.data}
                            dataResult = {this.state.dataResult}
                            dataState = {this.state.dataState}
                            dataStateChange = {this.dataStateChange}
                            extractedColumnList = {this.extractedColumnList}
                            fetchRecord = {this.props.getPackageService}
                            editParam={editParam}
                            deleteRecord = {this.deleteRecord}
                            deleteParam={deleteParam}
                            reloadData = {this.reloadData}
                            controlMap = {this.state.controlMap}
                            userRoleControlRights={this.state.userRoleControlRights}
                            inputParam={this.props.Login.inputParam}
                            userInfo = {this.props.Login.userInfo}
                            pageable={true}
                            scrollable={'scrollable'}
                            gridHeight = {'600px'}
                            isActionRequired={true}
                            isToolBarRequired={true} 
                            selectedId={this.props.Login.selectedId} 
                            addRecord={()=>this.props.getPackageService(addParam)}                      
                        />
                    :""}    
                </ListWrapper>
            </Col>
        </Row>
        {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
        {this.props.Login.openModal ? 
            <SlideOutModal  show={this.props.Login.openModal} 
                                closeModal={this.closeModal}  
                                operation={this.props.Login.operation}
                                inputParam={this.props.Login.inputParam}  
                                screenName={this.props.Login.screenName}   
                                onSaveClick={this.onSaveClick}    
                                esign={this.props.Login.loadEsign}
                                validateEsign={this.validateEsign}
                                masterStatus={this.props.Login.masterStatus}
                                updateStore={this.props.updateStore}
                                selectedRecord={this.state.selectedRecord || {}}
                                mandatoryFields={[{"idsName":"IDS_PACKAGENAME","dataField":"stestpackagename", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                                  //{"idsName":"IDS_PACKAGETATPRICE","dataField":"ntestpackagetatdays", "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}
                                            ]}
                                addComponent ={this.props.Login.loadEsign ? 
                                        <Esign  operation={this.props.Login.operation}
                                                onInputOnChange={this.onInputOnChange}
                                                inputParam={this.props.Login.inputParam}                                               
                                                selectedRecord={this.state.selectedRecord ||{}}
                                                />
                                      : <AddTestPackage  
                                            selectedRecord={this.state.selectedRecord ||{}}                                  
                                            onInputOnChange={this.onInputOnChange}
                                            onNumericInputChange={this.onNumericInputChange}
                                            onComboChange={this.onComboChange} 
                                            methodCategoryList={this.props.Login.methodCategoryList ||[]}
                                            operation={this.props.Login.operation}
                                            inputParam={this.props.Login.inputParam}  
                                            />}  
                />
            :""}
        </>
      );
    }

    componentDidUpdate(previousProps){
        if (this.props.Login.masterData !== previousProps.Login.masterData){            
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode){
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights){
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item=>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                // this.setState({userRoleControlRights, controlMap, data:this.props.Login.masterData, 
                //     dataResult: process(this.props.Login.masterData, this.state.dataState),});

                    this.setState({userRoleControlRights, controlMap, data:this.props.Login.masterData, dataState :{skip : 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5},
                        dataResult: process(this.props.Login.masterData || [], {skip : 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5})});
            }
            else {        
                let {dataState} = this.state;
                if(this.props.Login.dataState === undefined){
                    dataState = {skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                }         
                this.setState({data: this.props.Login.masterData, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData || [] ,{skip : 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}), dataState
                });
            } 
         }
         else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord ){    
            this.setState({selectedRecord:this.props.Login.selectedRecord});
         }       
    }    

    onInputOnChange=(event) => {
        
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

    onNumericInputChange = (value, name) => {
        console.log("value:", value, name);
        const selectedRecord = this.state.selectedRecord || {};
        if (name === "nroundingdigits") {
            
            if (/^-?\d*?$/.test(value.target.value) || value.target.value === "") {
                console.log("val:", value.target.value);
                selectedRecord[name] = value.target.value;
            }
        }
        else {
            selectedRecord[name] = value;
        }

        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {      
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;   
     
        this.setState({selectedRecord});        
    }

    deleteRecord =(deleteParam) =>{
        const inputParam = {
                                classUrl: this.props.Login.inputParam.classUrl,
                                methodUrl: this.props.Login.inputParam.methodUrl,                        
                                displayName:this.props.Login.inputParam.displayName,
                                inputData: {[this.props.Login.inputParam.methodUrl.toLowerCase()] :deleteParam.selectedRecord,
                                            "userinfo": this.props.Login.userInfo},
                                operation:deleteParam.operation,
                                dataState:this.state.dataState,
                                selectedRecord: {...this.state.selectedRecord}    
                            }       
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)){
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData:this.props.Login.masterData}, 
                    openModal:true, screenName:this.props.intl.formatMessage({ id:this.props.Login.inputParam.displayName}),
                    operation:deleteParam.operation
                    }
                }
            this.props.updateStore(updateInfo);
        }
        else{
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    reloadData = () =>{
        const inputParam = {
                        inputData : {"userinfo":this.props.Login.userInfo},                        
                        classUrl: this.props.Login.inputParam.classUrl,
                        methodUrl: this.props.Login.inputParam.methodUrl,
                        displayName:this.props.Login.inputParam.displayName,
                        userInfo: this.props.Login.userInfo
                    };     
        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
       
            //add / edit            
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            let dataState = undefined;
            let selectedId = null;
            if ( this.props.Login.operation === "update"){
                // edit
                dataState = this.state.dataState;
                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));
                selectedId = this.props.Login.selectedRecord.ntestpackagecode.value;              
            }
            else{
                //add               
                inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = {"nsitecode":this.props.Login.userInfo.nmastersitecode};      
               
            }   

            // inputData["method"]["ndefaultstatus"] = this.state.selectedRecord["ndefaultstatus"]? this.state.selectedRecord["ndefaultstatus"]:transactionStatus.NO;
            // inputData["method"]["nmethodcatcode"] = this.state.selectedRecord["nmethodcatcode"]? this.state.selectedRecord["nmethodcatcode"].value:"";
            inputData["testpackage"]["stestpackagename"] = this.state.selectedRecord["stestpackagename"]? this.state.selectedRecord["stestpackagename"]:"";
            //inputData["testpackage"]["spackagerefcode"] = this.state.selectedRecord["spackagerefcode"]? this.state.selectedRecord["spackagerefcode"]:"";
            inputData["testpackage"]["ntestpackageprice"] = this.state.selectedRecord["ntestpackageprice"]? this.state.selectedRecord["ntestpackageprice"]:"";
            inputData["testpackage"]["ntestpackagetatdays"] = this.state.selectedRecord["ntestpackagetatdays"]? this.state.selectedRecord["ntestpackagetatdays"]:"";
            inputData["testpackage"]["sdescription"] = this.state.selectedRecord["sdescription"]? this.state.selectedRecord["sdescription"]:"";
            inputData["testpackage"]["sopenmrsrefcode"] = this.state.selectedRecord["sopenmrsrefcode"]? this.state.selectedRecord["sopenmrsrefcode"]:"";
            inputData["testpackage"]["spreventtbrefcode"] = this.state.selectedRecord["spreventtbrefcode"]? this.state.selectedRecord["spreventtbrefcode"]:"";
            inputData["testpackage"]["sportalrefcode"] = this.state.selectedRecord["sportalrefcode"]? this.state.selectedRecord["sportalrefcode"]:"";

            if(inputData["testpackage"]){
                 delete inputData["testpackage"]['esignpassword'] 
                 delete inputData["testpackage"]['esigncomments']   
                 delete inputData["testpackage"]['esignreason']  
                 delete inputData["testpackage"]['agree']  
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl: this.props.Login.inputParam.methodUrl,
                displayName:this.props.Login.inputParam.displayName,  
                inputData: inputData, selectedId, dataState,
                operation: this.props.Login.operation, saveType, formRef,
                selectedRecord: {...this.state.selectedRecord}       
            }
           
            const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode);
            if (esignNeeded){
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign:true, screenData:{inputParam, masterData:this.props.Login.masterData}, 
                        openModal:true, screenName:this.props.intl.formatMessage({ id:this.props.Login.inputParam.displayName}),
                        operation:this.props.Login.operation
                        }
                    }
                this.props.updateStore(updateInfo);
            }
            else{
                this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
            }
           
    } 
    validateEsign = () =>{
        const inputParam = {
                                inputData: {"userinfo": {...this.props.Login.userInfo, 
                                                        sreason: this.state.selectedRecord["esigncomments"],
                                                        nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                                                        spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                                                    },
                                             password : this.state.selectedRecord["esignpassword"]
                                            },
                                screenData : this.props.Login.screenData
                            }        
        this.props.validateEsignCredential(inputParam, "openModal");
    }    
   
 }
 export default connect(mapStateToProps, {callService, crudMaster,getPackageService, updateStore, validateEsignCredential})(injectIntl(Method));