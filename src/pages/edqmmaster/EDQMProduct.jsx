import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import Esign from '../audittrail/Esign';
import AddEDQMProduct from './AddEDQMProduct';

import { ListWrapper } from '../../components/client-group.styles';
import { Row, Col, FormGroup, FormLabel } from 'react-bootstrap';//, Card, Form, Modal
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { MediaLabel } from '../../components/add-client.styles';
import rsapi from '../../rsapi';
import Axios from 'axios';
import { callService, crudMaster, updateStore, validateEsignCredential, edqmProductFetchRecord } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { constructOptionList, getControlMap, showEsign } from '../../components/CommonScript';
import { transactionStatus } from '../../components/Enumeration';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EDQMProduct extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];
       


        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            addScreen: false, data: [], masterStatus: "", error: "", operation: "create",
            dataResult: [],
            dataState: dataState,
            productDomainData: [], productDescData: [], productTypeData: [], bulkTypeData: [], componentBulkData: [],
            masterFileData: [], safetyFileData: [],
            productTypeByID: [], productTypeMandatory: 0,
            safetyMarkByID: [], isOpen: false,
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {},
            nproductdomaincode: [], nproductdesccode: [], nproducttypecode: [], nbulktypecode: [],
            ncomponentbulkgroupcode: [], nmasterfiletypecode: [], nsafetymarkercode: [],
            //mandatoryFields:[]

            validationColumnList: [
                { "idsName": "IDS_PRODUCTNAME", "dataField": "sofficialproductname", "width": "300px", "mandatory": true  , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
                { "idsName": "IDS_PRODUCTDOMAIN", "dataField": "nproductdomaincode", "width": "200px", "mandatory": true  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                { "idsName": "IDS_PRODUCTDESC", "dataField": "nproductdesccode", "width": "200px", "mandatory": true , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" },
            ]
        };
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
        this.setState({ safetyMarkByID: [], productTypeByID: [] });
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, operation: this.props.Login.operation }
        }
        this.props.updateStore(updateInfo);

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

    getNestedFieldData = (nestedColumnArray, data) =>
        nestedColumnArray.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, data);

    render() {

        //let primaryKeyField = "";
        
        this.extractedColumnList = [
            { "idsName": "IDS_PRODUCTNAME", "dataField": "sofficialproductname", "width": "300px" },
            { "idsName": "IDS_PRODUCTDOMAIN", "dataField": "sproductdomain", "width": "200px" },
            { "idsName": "IDS_PRODUCTCLASS", "dataField": "sproductclass", "width": "200px" },
            // { "idsName": "IDS_PRODUCTTYPE", "dataField": "sproducttype", "width": "200px" },
            // { "idsName": "IDS_BULKTYPE", "dataField": "sbulktype", "width": "200px" },
            // { "idsName": "IDS_COMPONENTBULKGROUP", "dataField": "scomponentbulkgroup", "width": "200px" },
            // { "idsName": "IDS_MASTERFILETYPE", "dataField": "smasterfiletype", "width": "200px" },
            // { "idsName": "IDS_SAFETYMARKNAME", "dataField": "ssafetymarkername", "width": "200px" },


        ]
        //primaryKeyField = "nofficialproductcode";
        //let validationColumnList = [];
        this.fieldList = ["sofficialproductname", "nproductdomaincode", "nproductdesccode", "nproducttypecode", "nbulktypecode", "ncomponentbulkgroupcode", "nmasterfiletypecode", "nsafetymarkercode"];
        // validationColumnList = [
        //     { "idsName": "IDS_PRODUCTNAME", "dataField": "sofficialproductname", "width": "300px", "mandatory": true },
        //     { "idsName": "IDS_PRODUCTDOMAIN", "dataField": "nproductdomaincode", "width": "200px", "mandatory": true },
        //     { "idsName": "IDS_PRODUCTDESC", "dataField": "nproductdesccode", "width": "200px", "mandatory": true },
        // ]
        // if (this.state.productTypeByID.nproducttypemand === transactionStatus.YES && this.state.safetyMarkByID.nsafetymarkermand === 3) {
        //     this.validationColumnList.push(
        //         { "idsName": "IDS_PRODUCTTYPE", "dataField": "nproducttypecode", "width": "200px", "mandatory": true },
        //         { "idsName": "IDS_SAFETYMARKNAME", "dataField": "nsafetymarkercode", "width": "200px", "mandatory": true },
        //     );
        // }
        // else {
        // if (this.state.productTypeByID.nproducttypemand === transactionStatus.YES) {
        //     validationColumnList.push(
        //         { "idsName": "IDS_PRODUCTTYPE", "dataField": "nproducttypecode", "width": "200px", "mandatory": true },

        //     );
        // }
        // if (this.state.safetyMarkByID.nsafetymarkermand === transactionStatus.YES) {
        //     validationColumnList.push(
        //        { "idsName": "IDS_SAFETYMARKNAME", "dataField": "nsafetymarkercode", "width": "200px", "mandatory": true },
        //     );
        // }
        //}
        const mandatoryFields = [];
        this.state.validationColumnList.forEach(item => item.mandatory === true ?
            mandatoryFields.push(item) : ""
        );

        const addId = this.props.Login.inputParam && this.state.controlMap.has("Add".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Add".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;


        const editId = this.props.Login.inputParam && this.state.controlMap.has("Edit".concat(this.props.Login.inputParam.methodUrl))
            && this.state.controlMap.get("Edit".concat(this.props.Login.inputParam.methodUrl)).ncontrolcode;
        const edqmAddParam = {
            screenName: "EDQM Product", operation: "create", primaryKeyField: "nofficialproductcode",
            primaryKeyValue: null, masterData: null, userInfo: this.props.Login.userInfo,
            ncontrolCode: addId
        };

        const edqmEditParam = {
            screenName: "EDQM Product", operation: "update", primaryKeyField: "nofficialproductcode",
            masterData: null, userInfo: this.props.Login.userInfo,
            ncontrolCode: editId
        };
        const edqmDeleteParam = { screenName: "EDQMProduct", methodUrl: "EDQMProduct", operation: "delete" };

        return (

            <>
                <Row>
                    <Col>
                        <ListWrapper className="client-list-content">
                            {/* <PrimaryHeader className="d-flex justify-content-between mb-3"> */}
                            {/* <HeaderName className="header-primary-md">
                                    {this.props.Login.inputParam && this.props.Login.inputParam.displayName ?
                                        <FormattedMessage id={this.props.Login.inputParam.displayName} /> : ""}
                                </HeaderName> */}

                            {/* <Button className="btn btn-user btn-primary-blue"
                                    hidden={this.props.Login.inputParam && this.state.userRoleControlRights.indexOf(addId) === -1}
                                    onClick={() => this.props.edqmProductFetchRecord(edqmAddParam)} role="button">
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id={"IDS_ADD"} defaultMessage='Add' />
                                </Button>
                            </PrimaryHeader> */}


                            {this.state.data ?
                                <DataGrid
                                    primaryKeyField={"nofficialproductcode"}
                                    expandField="expanded"
                                    detailedFieldList={this.detailedFieldList}
                                    data={this.state.data}
                                    dataResult={this.state.dataResult}
                                    dataState={this.state.dataState}
                                    dataStateChange={this.dataStateChange}
                                    extractedColumnList={this.extractedColumnList}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    inputParam={this.props.Login.inputParam}
                                    userInfo={this.props.Login.userInfo}
                                    fetchRecord={this.props.edqmProductFetchRecord}
                                    editParam={edqmEditParam}
                                    deleteRecord={this.deleteRecord}
                                    deleteParam={edqmDeleteParam}
                                    reloadData={this.reloadData}
                                    addRecord={() => this.props.edqmProductFetchRecord(edqmAddParam)}
                                    pageable={{ buttonCount: 4, pageSizes: true }}
                                    scrollable={"scrollable"}
                                    gridHeight={"600px"}
                                    isActionRequired={true}
                                    isToolBarRequired={true}
                                    // isComponent={true}
                                    selectedId={this.props.Login.selectedId}
                                    hasDynamicColSize={true}
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
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : <AddEDQMProduct
                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                onComboChange={this.onComboChange}
                                formatMessage={this.props.intl.formatMessage}
                                productDomainData={this.state.productDomainData || []}//{this.props.Login.productDomainData}
                                productDescData={this.state.productDescData || []}//{this.props.Login.productDescData}
                                productTypeData={this.state.productTypeData || []}//{this.props.Login.productTypeData}
                                productTypeByID={this.state.productTypeByID}//{this.props.Login.productTypeByID}
                                bulkTypeData={this.state.bulkTypeData || []}//{this.props.Login.bulkTypeData}
                                componentBulkData={this.state.componentBulkData || []}//{this.props.Login.componentBulkData}
                                masterFileData={this.state.masterFileData || []}//{this.props.Login.masterFileData}
                                safetyFileData={this.state.safetyFileData}//{this.props.Login.safetyFileData}
                                safetyMarkByID={this.state.safetyMarkByID}//{this.props.Login.safetyMarkByID}
                                nproductdomaincode={this.props.Login.nproductdomaincode}
                                nproductdesccode={this.props.Login.nproductdesccode}
                                nproducttypecode={this.props.Login.nproducttypecode}
                                nbulktypecode={this.props.Login.nbulktypecode}
                                ncomponentbulkgroupcode={this.props.Login.ncomponentbulkgroupcode}
                                nmasterfiletypecode={this.props.Login.nmasterfiletypecode}
                                nsafetymarkercode={this.props.Login.nsafetymarkercode}

                            />}
                    />
                }
            </>
        );
    }

    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.props });
    }

    detailBand = (props) => {

        const Dataitem = props.dataItem
        const OptionalFieldList = [
            { datafield: "sproducttype", Column: "Product Type" },
            { datafield: "sbulktype", Column: "Bulk Type" },
            { datafield: "scomponentbulkgroup", Column: "Component Bulk Group" },
            { datafield: "smasterfiletype", Column: "Master File Type" },
            { datafield: "ssafetymarkername", Column: "Safety Marker Name" },
        ];
        return (<Row>
            {OptionalFieldList.map((fields) => {
                return (
                    <Col md='6'>
                        <FormGroup>
                            <FormLabel><FormattedMessage id={fields.Column} message={fields.Column} /></FormLabel>
                            <MediaLabel className="readonly-text font-weight-normal">{Dataitem[fields.datafield]}</MediaLabel>
                        </FormGroup>
                    </Col>
                )
            })
            }
        </Row>)
    }

    detailedFieldList = [
        { dataField: "sproducttype", idsName: "IDS_PRODUCTTYPE" , columnSize:"4"},
        { dataField: "sbulktype", idsName: "IDS_BULKTYPE" , columnSize:"4"},
        { dataField: "scomponentbulkgroup", idsName: "IDS_COMPONENTBULKGROUP" , columnSize:"4"},
        { dataField: "smasterfiletype", idsName: "IDS_MASTERFILETYPE" , columnSize:"4"},
        { dataField: "ssafetymarkername", idsName: "IDS_SAFETYMARKNAME" , columnSize:"4"},
        //{ "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "20%", "isIdsField": true, "controlName": "ndefaultstatus" }

    ];

    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData.value;

            if (fieldName === "nproductdesccode") {
                this.getProductTypeMandatory(comboData.value, selectedRecord)
            }
            if (fieldName === "nproducttypecode") {
                this.getSafetyMarkerMandatory(comboData.value, selectedRecord)
            }
            else {
                this.setState({ selectedRecord });
            }
        }
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

                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    dataResult: process(this.props.Login.masterData, dataState),
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.productDomainData !== previousProps.Login.productDomainData || this.props.Login.productDescData !== previousProps.Login.productDescData || this.props.Login.productTypeData !== previousProps.Login.productTypeData ||
            this.props.Login.bulkTypeData !== previousProps.Login.bulkTypeData || this.props.Login.componentBulkData !== previousProps.Login.componentBulkData || this.props.Login.masterFileData !== previousProps.Login.masterFileData ||
            this.props.Login.safetyFileData !== previousProps.Login.safetyFileData) {

            const productDomainData = constructOptionList(this.props.Login.productDomainData || [], "nproductdomaincode",
                "sproductdomain", undefined, undefined, undefined);
            const productDomainDataEDQM = productDomainData.get("OptionList");

            const productDescData = constructOptionList(this.props.Login.productDescData || [], "nproductdesccode",
                "sproductclass", undefined, undefined, undefined);
            const productDescDataEDQM = productDescData.get("OptionList");

            const productTypeData = constructOptionList(this.props.Login.productTypeData || [], "nproducttypecode",
                "sproducttype", undefined, undefined, undefined);
            const productTypeDataEDQM = productTypeData.get("OptionList");

            const bulkTypeData = constructOptionList(this.props.Login.bulkTypeData || [], "nbulktypecode",
                "sbulktype", undefined, undefined, undefined);
            const bulkTypeDataEDQM = bulkTypeData.get("OptionList");

            const componentBulkData = constructOptionList(this.props.Login.componentBulkData || [], "ncomponentbulkgroupcode",
                "scomponentbulkgroup", undefined, undefined, undefined);
            const componentBulkDataEDQM = componentBulkData.get("OptionList");

            const masterFileData = constructOptionList(this.props.Login.masterFileData || [], "nmasterfiletypecode",
                "smasterfiletype", undefined, undefined, undefined);
            const masterFileDataEDQM = masterFileData.get("OptionList");

            const safetyFileData = constructOptionList(this.props.Login.safetyFileData || [], "nsafetymarkercode",
                "ssafetymarkername", undefined, undefined, undefined);
            const safetyFileDataEDQM = safetyFileData.get("OptionList");

            this.setState({
                productDomainData: productDomainDataEDQM, productDescData: productDescDataEDQM, productTypeData: productTypeDataEDQM,
                bulkTypeData: bulkTypeDataEDQM, componentBulkData: componentBulkDataEDQM, masterFileData: masterFileDataEDQM, safetyFileData: safetyFileDataEDQM
            });
        }
    }

    fetchRecord = (primaryKeyName, primaryKeyValue, operation) => {

        const productDomainData = rsapi.post("edqmproductdomain/getEDQMProductDomain", { "userinfo": this.props.Login.userInfo });
        const productDescData = rsapi.post("edqmproductdescription/getEDQMProductDescription", { "userinfo": this.props.Login.userInfo });
        const productTypeData = rsapi.post("edqmproducttype/getAllEDQMProductType", { "userinfo": this.props.Login.userInfo });
        const bulkTypeData = rsapi.post("edqmbulktype/getAllEDQMBulkType", { "userinfo": this.props.Login.userInfo });
        const componentBulkData = rsapi.post("edqmcomponentbulkgroup/getAllEDQMComponentBulkGroup", { "userinfo": this.props.Login.userInfo });
        const masterFileData = rsapi.post("edqmmasterfiletype/getAllEDQMMasterFileType", { "userinfo": this.props.Login.userInfo });
        const safetyFileData = rsapi.post("edqmsafetymarker/getAllEDQMSafetyMarker", { "userinfo": this.props.Login.userInfo });

        let urlArray = [];

        if (operation === "update") {
            const productData = rsapi.post(this.props.Login.inputParam.classUrl + "/getActive" + this.props.Login.inputParam.methodUrl + "ById", { [primaryKeyName]: primaryKeyValue, "userinfo": this.props.Login.userInfo });

            urlArray = [productDomainData, productDescData, productTypeData, bulkTypeData, componentBulkData, masterFileData, safetyFileData, productData];
        }
        else {
            urlArray = [productDomainData, productDescData, productTypeData, bulkTypeData, componentBulkData, masterFileData, safetyFileData];

        }

        Axios.all(urlArray)
            .then(Axios.spread((...response) => {

                let nproductdomaincode = [];
                let nproductdesccode = [];
                let nproducttypecode = [];
                let nbulktypecode = [];
                let ncomponentbulkgroupcode = [];
                let nmasterfiletypecode = [];
                let nsafetymarkercode = [];

                if (operation === "update") {

                    nproductdomaincode.push({
                        label: response[7].data["sproductdomain"],
                        value: response[7].data["nproductdomaincode"]
                    });

                    nproductdesccode.push({
                        label: response[7].data["sproductclass"],
                        value: response[7].data["nproductdesccode"]
                    });

                    nproducttypecode.push({
                        label: response[7].data["sproducttype"],
                        value: response[7].data["nproducttypecode"]
                    });

                    nbulktypecode.push({
                        label: response[7].data["sbulktype"],
                        value: response[7].data["nbulktypecode"]
                    });

                    ncomponentbulkgroupcode.push({
                        label: response[7].data["scomponentbulkgroup"],
                        value: response[7].data["ncomponentbulkgroupcode"]
                    });

                    nmasterfiletypecode.push({
                        label: response[7].data["smasterfiletype"],
                        value: response[7].data["nmasterfiletypecode"]
                    });

                    nsafetymarkercode.push({
                        label: response[7].data["ssafetymarkername"],
                        value: response[7].data["nsafetymarkercode"]
                    });
                }
                this.setState({
                    productDomainData: response[0].data, productDescData: response[1].data,
                    productTypeData: response[2].data, bulkTypeData: response[3].data,
                    componentBulkData: response[4].data, masterFileData: response[5].data,
                    safetyFileData: response[6].data,
                    nproductdomaincode, nproductdesccode, nproducttypecode, nbulktypecode,
                    ncomponentbulkgroupcode, nmasterfiletypecode, nsafetymarkercode,
                    isOpen: true, selectedRecord: operation === "update" ? response[7].data : undefined, operation: operation
                });


            }))

            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "agree") {
                selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
            }
        }
        else if (event.target.type === 'select-one') {
            if (event.target.name === "nproductdesccode") {

                this.getProductTypeMandatory((event.target.value))
            }
            if (event.target.name === "nproducttypecode") {
                this.getSafetyMarkerMandatory((event.target.value))
            }

            selectedRecord[event.target.name] = event.target.value;

        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }

        this.setState({ selectedRecord });


    }

    deleteRecord = (deleteParam) => {
        if (deleteParam.selectedRecord.expanded !== undefined) {
            delete deleteParam.selectedRecord.expanded
        }
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: deleteParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: {

                [deleteParam.methodUrl.toLowerCase()]: deleteParam.selectedRecord,
                "userinfo": this.props.Login.userInfo
            },

            operation: deleteParam.operation, dataState: this.state.dataState
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true,

                    screenName: deleteParam.screenName, operation: deleteParam.operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    getProductTypeMandatory(ProductDescCode, selectedRecord) {
        const url = "edqmproductdescription/getActiveEDQMProductDescriptionById";
        rsapi.post(url, { "nproductdesccode": parseInt(ProductDescCode), "userinfo": this.props.Login.userInfo })
            .then(response => {
                const productTypeByID = response.data;
                const validationColumnList = this.state.validationColumnList;
                if (productTypeByID.nproducttypemand === transactionStatus.YES) {
                    validationColumnList.push(
                        { "idsName": "IDS_PRODUCTTYPE", "dataField": "nproducttypecode", "width": "200px", "mandatory": true },

                    );
                }

                this.setState({ productTypeByID, selectedRecord, validationColumnList });
            })
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }

    getSafetyMarkerMandatory(ProductTypeCode, selectedRecord) {

        const url = rsapi.post("edqmproducttype/getActiveEDQMProductTypeById", { "nproducttypecode": parseInt(ProductTypeCode), "userinfo": this.props.Login.userInfo });
        const safetyMarkert = rsapi.post("edqmsafetymarker/getSafetyMarkers", { "nproducttypecode": parseInt(ProductTypeCode), "userinfo": this.props.Login.userInfo });
        let urlArray = [url, safetyMarkert];
        Axios.all(urlArray)
            .then(Axios.spread((...response) => {
                const safetyFileData1 = constructOptionList(response[1].data || [], "nsafetymarkercode",
                    "ssafetymarkername", undefined, undefined, undefined);
                const safetyFileDataEDQM = safetyFileData1.get("OptionList");
                const safetyMarkByID = response[0].data;
                const validationColumnList = this.state.validationColumnList;

                if (safetyMarkByID.nsafetymarkermand === transactionStatus.YES) {
                    validationColumnList.push(
                        { "idsName": "IDS_SAFETYMARKNAME", "dataField": "nsafetymarkercode", "width": "200px", "mandatory": true },
                    );
                }
                else {
                    let index = validationColumnList.findIndex(data => data.idsName === "IDS_SAFETYMARKNAME");
                    if (index > -1) {
                        validationColumnList.splice(index, 1);
                    }
                }

                this.setState({
                    safetyFileData: safetyFileDataEDQM,
                    safetyMarkByID,
                    isOpen: true,
                    selectedRecord, validationColumnList
                });
            }))
            .catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                }
                else {
                    toast.warn(error.response.data);
                }
            })
    }


    reloadData = () => {
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }


    onSaveClick = (saveType, formRef) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let dataState = undefined;
        let selectedId = null;
        // let selectedRecord = {};


        if (this.props.Login.operation === "update") {
            selectedId = this.props.Login.selectedId;
            // edit
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = this.state.selectedRecord;

            this.fieldList.map(item => {
                return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            })
            dataState = this.state.dataState;
        }
        else {
            //add       this.fieldList = ["sofficialproductname", "nproductdomaincode", "nproductdesccode", "nproducttypecode", 
            //"nbulktypecode", "ncomponentbulkgroupcode", "nmasterfiletypecode", "nsafetymarkercode"];            
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["sofficialproductname"] = this.state.selectedRecord["sofficialproductname"];
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nproductdomaincode"] = this.state.selectedRecord["nproductdomaincode"];
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nproductdesccode"] = this.state.selectedRecord["nproductdesccode"];
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nproducttypecode"] = this.state.selectedRecord["nproducttypecode"] ?
                this.state.selectedRecord["nproducttypecode"] : -1;
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nbulktypecode"] = this.state.selectedRecord["nbulktypecode"] ?
                this.state.selectedRecord["nbulktypecode"] : -1;

            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["ncomponentbulkgroupcode"] = this.state.selectedRecord["ncomponentbulkgroupcode"] ?
                this.state.selectedRecord["ncomponentbulkgroupcode"] : -1
            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nmasterfiletypecode"] = this.state.selectedRecord["nmasterfiletypecode"] ?
                this.state.selectedRecord["nmasterfiletypecode"] : -1

            inputData[this.props.Login.inputParam.methodUrl.toLowerCase()]["nsafetymarkercode"] = this.state.selectedRecord["nsafetymarkercode"] ?
                this.state.selectedRecord["nsafetymarkercode"] : -1
            // this.fieldList.map(item => {
            //     return inputData[this.props.Login.inputParam.methodUrl.toLowerCase()][item] = this.state.selectedRecord[item]
            // })
        }

        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: this.props.Login.inputParam.methodUrl,
            displayName: this.props.Login.inputParam.displayName,
            inputData: inputData,
            operation: this.props.Login.operation, saveType, formRef, dataState, selectedId
        }

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: this.props.Login.operation, selectedId
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
     this.setState({ safetyMarkByID: [], productTypeByID: [] }); 
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

export default connect(mapStateToProps, {
    callService, crudMaster, updateStore, validateEsignCredential,
    edqmProductFetchRecord
})(injectIntl(EDQMProduct));