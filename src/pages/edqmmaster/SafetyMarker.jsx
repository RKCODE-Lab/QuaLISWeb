import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../../pages/audittrail/Esign';
import AddSafetyMarker from '../edqmmaster/AddSafetyMarker';
import DataGrid from '../../components/data-grid/data-grid.component';
import { ListWrapper } from '../../components/client-group.styles'
import { callService, crudMaster, fetchRecordSafetyMarker, getTestMasterDataService, updateStore, validateEsignCredential } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, getControlMap } from '../../components/CommonScript';
import {transactionStatus} from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class SafetyMarker extends React.Component {
    constructor(props) {
        super(props)

        this.formRef = React.createRef();
        this.extractedColumnList = [];

        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            // addScreen: false, 
            data: [], masterStatus: "", error: "", selectedRecord: {},
            dataResult: [],
            dataState: dataState,
            testCategory: [], testMaster: [], ntestcode: [],
            isOpen: false, controlMap: new Map(), userRoleControlRights: []
        }
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
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
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
            data: { openModal, loadEsign, selectedRecord, selectedId:null }
        }
        this.props.updateStore(updateInfo);

    }
    //    getTestMasterDataService(nTestCategoryCode, selectedRecord) {

    //         rsapi.post("testmaster/getTestMasterBasedOnTestCategory", { "userinfo": this.props.Login.userInfo, "ntestcategorycode": parseInt(nTestCategoryCode) })
    //             .then(response => {

    //                 this.setState({
    //                     testMaster: response.data, selectedRecord
    //                 });

    //             }).catch(error => {
    //                 console.log('error: ', error);
    //             })

    //     }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;//{ addScreen: props.Login.showScreen }
    }

    handleChange = (value, valueParam, isTestCategory) => {

        if (value !== null) {
            const selectedRecord = this.state.selectedRecord || {};

            selectedRecord[valueParam] = value;

            if (isTestCategory === "TestCategory") {
                this.props.getTestMasterDataService(value.value, selectedRecord, this.props.Login.userInfo);
                // selectedRecord.ntestcode = "";
                selectedRecord["ntestcode"] = undefined;
                // {
                //     label: "",
                //     value: -1
                // }
                this.setState({ selectedRecord });
            }
            else {
                this.setState({ selectedRecord });
            }

        }
    }

    render() {

        let primaryKeyField = "";

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        primaryKeyField = "nsafetymarkercode";
        const addParam = {
            screenName: this.props.Login.screenName,
            primaryKeyField, undefined, operation: "create", inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, addId, data: this.state.data
        }

        // this.extractedColumnList = ["nsafetymarkercode", "ntestcategorycode", "ntestcode", "ntransactionstatus", "stestcategoryname",
        //     "ssafetymarkername", "ssafetymarkerdesc", "stestname", "suploadtoedqm"];
        this.mandatoryColumnList = [
            { "idsName": "IDS_SAFETYMARKERNAME", "dataField": "ssafetymarkername", "mandatory": true  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},           
            { "idsName": "IDS_TESTCATEGORY", "dataField": "ntestcategorycode","mandatory": true  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
            { "idsName": "IDS_TESTNAME", "dataField": "ntestcode", "mandatory": true  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
        ];
        this.extractedColumnList = [
            { "idsName": "IDS_SAFETYMARKERNAME", "dataField": "ssafetymarkername", "width": "200px" },
            { "idsName": "IDS_TESTNAME", "dataField": "stestname", "width": "300px" },
            { "idsName": "IDS_UPLOADTOEDQM", "dataField": "suploadtoedqm", "width": "200px", "isIdsField": true, "controlName": "ntransactionstatus" }
        ];
        this.detailedFieldList = [
             { "idsName": "IDS_TESTCATEGORY", "dataField": "stestcategoryname", "width": "200px" },
             { "idsName": "IDS_DESCRIPTION", "dataField": "ssafetymarkerdesc", "width": "400px" },
           
        ];
        const editParam = {
            screenName: this.props.Login.screenName, primaryKeyField: "nsafetymarkercode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editId, data: this.state.data
        };
        const deleteParam = { operation: "delete" };
        // const AddParam = {screenName:this.props.Login.inputParam && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation:"create",  primaryKeyField, 
        //inputParam:this.props.Login.inputParam,   userInfo:this.props.Login.userInfo, data:this.state.data, ncontrolCode:addId};


        // const editParam = {screenName:this.props.Login.inputParam && this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }), operation:"update",  primaryKeyField, 
        // inputParam:this.props.Login.inputParam,   userInfo:this.props.Login.userInfo, data:this.state.data, ncontrolCode:editId};

        // const deleteParam ={operation:"delete"};
        const mandatoryFields=[];
        this.mandatoryColumnList.forEach(item=>item.mandatory === true ? 
            mandatoryFields.push(item) :""
        );  

        return (
            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                          
                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={primaryKeyField}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    detailedFieldList={this.detailedFieldList}
                                    expandField="expanded"
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.fetchRecordSafetyMarker}
                                    editParam={editParam}
                                    deleteParam={deleteParam}
                                    deleteRecord={this.deleteRecord}                                   
                                    reloadData={this.reloadData}
                                    addRecord = {() => this.props.fetchRecordSafetyMarker(addParam)}
                                    // isComponent={true}
                                    gridHeight = {"600px"}
                                    scrollable = {"scrollable"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    selectedId={this.props.Login.selectedId}
                                   // pageable={{ buttonCount: 4, pageSizes: true }}
                                    pageable={true}
                                />
                                : ""}

                        </ListWrapper>
                    </Col>
                </Row>
                {this.props.Login.openModal &&
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
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={mandatoryFields}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign operation={this.props.Login.operation}
                            //formatMessage={this.props.intl.formatMessage}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        :
                        <AddSafetyMarker
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            handleChange={this.handleChange}
                           // formatMessage={this.props.intl.formatMessage}

                            testCategory={this.props.Login.testCategory||[]}
                            testMaster={this.props.Login.testMaster||[]}

                            ntestcode={this.props.Login.ntestcode || []}
                            ntestcategorycode={this.props.Login.ntestcategorycode || []}

                            extractedColumnList={this.extractedColumnList}
                        />
                    }
                />
    }
            </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, this.state.dataState),
                });
            }
            else {
                let { dataState }=this.state;
                if(this.props.Login.dataState===undefined){
                    dataState={skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5}
                }   
                this.setState({
                    data: this.props.Login.masterData,
                    isOpen: false,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }

    // fetchRecord = (primaryKeyName, primaryKeyValue, operation) => {
    //     //  this.props.Login.showScreen = true;

    //     const testCategory = rsapi.post("testcategory/getTestCategory", { "userinfo": this.props.Login.userInfo });

    //     let urlArray = [];
    //     let nTestCategoryCode = 0;
    //     if (operation === "update") {

    //         this.state.data.map(item => {
    //             if (item.nsafetymarkercode === parseInt(primaryKeyValue)) {
    //                 return nTestCategoryCode = item.ntestcategorycode;
    //             }
    //             return nTestCategoryCode;
    //         })
    //         const safetyMarker = rsapi.post(this.props.Login.inputParam.classUrl + "/getActiveSafetyMarkerById", { [primaryKeyName]: primaryKeyValue, "userinfo": this.props.Login.userInfo });
    //         const testMasterData = rsapi.post("testmaster/getTestMasterBasedOnTestCategory", { "userinfo": this.props.Login.userInfo, "ntestcategorycode": parseInt(nTestCategoryCode) });

    //         urlArray = [testCategory, testMasterData, safetyMarker];
    //     }
    //     else {
    //         urlArray = [testCategory];
    //     }

    //     Axios.all(urlArray)
    //         .then(Axios.spread((...response) => {

    //             // console.log("Edit : ", response[2].data);
    //             let ntestcategorycode = [];
    //             let ntestcode = [];

    //             if (operation === "update") {
    //                 ntestcategorycode.push({
    //                     label: response[2].data["stestcategoryname"],
    //                     value: response[2].data["ntestcategorycode"]
    //                 });

    //                 ntestcode.push({
    //                     label: response[2].data["stestname"],
    //                     value: response[2].data["ntestcode"]
    //                 });
    //             }
    //             // console.log(" Combo data: ", this.state.ntestcode[0]);
    //             this.setState({
    //                 testCategory: response[0].data, testMaster: operation === "update" ? response[1].data : [],
    //                 ntestcategorycode, ntestcode: ntestcode,
    //                 isOpen: true, selectedRecord: operation === "update" ? response[2].data : undefined, operation: operation

    //             });
    //         }))

    //         .catch(error => {
    //             if (error.response.status === 500) {
    //                 toast.error(error.message);
    //             }
    //             else {
    //                 toast.warn(error.response.data);
    //             }
    //         })
    // }


    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
            else {
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    deleteRecord = (deleteParam) => {
        if(deleteParam.selectedRecord.expanded !== undefined)           
        {
           delete deleteParam.selectedRecord.expanded;
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {
                [this.props.Login.inputParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },
            operation: deleteParam.operation,
            dataState: this.state.dataState
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        //this.props.crudMaster(inputParam);
    }  
    reloadData = () => {
        const inputParam = {
            inputData: { //"nsitecode": this.props.Login.userInfo.nmastersitecode 
            userinfo:this.props.Login.userInfo
        },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }
    onSaveClick = (saveType, formRef) => {
        //add / edit  
        let dataState = undefined;
        let operation = "";
        let inputData = [];
        let selectedId = null;
        // let fieldList = ["nsafetymarkercode", "ntestcategorycode", "ntestcode", "ntransactionstatus",
        //     "ssafetymarkername", "ssafetymarkerdesc"];

        inputData["userinfo"] = this.props.Login.userInfo;

        if (this.props.Login.operation === "update") {
            // edit    
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord)); 
            // fieldList.map(item => {
            //     return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item] ? this.state.selectedRecord[item] : "";
            // })
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nsafetymarkercode"] = this.state.selectedRecord["nsafetymarkercode"] ? this.state.selectedRecord["nsafetymarkercode"] : -1;
            //inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ntestcategorycode"] = this.state.selectedRecord["ntestcategorycode"] ? this.state.selectedRecord["ntestcategorycode"].value : -1;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ntestcode"] = this.state.selectedRecord["ntestcode"] ? this.state.selectedRecord["ntestcode"].value : -1;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.NO;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ssafetymarkername"] = this.state.selectedRecord["ssafetymarkername"] ? this.state.selectedRecord["ssafetymarkername"] : "";
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ssafetymarkerdesc"] = this.state.selectedRecord["ssafetymarkerdesc"] ? this.state.selectedRecord["ssafetymarkerdesc"] : "";


            operation = "update";
            dataState = this.state.dataState;
            selectedId = this.props.Login.selectedId; 
        }
        else {
            //add             
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };

            // fieldList.map(item => {
            //     return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            // })

            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nsafetymarkercode"] = this.state.selectedRecord["nsafetymarkercode"] ? this.state.selectedRecord["nsafetymarkercode"] : -1;
            //inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ntestcategorycode"] = this.state.selectedRecord["ntestcategorycode"] ? this.state.selectedRecord["ntestcategorycode"].value : -1;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ntestcode"] = this.state.selectedRecord["ntestcode"] ? this.state.selectedRecord["ntestcode"].value : -1;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ntransactionstatus"] = this.state.selectedRecord["ntransactionstatus"] ? this.state.selectedRecord["ntransactionstatus"] : transactionStatus.NO;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ssafetymarkername"] = this.state.selectedRecord["ssafetymarkername"] ? this.state.selectedRecord["ssafetymarkername"] : "";
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ssafetymarkerdesc"] = this.state.selectedRecord["ssafetymarkerdesc"] ? this.state.selectedRecord["ssafetymarkerdesc"] : "";


         
            operation = "create";
        }
        inputData["edqmsafetymarker"]["ntestcategorycode"] = this.state.selectedRecord["ntestcategorycode"]?this.state.selectedRecord["ntestcategorycode"].value ? this.state.selectedRecord["ntestcategorycode"].value:this.state.selectedRecord["ntestcategorycode"] : -1;
        //inputData["edqmsafetymarker"]["ntestcode"] =  this.props.Login["ntestcode"] ?this.state.selectedRecord["ntestcode"].value  ? 
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: operation, saveType, formRef, dataState, selectedId
        }
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
        //this.props.crudMaster(inputParam);

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

}
export default connect(mapStateToProps, { callService, crudMaster, fetchRecordSafetyMarker, getTestMasterDataService, updateStore, validateEsignCredential })(injectIntl(SafetyMarker));