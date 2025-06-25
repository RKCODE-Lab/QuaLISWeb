import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { intl } from '../../components/App';
import { injectIntl } from 'react-intl';
import { MediaHeader } from '../../components/App.styles';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';
import {
    updateStore
} from '../../actions';
import { connect } from 'react-redux';
import { constructOptionList } from '../../components/CommonScript';
import { toast } from 'react-toastify';
import rsapi from '../../rsapi';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Preloader from '../../components/preloader/preloader.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';

class ResultEntryMaterialForm extends React.Component {
    //    const ResultEntryMaterialForm = (this.props) => {
    constructor(props) {
        super(props)
        this.state = {
            selectedRecordMaterialForm: this.props.Login.selectedRecordMaterialForm,
            materialType: this.props.Login.materialType,
            materialCategory: this.props.Login.materialCategory,
            material: this.props.Login.material,
            materialInventory: this.props.Login.materialInventory,
            loading:false
        }

    }
    componentWillUnmount() { 
        const updateInfo = {
            typeName: DEFAULT_RETURN, 
            data: { isMaterialInitialRender: false  } 
        }
        this.props.updateStore(updateInfo);
    }
    componentDidUpdate(previousProps) {
        if (this.props.selectedRecordMaterialForm !== previousProps.selectedRecordMaterialForm) {
            this.setState({ selectedRecordMaterialForm: this.props.selectedRecordMaterialForm });
        }
        if (this.props.materialCategory !== previousProps.materialCategory) {
            this.setState({ materialCategory: this.props.materialCategory });
        }
        if (this.props.material !== previousProps.material) {
            this.setState({ material: this.props.material });
        }
        if (this.props.materialInventory !== previousProps.materialInventory) {
            this.setState({ materialInventory: this.props.materialInventory });
        }
    }

        //ALPD-5623--Added by Vignesh R-->Used Quantity change Forminput to FormNumeric
    onNumericInputChange = (value, name) => {
      
        let selectedRecordMaterialForm = this.state.selectedRecordMaterialForm || {};
      
           // selectedRecordMaterialForm={...selectedRecordMaterialForm,[name]:value};
            selectedRecordMaterialForm[name]=value;
            //Sync Child Component data with Parent Component     
            this.props.onChildDataChange(selectedRecordMaterialForm);
            this.setState({ selectedRecordMaterialForm });
        }

    onInputOnChange = (event, name) => {

        const selectedRecordMaterialForm = this.state.selectedRecordMaterialForm || {};
        if (event.target.type === 'checkbox') {
            selectedRecordMaterialForm[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
                selectedRecordMaterialForm[event.target.name] = event.target.value;

        }
        switch (name) {
            case 'ntestgroupmaterial':
                // ALPD-5584   Modified code by Vishakh for add material issue
                const indexValue = this.props.Login.masterData.RESelectedTest
                    .findIndex( i => i.ntransactiontestcode === selectedRecordMaterialForm.ntransactiontestcode);
                const ntestgrouptestcode = selectedRecordMaterialForm.ntestgroupmaterial == transactionStatus.YES ? 
                this.props.Login.masterData.RESelectedTest[indexValue]
                    .ntestgrouptestcode : -1
                
                //this.props.
                this.getREMaterialComboGet({ ntestgroupmaterial: selectedRecordMaterialForm.ntestgroupmaterial, ntestgrouptestcode, 
                    RESelectedTest: this.props.Login.masterData.RESelectedTest, 
                    // ALPD-5584   Modified code by Vishakh for add material issue
                    test: this.props.Login.masterData.RESelectedTest[indexValue], 
                    userInfo: this.props.Login.userInfo })
                break;
            default:
                //Sync Child Component data with Parent Component     
                this.props.onChildDataChange(selectedRecordMaterialForm);
                this.setState({ selectedRecordMaterialForm });
        }
    }

    getREMaterialComboGet(inputData) {
        // return function (dispatch) {
        // dispatch(initRequest(true));
        this.setState({loading:true})
        rsapi.post("resultentrybysample/getResultUsedMaterialCombo", { userinfo: inputData.userInfo, nsectioncode: inputData.test.nsectioncode, ntestgrouptestcode: inputData.ntestgrouptestcode })
            .then(response => {
                const materialTypeMap = constructOptionList(response.data.MaterialType || [], "nmaterialtypecode", "smaterialtypename", undefined, undefined, undefined);
                const materialType = materialTypeMap.get("OptionList");
                const materialCatMap = constructOptionList(response.data.MaterialCategory || [], "nmaterialcatcode", "smaterialcatname", undefined, undefined, undefined);
                const materialCategory = materialCatMap.get("OptionList");
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                //  dispatch({
                //     type: DEFAULT_RETURN,
                //      payload:

                //Sync Child Component data with Parent Component     
                this.props.onChildDataChange({
                    ntestgroupmaterial: inputData.ntestgroupmaterial,
                    sarno: inputData.test.sarno,
                    ssamplearno: inputData.test.ssamplearno,
                    stestsynonym: inputData.test.stestsynonym,
                    nsectioncode: inputData.test.nsectioncode,
                    ssectionname: inputData.test.ssectionname,
                    transactiontestcode: inputData.RESelectedTest ? inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                    ntransactiontestcode: inputData.test.ntransactiontestcode,
                    npreregno: inputData.test.npreregno,
                    nmaterialtypecode: materialTypeMap.get("DefaultValue") ? materialTypeMap.get("DefaultValue") : "",
                    nmaterialcatcode: materialCatMap.get("DefaultValue") ? materialCatMap.get("DefaultValue") : "",
                    nmaterialcode: materialMap.get("OptionList").length > 0 ? materialMap.get("OptionList")[0] : "",
                    nmaterialinventorycode: materialInventoryMap.get("OptionList").length > 0 ? materialInventoryMap.get("OptionList")[0] : "",
                    sunitname: response.data.MaterialInventory !== undefined && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].sunitname : "",
                    savailablequantity: response.data.MaterialInventory !== undefined && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].savailablequatity : ""
                });
                this.setState({
                    selectedId: null,
                    selectedRecordMaterialForm: {
                        ntestgroupmaterial: inputData.ntestgroupmaterial,
                        sarno: inputData.test.sarno,
                        ssamplearno: inputData.test.ssamplearno,
                        stestsynonym: inputData.test.stestsynonym,
                        nsectioncode: inputData.test.nsectioncode,
                        ssectionname: inputData.test.ssectionname,
                        transactiontestcode: inputData.RESelectedTest ? inputData.RESelectedTest.map(test => test.ntransactiontestcode).join(",").toString() : "",
                        ntransactiontestcode: inputData.test.ntransactiontestcode,
                        npreregno: inputData.test.npreregno,
                        nmaterialtypecode: materialTypeMap.get("DefaultValue") ? materialTypeMap.get("DefaultValue") : "",
                        nmaterialcatcode: materialCatMap.get("DefaultValue") ? materialCatMap.get("DefaultValue") : "",
                        nmaterialcode: materialMap.get("OptionList").length > 0 ? materialMap.get("OptionList")[0] : "",
                        nmaterialinventorycode: materialInventoryMap.get("OptionList").length > 0 ? materialInventoryMap.get("OptionList")[0] : "",
                        sunitname: response.data.MaterialInventory !== undefined && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].sunitname : "",
                        savailablequantity: response.data.MaterialInventory !== undefined && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].savailablequatity : ""
                    },
                    materialType,
                    materialCategory,
                    material,
                    materialInventory,
                    loading: false,
                    screenName: "IDS_MATERIAL",
                    openModal: true,
                    operation: "create",
                    loading:false
                })
                // })
            })
        // .catch(error => {
        //     dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //             loading: false
        //         }
        //     })
        //     if (error.response.status === 500) {
        //         toast.error(error.message);
        //     } else {
        //         toast.warn(error.response.data);
        //     }
        // })
        // }
    }
    onMaterialComboChange = (comboData, comboName) => {
        const selectedRecordMaterialForm = this.state.selectedRecordMaterialForm || [];
        const ntestgrouptestcode = selectedRecordMaterialForm.ntestgroupmaterial == transactionStatus.YES ? this.props.Login.masterData.RESelectedTest[0].ntestgrouptestcode : -1;
        if (comboData) {
            selectedRecordMaterialForm[comboName] = comboData;
        } else {
            selectedRecordMaterialForm[comboName] = []
        }
        switch (comboName) {
            case 'nmaterialtypecode':
                this.getREMaterialCategoryByType({ ntestgrouptestcode, selectedRecordMaterialForm, userInfo: this.props.Login.userInfo })
                break;
            case 'nmaterialcatcode':
                selectedRecordMaterialForm['nsectioncode'] = selectedRecordMaterialForm.nmaterialcatcode.item.needSectionwise == transactionStatus.YES ?
                    this.props.Login.masterData.RESelectedTest[0].nsectioncode : -1;
                this.getREMaterialByCategory({ ntestgrouptestcode, selectedRecordMaterialForm, userInfo: this.props.Login.userInfo })
                break;
            case 'nmaterialcode':
                this.getREMaterialInvertoryByMaterial({ ntestgrouptestcode, selectedRecordMaterialForm, userInfo: this.props.Login.userInfo })
                break;
            default:
                this.getAvailableMaterialQuantity({ ntestgrouptestcode, selectedRecordMaterialForm, userInfo: this.props.Login.userInfo })
                break;
        }
    }

    getREMaterialByCategory(inputData) {
        // return function (dispatch) {
        //     dispatch(initRequest(true));
        this.setState({loading:true})
        rsapi.post("resultentrybysample/getREMaterialByCategory", {
            ntestgrouptestcode: inputData.ntestgrouptestcode,
            nmaterialtypecode: inputData.selectedRecordMaterialForm.nmaterialtypecode.value,
            nmaterialcatcode: inputData.selectedRecordMaterialForm.nmaterialcatcode.value,
            nsectioncode: inputData.selectedRecordMaterialForm.nsectioncode,
            userinfo: inputData.userInfo
        })
            .then(response => {
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload:

                //Sync Child Component data with Parent Component     
                this.props.onChildDataChange({
                    ...inputData.selectedRecordMaterialForm,
                    nmaterialcode: materialMap.get("OptionList")[0],
                    nmaterialinventorycode: materialInventoryMap.get("OptionList")[0],
                    savailablequantity: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].savailablequatity : "",
                    sunitname: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].sunitname : ""
                });
                this.setState({
                    selectedId: null,
                    selectedRecordMaterialForm: {
                        ...inputData.selectedRecordMaterialForm,
                        nmaterialcode: materialMap.get("OptionList")[0],
                        nmaterialinventorycode: materialInventoryMap.get("OptionList")[0],
                        savailablequantity: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].savailablequatity : "",
                        sunitname: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].sunitname : ""
                    },
                    material,
                    materialInventory,
                    loading: false
                })
                //  })
            })
        // .catch(error => {
        //     dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //             loading: false
        //         }
        //     })
        //     if (error.response.status === 500) {
        //         toast.error(error.message);
        //     } else {
        //         toast.warn(error.response.data);
        //     }
        // })
        // }
    }

    getREMaterialInvertoryByMaterial(inputData) {
        // return function (dispatch) {
        //     dispatch(initRequest(true));
        this.setState({loading:true})
        rsapi.post("resultentrybysample/getREMaterialInvertoryByMaterial", {
            ntestgrouptestcode: inputData.ntestgrouptestcode,
            nmaterialcode: inputData.selectedRecordMaterialForm.nmaterialcode.value,
            nsectioncode: inputData.selectedRecordMaterialForm.nsectioncode,
            userinfo: inputData.userInfo
        })
            .then(response => {
                inputData.selectedRecordMaterialForm.nmaterialinventorycode && delete
                    inputData.selectedRecordMaterialForm.nmaterialinventorycode;

                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                // dispatch({
                //    type: DEFAULT_RETURN,
                //    payload:

                //Sync Child Component data with Parent Component   
                this.props.onChildDataChange({
                    ...inputData.selectedRecordMaterialForm,
                    nmaterialinventorycode: response.data.MaterialInventory ? materialInventoryMap.get("OptionList")[0] : undefined,
                    sunitname: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].sunitname : "",
                    savailablequantity: response.data.MaterialInventory && response.data.MaterialInventory.length > 0  ? response.data.MaterialInventory[0].savailablequatity : ""
                });



                this.setState({
                    selectedId: null,
                    selectedRecordMaterialForm: {
                        ...inputData.selectedRecordMaterialForm,
                        nmaterialinventorycode: response.data.MaterialInventory ? materialInventoryMap.get("OptionList")[0] : undefined,
                        sunitname: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].sunitname : "",
                        savailablequantity: response.data.MaterialInventory && response.data.MaterialInventory.length > 0 ? response.data.MaterialInventory[0].savailablequatity : ""
                    },
                    materialInventory,
                    loading: false,
                    screenName: "IDS_MATERIAL",
                    openModal: true,
                    //operation: "create",
                    //activeTestKey: "IDS_INSTRUMENT",
                    ncontrolcode: inputData.addResultUsedInstrumentId
                })
                //  })
            })
        // .catch(error => {
        //     dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //             loading: false
        //         }
        //     })
        //     if (error.response.status === 500) {
        //         toast.error(error.message);
        //     } else {
        //         toast.warn(error.response.data);
        //     }
        // })
        // }
    }

    getREMaterialCategoryByType(inputData) {
        //   return function (dispatch) {
        //    dispatch(initRequest(true));
        this.setState({loading:true})
        rsapi.post("resultentrybysample/getREMaterialCategoryByType", {
            ntestgrouptestcode: inputData.ntestgrouptestcode,
            nmaterialtypecode: inputData.selectedRecordMaterialForm.nmaterialtypecode.value,
            userinfo: inputData.userInfo
        })
            .then(response => {
                const materialCatMap = constructOptionList(response.data.MaterialCategory || [], "nmaterialcatcode", "smaterialcatname", undefined, undefined, undefined);
                const materialCategory = materialCatMap.get("OptionList");
                const materialMap = constructOptionList(response.data.Material || [], "nmaterialcode", "smaterialname", undefined, undefined, undefined);
                const material = materialMap.get("OptionList");
                const materialInventoryMap = constructOptionList(response.data.MaterialInventory || [], "nmaterialinventorycode", "sinventoryid", undefined, undefined, undefined);
                const materialInventory = materialInventoryMap.get("OptionList");
                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: 

                //Sync Child Component data with Parent Component 
                this.props.onChildDataChange({
                    ...inputData.selectedRecordMaterialForm,
                    nmaterialcode:  materialMap.get("DefaultValue") || "",
                    nmaterialinventorycode: materialInventoryMap.get("DefaultValue") || "",
                    nmaterialcatcode: materialCatMap.get("DefaultValue") || "",
                });

                this.setState({
                    selectedId: null,
                    selectedRecordMaterialForm: {
                        ...inputData.selectedRecordMaterialForm,
                        nmaterialcode: materialMap.get("DefaultValue") || {},
                        nmaterialinventorycode: materialInventoryMap.get("DefaultValue") || {},
                        nmaterialcatcode: materialCatMap.get("DefaultValue") || {},
                    },
                    materialCategory,
                    material,
                    materialInventory,
                    loading: false,
                });
                // })
            })
        // .catch(error => {
        //     dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //             loading: false
        //         }
        //     })
        //     if (error.response.status === 500) {
        //         toast.error(error.message);
        //     } else {
        //         toast.warn(error.response.data);
        //     }
        // })
        //   }
    }


    getAvailableMaterialQuantity(inputData) {
        // return function (dispatch) {
        //     dispatch(initRequest(true));
        this.setState({loading:true})
        rsapi.post("resultentrybysample/getAvailableMaterialQuantity", {
            ntestgrouptestcode: inputData.ntestgrouptestcode,
            nmaterialinventorycode: inputData.selectedRecordMaterialForm.nmaterialinventorycode.value,
            nsectioncode: inputData.selectedRecordMaterialForm.nsectioncode,
            userinfo: inputData.userInfo
        })
            .then(response => {
                // dispatch({
                //     type: DEFAULT_RETURN,
                //     payload: 

                //Sync Child Component data with Parent Component   
                this.props.onChildDataChange({
                    ...inputData.selectedRecordMaterialForm,
                    savailablequantity: response.data.inventory ? response.data.inventory.savailablequatity : "",
                    sunitname: response.data.inventory ? response.data.inventory.sunitname : ""
                });

                this.setState({
                    selectedId: null,
                    selectedRecordMaterialForm: {
                        ...inputData.selectedRecordMaterialForm,
                        savailablequantity: response.data.inventory ? response.data.inventory.savailablequatity : "",
                        sunitname: response.data.inventory ? response.data.inventory.sunitname : ""
                    },
                    loading: false,
                    screenName: "IDS_MATERIAL",
                    openModal: true,
                    //operation: "create",
                    //activeTestKey: "IDS_INSTRUMENT",
                    ncontrolcode: inputData.addResultUsedInstrumentId
                })
                //  })
            })
        // .catch(error => {
        //     dispatch({
        //         type: DEFAULT_RETURN,
        //         payload: {
        //             loading: false
        //         }
        //     })
        //     if (error.response.status === 500) {
        //         toast.error(error.message);
        //     } else {
        //         toast.warn(error.response.data);
        //     }
        // })
        //}
    }

    render() {
        return (
            <>
               <Preloader loading={this.state.loading} /> 
{/* ALPD-5584   Changed props to state for selectedRecordMaterialForm by Vishakh for add material issue*/}
                {Object.values(this.state.selectedRecordMaterialForm).length > 0 ?
                    <Row className="mb-4">
                        {this.props.needSubSample ?

                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>{intl.formatMessage({ id: "IDS_SAMPLEARNO" })}: {" " + this.state.selectedRecordMaterialForm.ssamplearno}</MediaHeader>
                            </Col>
                            :
                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>{intl.formatMessage({ id: "IDS_ARNO" })}: {" " + this.state.selectedRecordMaterialForm.sarno}</MediaHeader>
                            </Col>
                        }
                        <Col md={12}>
                            <MediaHeader className={`labelfont`}>{intl.formatMessage({ id: "IDS_TEST" })}: {" " + this.state.selectedRecordMaterialForm.stestsynonym}</MediaHeader>
                        </Col>
                    </Row>
                    : ""}

                <Row>
                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                <CustomSwitch
                                    label={this.props.intl.formatMessage({ id: "IDS_TESTGROUPMATERIAL" })}
                                    type="switch"
                                    name={"ntestgroupmaterial"}
                                    onChange={(event) => this.onInputOnChange(event, "ntestgroupmaterial")}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_DISPLAYSTATUS" })}
                                    //defaultValue={this.props.selectedRecordMaterialForm ? this.props.selectedRecordMaterialForm[nattachmenttypecode === attachmentType.LINK?"nlinkdefaultstatus":"ndefaultstatus"] === 3 ? true : false : ""}
                                    isMandatory={false}
                                    required={false}
                                    checked={this.state.selectedRecordMaterialForm ? this.state.selectedRecordMaterialForm["ntestgroupmaterial"] === transactionStatus.YES ? true : false : false}
                                // disabled={this.state.selectedRecordMaterialForm ? this.state.selectedRecordMaterialForm["ntestgroupmaterial"] === 3 ? true : false : false}
                                >
                                </CustomSwitch>
                                <FormSelectSearch
                                    formLabel={intl.formatMessage({ id: "IDS_MATERIALTYPE" })}
                                    placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={false}
                                    name={"nmaterialtypecode"}
                                    isDisabled={false}
                                    isMandatory={true}
                                    options={this.state.materialType || []}
                                    value={this.state.selectedRecordMaterialForm&&this.state.selectedRecordMaterialForm.nmaterialtypecode&&
                                        Object.values(this.state.selectedRecordMaterialForm.nmaterialtypecode).length>0      &&
                                        this.state.selectedRecordMaterialForm.nmaterialtypecode!==undefined&&
                                        this.state.selectedRecordMaterialForm.nmaterialtypecode!==""  ? this.state.selectedRecordMaterialForm.nmaterialtypecode : ""}
                                    showOption={true}
                                    required={true}
                                    onChange={(event) => this.onMaterialComboChange(event, 'nmaterialtypecode')}
                                    isMulti={false}
                                    closeMenuOnSelect={true}
                                />
                                <FormSelectSearch
                                    formLabel={intl.formatMessage({ id: "IDS_MATERIALCATEGORY" })}
                                    placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={false}
                                    name={"nmaterialcatcode"}
                                    isDisabled={false}
                                    isMandatory={true}
                                    options={this.state.materialCategory || []}
                                    value={this.state.selectedRecordMaterialForm&&
                                        this.state.selectedRecordMaterialForm.nmaterialcatcode&&
                                        Object.values(this.state.selectedRecordMaterialForm.nmaterialcatcode).length>0      &&
                                        this.state.selectedRecordMaterialForm.nmaterialcatcode!==undefined&&
                                        this.state.selectedRecordMaterialForm.nmaterialcatcode!==""  ? this.state.selectedRecordMaterialForm.nmaterialcatcode : ""}
                                    showOption={true}
                                    required={true}
                                    onChange={(event) => this.onMaterialComboChange(event, 'nmaterialcatcode')}
                                    isMulti={false}
                                    closeMenuOnSelect={true}
                                />
                                <FormSelectSearch
                                    formLabel={intl.formatMessage({ id: "IDS_MATERIAL" })}
                                    placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={false}
                                    name={"nmaterialcode"}
                                    isDisabled={false}
                                    isMandatory={true}
                                    options={this.state.material || []}
                                    value={this.state.selectedRecordMaterialForm&&
                                        this.state.selectedRecordMaterialForm.nmaterialcode&&
                                        Object.values(this.state.selectedRecordMaterialForm.nmaterialcode).length>0      &&
                                        this.state.selectedRecordMaterialForm.nmaterialcode!==undefined&&
                                        this.state.selectedRecordMaterialForm.nmaterialcode!=="" ? this.state.selectedRecordMaterialForm.nmaterialcode : ""}
                                    showOption={true}
                                    required={true}
                                    onChange={(event) => this.onMaterialComboChange(event, 'nmaterialcode')}
                                    isMulti={false}
                                    closeMenuOnSelect={true}
                                />
                                <FormSelectSearch
                                    formLabel={intl.formatMessage({ id: "IDS_MATERIALINVENTORY" })}
                                    placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={false}
                                    name={"nmaterialinventorycode"}
                                    isDisabled={false}
                                    isMandatory={true}
                                    options={this.state.materialInventory || []}
                                    value={this.state.selectedRecordMaterialForm &&
                                        this.state.selectedRecordMaterialForm.nmaterialinventorycode&&
                                        Object.values(this.state.selectedRecordMaterialForm.nmaterialinventorycode).length>0      &&
                                        this.state.selectedRecordMaterialForm.nmaterialinventorycode!==undefined&&
                                        this.state.selectedRecordMaterialForm.nmaterialinventorycode!=="" ? this.state.selectedRecordMaterialForm.nmaterialinventorycode : ""}
                                    showOption={true}
                                    required={true}
                                    onChange={(event) => this.onMaterialComboChange(event, 'nmaterialinventorycode')}
                                    isMulti={false}
                                    closeMenuOnSelect={true}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>

                    

                           <Col md={12}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_AVAILABLEQUANTITY" })}
                                    name="savailablequantity"
                                    type="text"
                                    maxLength="100"
                                    isMandatory={true}
                                    value={this.state.selectedRecordMaterialForm["savailablequantity"] || []}
                                    onChange={(event) => this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_AVAILABLEQUANTITY" })}
                                    isDisabled={true}
                                />
                            </Col>
                            {/* <Col md={6}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_USEDQTY" })}
                                    name="susedquantity"
                                    type="text"
                                    maxLength="100"
                                    isMandatory={true}
                                    value={this.state.selectedRecordMaterialForm["susedquantity"] || []}
                                    onChange={(event) => this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_USEDQTY" })}
                                />
                            </Col>*/}
                            {/*ALPD-5623--Added by Vignesh R-->Used Quantity change Forminput to FormNumeric*/ }
                            <Col md={6}>
                            <FormNumericInput
                                    name={"susedquantity"}
                                    label={this.props.intl.formatMessage({ id: "IDS_USEDQTY" })}
                                    type="number"
                                    value={this.state.selectedRecordMaterialForm["susedquantity"] || []}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_USEDQTY" })}
                                    strict={true}
                                    min={0}
                                    maxLength={8}

                                    onChange={(value) =>  this.onNumericInputChange(value,"susedquantity")}
                                    noStyle={true}
                                    precision={3}
                                    className="form-control"
                                    errors="Please provide a valid number."
                                />
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_UNIT" })}
                                    name="sunitname"
                                    type="text"
                                    maxLength="100"
                                    isMandatory={true}
                                    value={this.state.selectedRecordMaterialForm["sunitname"] || []}
                                    onChange={(event) => this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_UNIT" })}
                                    isDisabled={true}
                                />
                            </Col>
                            <Col md={12}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_MOBILEPHASE" })}
                                    name="smobilephase"
                                    type="text"
                                    maxLength="20"
                                    value={this.state.selectedRecordMaterialForm["smobilephase"] || []}
                                    onChange={(event) => this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_MOBILEPHASE" })}
                                />
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_CARRIERGAS" })}
                                    name="scarriergas"
                                    type="text"
                                    maxLength="20"
                                    value={this.state.selectedRecordMaterialForm["scarriergas"] || []}
                                    onChange={(event) => this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_CARRIERGAS" })}
                                />
                                <FormTextarea
                                    label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                    name="sremarks"
                                    type="text"
                                    onChange={(event) => this.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                    value={this.state.selectedRecordMaterialForm&&this.state.selectedRecordMaterialForm["sremarks"]&&
                                        this.state.selectedRecordMaterialForm["sremarks"]!==undefined&&
                                        this.state.selectedRecordMaterialForm["sremarks"]!=="" ? this.state.selectedRecordMaterialForm["sremarks"] : ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={255}
                                    row={2}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        )
    }

}
//export default injectIntl(ResultEntryMaterialForm);

export default connect(null, {
    updateStore

})(injectIntl(ResultEntryMaterialForm));
