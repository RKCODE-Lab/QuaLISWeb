import React from 'react'
import { Row, Col, Nav, } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import AddTest from './AddTest';
import Esign from '../audittrail/Esign';
import { transactionStatus } from '../../components/Enumeration';
import { showEsign } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

class TestTab extends React.Component {
    //const addUserMultiDeputyId = props.controlMap.has("AddUserMultiDeputy") && props.controlMap.get("AddUserMultiDeputy").ncontrolcode

    //const deputyAddParam = {screenName:"Deputy", operation:"create", primaryKeyField:"nusermultideputycode", 
    // primaryKeyValue:undefined, masterData:props.masterData, userInfo:props.userInfo,
    // ncontrolCode:addUserMultiDeputyId};

    constructor(props) {
        super(props);
        this.state = {
            selectedRecord: {}
        }
    }
    
    render() {
        // const extractedColumnList = [
        // ]
        // const detailedFieldList = [

        // ]
        const addTestId = this.props.controlMap.has("AddNewTest") ? this.props.controlMap.get("AddNewTest").ncontrolcode:-1;
        const addTestParam = {
            selectedsample: this.props.selectedSample,
            selectedsubsample: this.props.selectedSubSample,
            userinfo: this.props.userInfo,
            snspecsampletypecode: this.props.selectedSubSample && 
                [...new Set(this.props.selectedSubSample.map(x=>x.nspecsampletypecode))].join(",")
        };
        const methodUrl = "Test";
       const mandatoryFields=[  { "mandatory": true, "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }]
        return (
            <>
                <Row noGutters>
                    <Col md={12}>
                        <div className="actions-stripe d-flex justify-content-end">
                            <Nav.Link name="adddeputy" className="add-txt-btn"
                            // hidden={props.userRoleControlRights.indexOf(addUserMultiDeputyId) === -1}
                            onClick={()=>this.props.addMoreTest(addTestParam, addTestId)}
                            >
                                <FontAwesomeIcon icon={faPlus} /> { }
                                <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                            </Nav.Link>
                        </div>
                    </Col>
                </Row>
                <Row className="no-gutters">
                    <Col md={12}>
                        <DataGrid
                            primaryKeyField={this.props.primaryKeyField}
                            data={this.props.GridData}
                            dataResult={process(this.props.GridData || [], this.props.dataState)}
                            dataState={this.props.dataState}
                            dataStateChange={this.props.dataStateChange}
                            expandField={this.props.expandField}
                            detailedFieldList={this.props.detailedFieldList}
                            extractedColumnList={this.props.extractedColumnList}
                            userInfo={this.props.userInfo}
                            //controlMap={new Map()}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            inputParam={this.props.inputParam}
                            pageable={true}
                            isComponent={false}
                            isActionRequired={true}
                            isToolBarRequired={false}
                            scrollable={'scrollable'}
                            gridHeight={'500px'}
                            methodUrl={methodUrl}
                            cancelRecord={this.props.cancelRecord}
                        />
                    </Col>
                </Row>
            
                <SlideOutModal
                    show={ this.props.openChildModal } 
                    closeModal={ this.closeModal }  
                    operation={ this.props.operation }
                    inputParam={ this.props.inputParam }  
                    screenName={ this.props.screenName }  
                    mandatoryFields={mandatoryFields}
                    selectedRecord={this.state.selectedRecord}
                    esign={ this.props.loadEsign }
                    validateEsign={ this.validateEsign }  
                    onSaveClick={ this.onSaveTest }
                    addComponent={ this.props.loadEsign ?
                        <Esign
                            operation={ this.props.operation }
                            onInputOnChange={ this.onEsignInputOnChange }
                            inputParam={ this.props.inputParam }                                               
                            selectedRecord={ this.state.selectedRecord || {} }
                        />: this.props.screenName === "IDS_TEST"? 
                        <AddTest
                            TestCombined={this.props.availableTest}
                            selectedTestData={this.state.selectedRecord}
                            TestChange={this.onComboChange}
                        />: ""
                    }
                />
            </>
        )
    }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.state.selectedRecord;
        let screenName = this.props.screenName;
        if (this.props.loadEsign) {
            loadEsign = false;
        } else {
            openChildModal = false;
            selectedRecord = {};
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, screenName }
        }
        this.props.updateStore(updateInfo);
    }

    onEsignInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES: transactionStatus.NO;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onSaveTest = (saveType, formRef) => {
        const masterData = this.props.masterData;
        const ntransactionsamplecode = masterData.selectedSubSample.map(x=>x.ntransactionsamplecode);
        const inputData = {
            TestGroupTest: this.state.selectedRecord.ntestgrouptestcode.map(value=> value.item),
            RegistrationSample: ntransactionsamplecode,
            ntransactionsamplecode: ntransactionsamplecode.join(","),
            userinfo: this.props.userInfo,
            nregtypecode: masterData.RealRegTypeValue.nregtypecode,
            nregsubtypecode: masterData.RealRegSubTypeValue.nregsubtypecode,
            nsampletypecode: masterData.RealSampleTypeValue.nsampletypecode,
            ntype: 3,
            npreregno: Array.from(new Set( masterData.selectedSubSample.map(x=>x.ntransactionsamplecode))).join(",")
        }
        const inputParam = {
            inputData,
            classUrl: "registration",
            operation: this.props.operation,
            methodUrl: "Test",
            responseKeyList: [{"responseKey": "selectedTest", "masterDataKey": "RegistrationGetTest", "primaryKey": "ntransactiontestcode"}],
            saveType, formRef
        }
        if(showEsign(this.props.controlMap, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign:true, screenData:{inputParam, masterData}, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.createRegistrationTest(inputParam, masterData, "openChildModal");
        }
    }

    validateEsign = () =>{
        const inputParam = {
            inputData: {"userinfo":  {
                                ...this.props.userInfo, 
                                sreason: this.state.selectedRecord["esigncomments"] ,
                                nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                                spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
                           
                            },
                            password : this.state.selectedRecord["esignpassword"]
                        },
            screenData : this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }

    componentDidUpdate(previousProps) {
        if (this.props.selectedRecord !== previousProps.selectedRecord ){             
            this.setState({selectedRecord: this.props.selectedRecord});
        }
    }
}
export default injectIntl(TestTab);