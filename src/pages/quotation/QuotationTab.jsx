import React from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';  //FormattedMessage,
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import QuotationDetailTab from './QuotationDetailTab';
import QuotationHistoryTab from './QuotationHistoryTab';
import QuotationVATCalculationTab from './QuotationVATCalculationTab';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import AddQuotationTest from "./AddQuotationTest";
import EditQuotationTestPricing from "./EditQuotationTestPricing";
import AddGrossQuotation from "./AddGrossQuotation";

class QuotationTab extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };

        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'Quotation-tab',
            dataState: dataState

        };

        this.quotationdetailColumnList = [

            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },        
            { "idsName": "IDS_METHODNAME", "dataField": "smethodname", "width": "200px" },
            { "idsName": "IDS_LEADTIME", "dataField": "squotationleadtime", "width": "200px" }, 
            { "idsName": "IDS_DESCRIPTION", "dataField": "stestplatform", "width": "200px" }, 
            { "idsName": "IDS_DISCOUNTBAND", "dataField": "sdiscountbandname", "width": "200px" }, 
            { "idsName": "IDS_COST", "dataField": "ncost", "width": "100px" },
            { "idsName": "IDS_NUMBEROFSAMPLES", "dataField": "nnoofsamples", "width": "150px" },
            { "idsName": "IDS_TOTALAMOUNT", "dataField": "ntotalamount", "width": "200px" },
            { "idsName": "IDS_NOTES", "dataField": "snotes", "width": "200px" }

        ]

    }


    // findMandatoryFields(screenName, selectedRecord, operation) {

    //     let mandatoryFields = [];
    //     if (screenName === "IDS_TEST") {

    //       mandatoryFields = [{ "idsName": "IDS_TEST", "dataField": "ntestcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];
            
    //       return mandatoryFields;
    //     }else {
    //         return mandatoryFields;
    //       }
      
    //   }

    render() {

         let mandatoryFields = [];

        if (this.props.screenName === 'IDS_TEST') {

            mandatoryFields = [{ "idsName": "IDS_TEST", "dataField": "ntestcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];

        }

        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </Card>
                    </Col>
                </Row>

                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        size={this.props.modalScreenSize===true ? "xl" : "lg" }
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.props.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.props.selectedRecord || {}}
                   //   mandatoryFields={this.props.screenName === "IDS_MEMBERS" ? mandatoryFields : mandatoryFields || []}
                        mandatoryFields={mandatoryFields || []}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.props.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.props.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_TEST" ?

                            <AddQuotationTest

                            QuotationTestList={this.props.QuotationTestList}
                            selectedRecord={this.props.selectedRecord || {}}
                            onComboChange={this.props.onComboChange}
           
                            />  :
                            this.props.screenName === "IDS_PRICE" ?

                            <EditQuotationTestPricing

                             onnetAmountEvent={this.props.onnetAmountEvent}
                             selectedRecord={this.props.selectedRecord || {}}
                             onInputOnChange={this.props.onInputOnChange}
                             onNumericInputChange={this.props.onNumericInputChange}
                             DiscountBand={this.props.DiscountBand}
                             onComboChange={this.props.onComboChange}
                             onFocus={this.props.onFocus}

                            /> :  this.props.screenName === "IDS_CALCULATEPRICING" ?

                            <AddGrossQuotation
            
                              DiscountBand={this.props.DiscountBand}
                              VATBand={this.props.VATBand} 
                              selectedRecord={this.props.selectedRecord || {}}
                          //  QuotationTest={this.props.Login.QuotationTest}
                              onComboChange={this.props.onComboChange}
                              onInputOnChange={this.onInputOnChange}
                      //      DiscountAmount={this.state.selectedRecord.DiscountAmount === undefined ? 0.00 :this.state.selectedRecord.DiscountAmount }
                              DiscountAmount={this.props.selectedRecord.DiscountAmount !== undefined ? this.props.selectedRecord.DiscountAmount:this.props.QuotationGrossAmount[0].ndiscountamount}
                    //        VatAmount={this.state.selectedRecord.VatAmount === undefined ? 0.00 : this.state.selectedRecord.VatAmount}
                              VatAmount={this.props.selectedRecord.VatAmount !== undefined ? this.props.selectedRecord.VatAmount:this.props.QuotationGrossAmount[0].nvatamount}
                              QuotationGrossAmount={this.props.QuotationGrossAmount === undefined ? 0.00 : this.props.QuotationGrossAmount} 
                              TotalNetAmount={this.props.selectedRecord.TotalNetAmount !== undefined ? this.props.selectedRecord.TotalNetAmount:this.props.QuotationGrossAmount[0].ntotalgrossamount}
                            /> : ""
                        }

                    />
                }
            </>

        )

    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }


    tabDetail = () => {

      const addQuotationTestId = this.props.controlMap.has("AddQuotationTest") && this.props.controlMap.get("AddQuotationTest").ncontrolcode;
      const updateQuotationTestId = this.props.controlMap.has("EditQuotationTest") && this.props.controlMap.get("EditQuotationTest").ncontrolcode;
      const grossQuotationeId = this.props.controlMap.has("CalculatePricing") && this.props.controlMap.get("CalculatePricing").ncontrolcode;

        // const projectmasterAddParam = {
        //     screenName: "IDS_MEMBERS", operation: "create", primaryKeyField: "nprojectmembercode",
        //     masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addteammembersId
        // };

        // const projectmasterDeleteParam = {

        //     //    screenName: "IDS_MEMBERS", methodUrl: "ProjectMember", operation: "delete", ncontrolCode: deleteteammembersId 

        //     screenName: "IDS_MEMBERS", operation: "delete", primaryKeyField: "nprojectmembercode",
        //     masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: deleteteammembersId
        // };

        const tabMap = new Map();

        tabMap.set("IDS_DETAILS", <QuotationDetailTab

            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addTitleIDS={"IDS_DETAILS"}
            addTitleDefaultMsg={'Details'}
            primaryKeyField={"nquotationtestcode"}
            masterData={this.props.masterData}
            primaryList={"Details"}
            dataResult={this.props.dataResult}
            dataState={this.props.dataState}
            dataStateChange={this.props.dataStateChange}
            columnList={this.quotationdetailColumnList}
            deleteRecord={this.props.deleteRecord}
            // deleteParam={projectmasterDeleteParam} --
            addQuotationTestId={addQuotationTestId}
            updateQuotationTestId={updateQuotationTestId}
            editTestPriceParam={this.props.editParam}
            data={this.props.data}
            // getQuotationPricingEditService={this.props.fetchRecord}
            selectedId={this.props.selectedId}
            getQuotationAddTestService={this.props.getQuotationAddTestService}
            getQuotationPricingEditService={this.props.getQuotationPricingEditService}
           

        />)

        tabMap.set("IDS_ESTIMATION", <QuotationVATCalculationTab

            userInfo={this.props.userInfo}
            addTitleIDS={"IDS_ESTIMATION"}
            addTitleDefaultMsg={'Estimation'}
            primaryKeyField={"nquotationtestcode"}
            primaryList={"Estimation"}     
            grossQuotationeId={grossQuotationeId}
            selectedQuotation={this.props.selectedQuotation}
            userRoleControlRights={this.props.userRoleControlRights}
            GrossQuotation={this.props.GrossQuotation}
            EstimateQuotation={this.props.EstimateQuotation}

        />)

        tabMap.set("IDS_HISTORY", <QuotationHistoryTab

        controlMap={this.props.controlMap}
        userRoleControlRights={this.props.userRoleControlRights}
        userInfo={this.props.userInfo}
        inputParam={this.props.inputParam}
        // screenName="IDS_FILE"
        QuotationHistorydata={this.props.QuotationHistorydata}
        QuotationHistorydataResult={this.props.QuotationHistorydataResult}
        dataState={this.props.dataState}
        historydataStateChange={this.props.historydataStateChange}

    />);
  
        return tabMap;
    }


    closeModal = () => {

        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        //    let selectedRecord = this.state.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = '';
                selectedRecord['esigncomments'] = '';
                selectedRecord['esignreason'] = '';
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);

    }


    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.props.selectedRecord["esigncomments"],
                    nreasoncode: this.props.selectedRecord["esignreason"] && this.props.selectedRecord["esignreason"].value,
                    spredefinedreason: this.props.selectedRecord["esignreason"] && this.props.selectedRecord["esignreason"].label,

                },
                password: this.props.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
}


export default injectIntl(QuotationTab);

