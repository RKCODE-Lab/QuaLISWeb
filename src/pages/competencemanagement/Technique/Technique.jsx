import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../../components/data-grid/data-grid.component';
import {
    callService, crudMaster, validateEsignCredential, updateStore, filterColumnData,getTechniqueDetail,getEditTechniqueService,getAddTestService
   } from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../../components/CommonScript';
import { process } from '@progress/kendo-data-query';
import { transactionStatus } from '../../../components/Enumeration';
import ListMaster from '../../../components/list-master/list-master.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';

import { ReadOnlyText, ContentPanel } from '../../../components/App.styles';
import AddType1Component from '../../../components/type1component/AddType1Component';
import Esign from '../../audittrail/Esign';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import AddTechniqueTest from './AddTechniqueTest';
import rsapi from '../../../rsapi';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Technique extends React.Component {
    constructor(props) {
        super(props);
        const testDataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            masterStatus: "",
            error: "",
            selectedRecord: {},
            operation: "",
            SelectedTechnique: undefined,
            screenName: undefined,
            userRoleControlRights: [],
            controlMap: new Map(),
            isClearSearch: false,
            data: [], 
            dataResult: [],
            testDataState: testDataState,
            sidebarview: false
        };
        this.searchRef = React.createRef();       
        this.confirmMessage = new ConfirmMessage();
       
        this.techniqueFieldList = [
            { "idsName": "IDS_TECHNIQUE", "dataField": "stechniquename", "width": "200px","fieldLength":"100","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" , "fieldLength":"255","mandatory": false , "mandatoryLabel":"IDS_ENTER", "controlType": "textarea"},
            ]
        this.extractedColumnList = [
                { "idsName": "IDS_TESTNAME", "dataField": "stestname", "width": "200px"},                
               ]
        this.mandatoryFields = [ { "idsName": "IDS_TECHNIQUE", "dataField": "stechniquename", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                                    ];
        this.mandatoryTestFields = [ { "idsName": "IDS_TEST", "dataField": "ntestcode", "width": "200px","mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                ];
        this.searchFieldList = ["stechniquename", "sdescription"];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    static getDerivedStateFromProps(props, state) {

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

        // let versionStatusCSS = "outline-secondary";
        // let activeIconCSS = "fa fa-check"
        // if (this.props.Login.masterData.SelectedTestPriceVersion && this.props.Login.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.APPROVED) {
        //     versionStatusCSS = "outline-success";
        // }
        // else if (this.props.Login.masterData.SelectedTestPriceVersion && this.props.Login.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.RETIRED) {
        //     versionStatusCSS = "outline-danger";
        //     activeIconCSS = "";
        // }
        // else if (this.props.Login.masterData.SelectedTestPriceVersion && this.props.Login.masterData.SelectedTestPriceVersion.ntransactionstatus === transactionStatus.DRAFT) {
        //     activeIconCSS = "";
        // }

        const addId = this.state.controlMap.has("AddTechnique") && this.state.controlMap.get("AddTechnique").ncontrolcode;
        const editId = this.state.controlMap.has("EditTechnique") && this.state.controlMap.get("EditTechnique").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteTechnique") && this.state.controlMap.get("DeleteTechnique").ncontrolcode
        
        const addTechniqueTestId = this.state.controlMap.has("AddTechniqueTest") && this.state.controlMap.get("AddTechniqueTest").ncontrolcode;
        
             

        const filterParam = {
            inputListName: "Technique", selectedObject: "SelectedTechnique", primaryKeyField: "ntechniquecode",
            fetchUrl: "technique/getTechnique", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };

        const addParam = {
            screenName: "IDS_TECHNIQUE", operation: "create", primaryKeyName: "ntechniquecode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: addId
        }

        const editParam = {
            screenName: "IDS_TECHNIQUE", operation: "update", primaryKeyName: "ntechniquecode",
            masterData: this.props.Login.masterData, userInfo: this.props.Login.userInfo,
            ncontrolcode: editId, inputListName: "Technique", selectedObject: "SelectedTechnique"
        };

        
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
                <Row noGutters>
                    <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        {/* <Row noGutters>
                            <Col md={12}> */}
                            {/* <div className="list-fixed-wrap"> */}
                                <ListMaster
                                    screenName={this.props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.Technique}
                                    getMasterDetail={(technique) => this.props.getTechniqueDetail(technique, this.props.Login.userInfo, this.props.Login.masterData)}
                                    selectedMaster={this.props.Login.masterData.SelectedTechnique}
                                    primaryKeyField="ntechniquecode"
                                    mainField="stechniquename"
                                    firstField=""
                                    secondField=""
                                    filterColumnData={this.props.filterColumnData}
                                    filterParam={filterParam}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    addId={addId}
                                    searchRef={this.searchRef}
                                    reloadData={this.reloadData}
                                    openModal={() => this.openModal(addParam)}
                                    isMultiSelecct={false}
                                    hidePaging={false}
                                    isClearSearch={this.props.Login.isClearSearch}
                                />
                            {/* </div>
                        </Col></Row> */}
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
                        {/* <Row>
                            <Col md={12}> */}
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.Technique && this.props.Login.masterData.Technique.length > 0 && this.props.Login.masterData.SelectedTechnique ?
                                        <>
                                            <Card.Header>
                                                
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedTechnique.stechniquename}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category">
                                                        <h2 className="product-title-sub flex-grow-1">

                                                            
                                                        </h2>
                                                        
                                                        <div className="d-inline">
                                                            <Nav.Link name="editTechnique" hidden={this.state.userRoleControlRights.indexOf(editId) === -1}
                                                                className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                                
                                                                onClick={() => this.props.getEditTechniqueService(editParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>

                                                            <Nav.Link name="deleteTechnique" className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                              
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.confirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                               
                                                            </Nav.Link>
                                                            
                                                            
                                                        </div>
                                                        
                                                    </div>

                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body className="form-static-wrap">
                                                

                                                <Row>
                                                    {/* ALPD-873 */}
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <FormLabel><FormattedMessage id="IDS_DESCRIPTION" message="Description" /></FormLabel>
                                                            <ReadOnlyText>{this.props.Login.masterData.SelectedTechnique.sdescription && this.props.Login.masterData.SelectedTechnique.sdescription !== null ?
                                                             this.props.Login.masterData.SelectedTechnique.sdescription : "-"}</ReadOnlyText>
                                                        </FormGroup>
                                                    </Col>
                                                  
                                                </Row>
                                                
                                                  <Card className="at-tabs border-0">
                                                        <Row noGutters>
                                                            <Col md={12}>
                                                                <div className="d-flex justify-content-end">
                                                                <Nav.Link name="addTechniqueTest" className="add-txt-btn" 
                                                                        hidden={this.state.userRoleControlRights.indexOf(addTechniqueTestId) === -1}
                                                                        onClick={()=>this.props.getAddTestService("IDS_TEST", "create", this.props.Login.masterData, this.props.Login.userInfo, addTechniqueTestId,this.confirmMessage)}
                                                                        >
                                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                                    <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                                                                </Nav.Link>
                                                                
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row noGutters>
                                                            <Col md={12}>
                                                                <DataGrid
                                                                    primaryKeyField={"ntechniquetestcode"}
                                                                    data={this.state.data}
                                                                    dataResult={this.state.dataResult}
                                                                    dataState={this.state.testDataState}
                                                                    dataStateChange={this.dataStateChange}
                                                                    extractedColumnList={this.extractedColumnList}
                                                                    controlMap={this.state.controlMap}
                                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                                    inputParam={this.props.Login.inputParam}
                                                                    userInfo={this.props.Login.userInfo}
                                                                    
                                                                    deleteRecord={this.deleteTechniqueTest}
                                                                    deleteParam={{operation:"delete"}}
                                                                    methodUrl={"TechniqueTest"}
                                                                
                                                                    addRecord = {() => this.openModal(addId)}
                                                                    pageable={true}
                                                                    scrollable={'scrollable'}
                                                                
                                                                    isActionRequired={true}
                                                                    isToolBarRequired={false}
                                                                    selectedId={this.props.Login.selectedId}
                                                                />
                                                            </Col>
                                                        </Row>
                                                </Card>
                                                
                                            
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col></Row>
                    {/* </Col>
                </Row> */}
            </div>

            {/* End of get display*/}

            {/* Start of Modal Sideout for  Creation */}
            {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
            {this.props.Login.openModal || this.props.Login.openChildModal ?
                <SlideOutModal show={this.props.Login.screenName === "IDS_TEST"?
                this.props.Login.openChildModal:
                this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={this.props.Login.screenName === "IDS_TEST"  ? this.onSaveTechniqueTest: this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={this.props.Login.screenName === "IDS_TEST" ? 
                            this.props.Login.operation === "update" ? [] : this.mandatoryTestFields:
                            this.mandatoryFields}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : this.props.Login.openChildModal&&
                        this.props.Login.screenName === "IDS_TEST"  ? 
                            
                                <AddTechniqueTest
                                     selectedRecord={this.state.selectedRecord || {}}
                                     onComboChange={this.onComboChange}
                                     techniqueTestList={this.props.Login.techniqueTestList || []}/>
                                

                            : <AddType1Component
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                extractedColumnList={this.techniqueFieldList}
                            />
                      
                    }
                /> : ""}
            {/* End of Modal Sideout for User Creation */}
        </>
        );
    }

    confirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteTechnique("Technique", this.props.Login.masterData.SelectedTechnique, "delete", deleteId));
    }

    deleteTechnique = (methodUrl, SelectedTechnique, operation, ncontrolCode) => {
        

            const postParam = {
                inputListName: "Technique", selectedObject: "SelectedTechnique",
                primaryKeyField: "ntechniquecode",
                primaryKeyValue: SelectedTechnique.ntechniquecode,
                fetchUrl: "technique/getTechnique",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                classUrl: this.props.Login.inputParam.classUrl,
                methodUrl, postParam,
                inputData: {
                    "userinfo": this.props.Login.userInfo,
                    "technique": SelectedTechnique
                },
                operation,
                isClearSearch: this.props.Login.isClearSearch,
                selectedRecord: {...this.state.selectedRecord}
            }

            const masterData = this.props.Login.masterData;

            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData },
                        openModal: true, screenName: "IDS_TECHNIQUE", operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
            
    }

    deleteTechniqueTest = (deleteParam) =>{
       let postParam = { inputListName: "techniquetest", selectedObject: "TechniqueTest", primaryKeyField: "ntestcode",
        primaryKeyValue: deleteParam.selectedRecord.ntestcode,
         fetchUrl: "technique/getTechniqueTest", fecthInputObject: {ntechniquecode:this.props.Login.masterData.SelectedTechnique.ntechniquecode, userinfo: this.props.Login.userInfo },
         masterData: this.props.Login.masterData 
      }
        const inputParam = {
            classUrl: "technique",
            methodUrl: "TechniqueTest",
            
            inputData: {
                "techniquetest": deleteParam.selectedRecord,//.dataItem,
                "ntechniquecode":this.props.Login.masterData.SelectedTechnique.ntechniquecode,
                "userinfo": this.props.Login.userInfo
            },
            operation:"delete",postParam,
            testDataState:this.state.testDataState
        }

        rsapi.post("technique/getTechniqueConducted",{"ntechniquecode":this.props.Login.masterData.SelectedTechnique.ntechniquecode, 
        userinfo:this.props.Login.userInfo})
        .then(response=>{
          if(response.data!==null && response.data.length >0)
          {
                
            toast.warn(this.props.intl.formatMessage({ id: "IDS_TESTTRAININGALREADYCONDUCTED" }) );
            // dispatch({type: DEFAULT_RETURN, payload:{//pricingTestList:testList, 
            //     openChildModal:false,
            //     operation, screenName, ncontrolCode,
            //     loading:false}});
          }
          else
          {
            rsapi.post("technique/getTechniqueScheduled",{"ntechniquecode":this.props.Login.masterData.SelectedTechnique.ntechniquecode, 
            userinfo:this.props.Login.userInfo})
            .then(response=>{
              if(response.data!==null && response.data.length >0)
              {
                //this.confirmMessage = new ConfirmMessage();
                this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_TESTTRAININGSCHEDULED" }),
                this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
                () => { if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_TEST" }),
                            operation:deleteParam.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                }}
                );
              }
              else
              {
                if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: {
                            loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                            openModal: true, screenName: this.props.intl.formatMessage({ id: "IDS_TEST" }),
                            operation:deleteParam.operation
                        }
                    }
                    this.props.updateStore(updateInfo);
                }
                else {
                    this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
                }
              }
    
           })      
          }

       })

        
    }

    onSaveTechniqueTest = (saveType, formRef) => {

        const techniqueTestData = {"userinfo": this.props.Login.userInfo,
                                 "technique":this.props.Login.masterData.SelectedTechnique,
                                 "ntechniquecode":this.props.Login.masterData.SelectedTechnique.ntechniquecode};
 
         let postParam = undefined;
         let techniquetestDataState = undefined;
         let selectedId = null;
         
         if (this.props.Login.operation === "update") {
            
         }
         else {
             //add                                                 
             let techniquetestList = [];
             this.state.selectedRecord["ntestcode"] &&
                 this.state.selectedRecord["ntestcode"].map(item => {
                     return techniquetestList.push({
                        ntestcode: item.value                      
                     })
                 })
            
             techniqueTestData["techniquetestlist"] = techniquetestList;                             
 
         }
         if (techniqueTestData["technique"].hasOwnProperty('esignpassword')) {
             if (techniqueTestData["technique"]['esignpassword'] === '') {
                 delete techniqueTestData["technique"]['esigncomments']
                 delete techniqueTestData["technique"]['esignpassword']
                 delete techniqueTestData["technique"]['esignreason']
                 delete techniqueTestData["technique"]["agree"]
             }
         }
        
         const inputParam = {
             classUrl: this.props.Login.inputParam.classUrl,
             methodUrl: "TechniqueTest",
             inputData: techniqueTestData,
             operation: this.props.Login.operation,
             saveType, formRef, postParam, searchRef: this.searchRef,
             isClearSearch: this.props.Login.isClearSearch,
             selectedId, techniquetestDataState,
             selectedRecord: {...this.state.selectedRecord}
         }
         const masterData = this.props.Login.masterData;
 
         if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
 
             const updateInfo = {
                 typeName: DEFAULT_RETURN,
                 data: {
                     loadEsign: true, screenData: { inputParam, masterData }, saveType
                 }
             }
             this.props.updateStore(updateInfo);
         }
         else {            
             this.props.crudMaster(inputParam, masterData, "openChildModal");
         }
 
     }

    onSaveClick = (saveType, formRef) => {

        let techniqueData = [];
        techniqueData["userinfo"] = this.props.Login.userInfo;

        let postParam = undefined;

        if (this.props.Login.operation === "update") {
            // edit
            //postParam = { inputListName: "Technique", selectedObject: "SelectedTechnique", primaryKeyField: "ntechniquecode" };
            postParam = { inputListName: "Technique", selectedObject: "SelectedTechnique", primaryKeyField: "ntechniquecode",
        primaryKeyValue: this.props.Login.selectedRecord.ntechniquecode,
         fetchUrl: "technique/getActiveTechniqueById", fecthInputObject: {userinfo: this.props.Login.userInfo },
         masterData: this.props.Login.masterData 
      }
            techniqueData["technique"] = JSON.parse(JSON.stringify(this.props.Login.selectedRecord));
            techniqueData["stechniquename"]=this.state.selectedRecord["stechniquename"] || "";
            techniqueData["sdescription"]=this.state.selectedRecord["sdescription"] || "";

        }
        else {
            //add               
            techniqueData["technique"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode,
                                                "stechniquename":this.state.selectedRecord["stechniquename"] || "",
                                                "sdescription":this.state.selectedRecord["sdescription"] || "",
                                            };

            

        }
        if (techniqueData["technique"].hasOwnProperty('esignpassword')) {
            if (techniqueData["technique"]['esignpassword'] === '') {
                delete techniqueData["technique"]['esigncomments']
                delete techniqueData["technique"]['esignpassword']
                delete techniqueData["technique"]['esignreason']
            }
        }
      
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Technique",
            inputData: techniqueData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef,
            isClearSearch: this.props.Login.isClearSearch,
            selectedRecord: {...this.state.selectedRecord}
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }

    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({ userRoleControlRights, controlMap,
                    data: this.props.Login.masterData.Test,
                    dataResult: process(this.props.Login.masterData.TechniqueTest || [], this.state.testDataState), });
            }
            else {        
                let {testDataState} = this.state;
                if(this.props.Login.testDataState === undefined){
                    testDataState={skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                }         
                this.setState({
                    data: this.props.Login.masterData.TechniqueTest, selectedRecord: this.props.Login.selectedRecord,
                    dataResult: process(this.props.Login.masterData.TechniqueTest ||[],testDataState),
                    testDataState
                });
            }  
        }
    }
    openModal = (inputParam) => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                selectedRecord: {}, operation: inputParam.operation, ncontrolCode:inputParam.ncontrolcode, selectedId:null,
                openModal: true, screenName: this.props.intl.formatMessage({id:'IDS_TECHNIQUE'})
            }
        }
        this.props.updateStore(updateInfo);
    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            testDataState: event.dataState
        });
    }

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        let selectedId = this.state.selectedId;

        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};

                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""

                if( this.props.Login.screenName === "IDS_TEST"){
                    openChildModal=false
                }
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = ""
                selectedRecord['esigncomments'] = ""
                selectedRecord['esignreason']=""
                
            }
        }
        else {
            openModal = false;
            selectedRecord = {};
            selectedId = null;
            openChildModal=false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal,openChildModal, loadEsign, selectedRecord, selectedId }
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
    onInputOnChange = (event, primaryFieldKey) => {
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

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }
    reloadData = () => {
        this.searchRef.current.value = "";

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: "technique",
            methodUrl: "Technique",
            displayName: "IDS_TECHNIQUE",
            userInfo: this.props.Login.userInfo,
            isClearSearch: this.props.Login.isClearSearch

        };

        this.props.callService(inputParam);
    }


}
export default connect(mapStateToProps, {
    callService, crudMaster, validateEsignCredential,getTechniqueDetail,getEditTechniqueService,getAddTestService,
    updateStore,filterColumnData
})(injectIntl(Technique));

