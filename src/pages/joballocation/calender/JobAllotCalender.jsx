import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllottedTestWise } from '../../../actions'
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal'
import Esign from "../../audittrail/Esign";
import { constructOptionList } from "../../../components/CommonScript";
import rsapi from "../../../rsapi";
import Axios from "axios";
import { toast } from "react-toastify";
import AddBarcode from "./AddBarcode";
import Preloader from '../../../components/preloader/preloader.component'


class JobAllotCalender extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedRecord: "",
            ncontrolCode: -1,
            nbarcodeprint: 1,
            BarcodeList: [],
            operation: "Printbarcode",
            Printer: [],
            openBarcodeModal: false,
            loadEsign: false,
            loadBarcode: false,
            loading: false,
        }
    }


    AllotJobStatus(allotId, testskip, testtake, type) {
        let testList = [];
        if (this.props.Login.masterData.searchedTest !== undefined) {
            testList = getSameRecordFromTwoArrays(this.props.Login.masterData.searchedTest, this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake), "ntransactiontestcode");
        } else {
            testList = this.props.Login.masterData.JA_TEST
                && this.props.Login.masterData.JA_TEST.slice(testskip, testskip + testtake);
        }
        let allotList = getSameRecordFromTwoArrays(testList || [], this.props.Login.masterData.JASelectedTest, "ntransactiontestcode");
        if (type !== 1 && allotList && allotList.length !== 1) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTONETEST" }));
        } else {

            if (allotList && allotList.length > 0) {
                let testList = this.props.Login.masterData.JASelectedTest;

                let tempsection = 0;
                let sectionvalue = 0;
                let sectionflag = true;
                testList.forEach((item) => {
                    sectionvalue = item.nsectioncode;
                    if (sectionvalue !== tempsection && tempsection !== 0) {
                        sectionflag = false;
                    } else {
                        tempsection = sectionvalue;
                    }
                });

                let tempinstrument = 0;
                let instrumentvalue = 0;
                let instrumentcategoryflag = true;
                testList.forEach((item) => {
                    instrumentvalue = item.ninstrumentcatcode;
                    if (instrumentvalue !== tempinstrument && tempinstrument !== 0) {
                        instrumentcategoryflag = false;
                    } else {
                        tempinstrument = instrumentvalue;
                    }
                });


                if (sectionflag) {
                    if (instrumentcategoryflag) {
                        let JASelectedTest = this.props.Login.masterData.JASelectedTest;
                        let obj = convertDateValuetoString(this.props.Login.masterData.realFromDate, this.props.Login.masterData.realToDate, this.props.Login.userInfo);


                        let arr = [];
                        JASelectedTest && JASelectedTest.map((item) => {
                            if (!arr.includes(item.nsectioncode)) {
                                arr.push(item.nsectioncode)
                            }
                        }
                        )

                    
                        let inputParam = {};
                        let Map = {
                            fromdate: obj.fromDate,
                            todate: obj.toDate,
                            nsampletypecode: this.props.Login.masterData.realSampleTypeValue.nsampletypecode,
                            nregtypecode: this.props.Login.masterData.realRegTypeValue.nregtypecode,
                            nregsubtypecode: this.props.Login.masterData.realRegSubTypeValue.nregsubtypecode,
                            ndesigntemplatemappingcode: this.props.Login.masterData.realDesignTemplateMappingValue.ndesigntemplatemappingcode,
                            ntransactionstatus: this.props.Login.masterData.realFilterStatusValue.ntransactionstatus,
                            napprovalversioncode: this.props.Login.masterData.realApprovalVersionValue.napprovalversioncode,
                            //nsectioncode: this.props.Login.masterData.realUserSectionValue ? this.props.Login.masterData.realUserSectionValue.nsectioncode === -1 ? this.props.Login.masterData.UserSection.map(section => section.nsectioncode).join(',') : String(this.props.Login.masterData.realUserSectionValue.nsectioncode) : null,
                            nsectioncode: arr.map(nsectioncode => nsectioncode).join(","),
                            ntestcode: this.props.Login.masterData.realTestValue ? this.props.Login.masterData.realTestValue.ntestcode === 0 ? this.props.Login.masterData.Test.map(test => test.ntestcode).join(',') : String(this.props.Login.masterData.realTestValue.ntestcode) : null,
                            npreregno: JASelectedTest ? JASelectedTest.map(sample => sample.npreregno).join(",") : "",
                            ntransactionsamplecode: JASelectedTest ? JASelectedTest.map(subsample => subsample.ntransactionsamplecode).join(",") : "",
                            transactiontestcode: JASelectedTest ? JASelectedTest.map(test => test.ntransactiontestcode).join(",") : "",
                            ntransactiontestcode: 0,
                            ncontrolcode: allotId,
                            nneedsubsample: this.props.Login.masterData.realRegSubTypeValue.nneedsubsample,
                            nneedtemplatebasedflow: this.props.Login.masterData.realRegSubTypeValue.nneedtemplatebasedflow,
                            checkBoxOperation: 3,
                            userinfo: this.props.Login.userInfo,
                            masterData: this.props.Login.masterData,
                            operation: type === 1 ? 'AllotJob' : 'AllotJobCalendar'
                        }
                        inputParam = {
                            inputData: Map,
                        }
                        this.props.getAllottedTestWise(inputParam);
                    } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMEINSTRUMENTCATEGORYTEST" }));

                    }
                } else {
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMESECTIONTEST" }));
                }
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }));
            }
        }

    }



    openBarcodeModal = (selectedMaster, ncontrolCode, userinfo) => {
        this.setState({ loading: true })
        let urlArray = [];
        const getPrinter = rsapi.post("barcode/getPrinter", userinfo);
        const getControlBasedBarcode = rsapi.post("barcodeconfiguration/checkConfiguration", { selectedMaster, ncontrolCode, userinfo, Multiselect: Array.isArray(selectedMaster) });
        urlArray = [getPrinter, getControlBasedBarcode]

        Axios.all(urlArray).then(response => {

            const printer = constructOptionList(response[0].data || [], "sprintername",
                "sprintername", undefined, undefined, true).get("OptionList");

            const barcode = constructOptionList(response[1].data.Barcode || [], "sbarcodename",
                "sbarcodename", undefined, undefined, true).get("OptionList");

            const selectedRecord = {}

            if (printer.length > 0)
                selectedRecord['sprintername'] = printer[0];

            if (barcode.length > 0) selectedRecord['nbarcode'] = barcode[0];
            selectedRecord['nbarcodeprint'] = 1


            this.setState({
                openBarcodeModal: true, ncontrolCode, Printer: printer,
                BarcodeList: barcode, operation: "Printbarcode",
                nbarcodeprint: response[1].data.nbarcodeprint, selectedRecord, loadBarcode: true, loading: false
            })
        }).catch(error => {

            // dispatch(initRequest(false));

            if (error.response.status === 500) {

                toast.error(error.message);

            } else {

                toast.warn(this.props.intl.formatMessage({

                    id: error.response.data

                }));
            }
        })
    }


    barcodeGeneration = () => {
        //dispatch(initRequest(true));
        this.setState({ loading: true })
        let list = []
        const selectedMaster = this.props.selectedMaster
        if (Array.isArray(selectedMaster)) {
            list = selectedMaster
        } else {
            list.push(selectedMaster)
        }
        rsapi.post("barcodeconfiguration/barcodeGeneration", {
            selectedMaster: list, ncontrolCode: this.state.ncontrolCode,
            userinfo: this.props.userInfo, nbarcode: this.state.selectedRecord.nbarcode.item.nbarcode, sprintername: this.state.selectedRecord.sprintername.value,
            nbarcodeprintcount: this.state.selectedRecord.nbarcodeprintcount ? this.state.selectedRecord.nbarcodeprintcount : 1
        })
            .then(response => {
                toast.info(response.data)
                this.setState({ openBarcodeModal: false, loadEsign: false, selectedRecord: {}, Printer: [], BarcodeList: [], loading: false })
            })

            .catch(error => {

                if (error.response.status === 500) {

                    toast.error(error.message);

                } else {

                    toast.warn(this.props.intl.formatMessage({

                        id: error.response.data

                    }));

                }

            })

    }


    onNumericInputChange = (value, name) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[name] = value;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            if (event.target.name === 'nclientprinter' && event.target.checked === true) {
                //const printers =   window.navigator.printer.getPrinters();
                /////const names = printers.map(printer => printer.name);

                //selectedPrinterDatas {printername: { = names;
                // this.setState({ selectedPrinterData });
            }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }


    closeModal = () => {
        let loadEsign = this.state.loadEsign;
        let openBarcodeModal = this.state.openBarcodeModal;
        let selectedRecord = this.state.selectedRecord;

        if (loadEsign) {
            this.setState({ loadEsign: false, loading: false })
        }
        else {
            this.setState({ loadEsign: false, openBarcodeModal: false, selectedRecord: {}, loading: false })
        }

    }


    mandatoryFields = () => {

        const mandatory = [
            { "mandatory": true, "idsName": "IDS_BARCODENAME", "dataField": "nbarcode", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
            { "mandatory": true, "idsName": "IDS_PRINTER", "dataField": "sprintername", "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" },
        ]

        return mandatory;
    }


    render() {
       // const allotCalenderId = this.props.controlMap && this.props.controlMap.has(this.props.methodUrl) && this.props.controlMap.get(this.props.methodUrl).ncontrolcode;
        return (
            <>

                <Preloader loading={this.state.loading} />

                <Nav.Link
                    className="btn btn-circle outline-grey ml-2"
                    data-tip={this.props.intl.formatMessage({ id: "IDS_ALLOTJOBINCALENDER" })}
                    hidden={this.props.userRoleControlRights.indexOf(this.props.allotCalenderId) === -1}
                    onClick={() => this.AllotJobStatus(this.props.allotCalenderId, this.props.testskip, this.props.testtake, 2)} >
                    <FontAwesomeIcon icon={faCalendar} />
                </Nav.Link>

                {this.state.openBarcodeModal &&
                    <SlideOutModal
                        show={this.state.openBarcodeModal}
                        closeModal={this.closeModal}
                        operation={this.state.operation}
                        inputParam={{ methodUrl: this.props.methodUrl }}
                        screenName={this.props.screenName}
                        onSaveClick={this.barcodeGeneration}
                        esign={this.state.loadEsign}
                        validateEsign={this.validateEsign}
                        // masterStatus={this.props.Login.masterStatus}
                        // updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={this.mandatoryFields()}
                        addComponent={this.state.loadEsign ?
                            <Esign operation={this.state.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                //inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> : <AddBarcode
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onNumericInputChange={this.onNumericInputChange}
                                onComboChange={this.onComboChange}
                                BarcodeList={this.state.BarcodeList}
                                Printer={this.state.Printer}
                                nbarcodeprint={this.state.nbarcodeprint}
                            >
                            </AddBarcode>
                        }
                    ></SlideOutModal>

                }
            </>

        )
    }

}

const mapStateToProps = state => {
    return ({ Login: state.Login })
}


export default connect(mapStateToProps, {getAllottedTestWise})(injectIntl(JobAllotCalender));