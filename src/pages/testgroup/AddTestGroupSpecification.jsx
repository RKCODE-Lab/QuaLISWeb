import React from 'react';
import { Row, Col, Form, Card, FormGroup, FormLabel } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { SampleType, transactionStatus, MaterialType, formCode } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { CONTAINERTYPE } from '../../components/Enumeration';
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';
import FormTreeMenu from '../../components/form-tree-menu/form-tree-menu.component';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { TreeDesign } from '../registration/registration.styled';

const AddTestGroupSpecification = props => {

    const [copyProfileName, setCopyProfileName] = useState(props.copyProfileName);
    const [copyFocusKey, setCopyFocusKey] = useState(props.focusKey)
    const [copyActiveKey, setCopyActiveKey] = useState(props.activeKey)
    useEffect(() => {
        setCopyProfileName(props.copyProfileName);
        setCopyFocusKey(props.focusKey);
        setCopyActiveKey(props.activeKey);
    }, [props.copyProfileName, props.focusKey, props.activeKey]);
    function onCopyTreeClick(event) {
        setCopyFocusKey(event.key);
        setCopyActiveKey(event.key);
        let manipulationCode = -1;
        let profileName = props.intl.formatMessage({ id: "IDS_SELECTVALIDPROFILE" });
        if (!event.hasNodes) {
            manipulationCode = event.item.ntemplatemanipulationcode;
            profileName = event.label;
        }
        setCopyProfileName(profileName);
        props.onCopyTreeClick(manipulationCode, profileName, event.key, event.key);
    }
    //Display selected spec details for copy action --ALPD-4099 ,work done by Dhanushya R I
    if (props.operation === 'copy')
        return (
            <>
                <Row>

                    <Col md={12}><FormGroup>
                        <Card>
                            <Card.Header><FormattedMessage id="IDS_COPYSPECIFICATION" message="Copy Specification" /></Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        {(props.tempFilterData.nsampletypecode && props.tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO) &&
                                            (props.selectedRecord.ncategorybasedflow === transactionStatus.NO) ?
                                            <FormGroup>
                                                <FormLabel>{props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}</FormLabel>
                                                <span className="readonly-text font-weight-normal"> {props.tempFilterData.nproductcode.label} </span>
                                            </FormGroup> :
                                            <FormGroup>
                                                <FormLabel>{props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}</FormLabel>
                                                <span className="readonly-text font-weight-normal"> {props.tempFilterData.nproductcatcode.label} </span>
                                            </FormGroup>
                                        }
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_SELECTEDPROFILE" message="Selected Profile" /></FormLabel>
                                            <span className="readonly-text font-weight-normal"> {props.initialProfile}</span>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_SELECTEDSPECNAME" message="Selected Spec Name" /></FormLabel>
                                            <span className="readonly-text font-weight-normal"> {props.masterData && props.masterData["SelectedSpecification"] ? props.masterData["SelectedSpecification"].sspecname : ""}</span>
                                        </FormGroup>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card> </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {(props.tempFilterData.nsampletypecode && props.tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO) &&
                            (props.selectedRecord.ncategorybasedflow === transactionStatus.NO) ?
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({
                                    id: props.tempFilterData["nsampletypecode"] ? props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode === formCode.PRODUCTCATEGORY ? props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] :
                                        props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode === formCode.INSTRUMENTCATEGORY ? "IDS_INSTRUMENT" :
                                            props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode === formCode.MATERIALCATEGORY ? "IDS_MATERIAL" : props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]
                                })}
                                name={"nproductcode"}
                                placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                                optionId={"nproductcode"}
                                optionValue={"sproductname"}
                                options={props.product || []}
                                showOption={true}
                                value={props.masterData.selectedRecordCopy && props.masterData.selectedRecordCopy.isCopy === true && props.masterData.selectedRecordCopy["nproductcode"]
                                    ? props.masterData.selectedRecordCopy["nproductcode"] : props.tempFilterData["nproductcode"]}
                                isSearchable={true}
                                onChange={(event) => props.changeProductOrProductCategory(event, "nproductcode", 1, props.masterData, props.selectedRecord)}//, "getTreeVersionTemplate", "product"
                                sortOrder="ascending"
                            >
                            </FormSelectSearch> :
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({
                                    id: props.tempFilterData["nsampletypecode"] ? props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode === formCode.PRODUCTCATEGORY ? props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] :
                                        props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode === formCode.INSTRUMENTCATEGORY ? "IDS_INSTRUMENTCATEGORY" :
                                            props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode === formCode.MATERIALCATEGORY ? "IDS_MATERIALCATEGORY" : props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] : props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]
                                })}
                                name={"nproductcatcode"}
                                placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                                optionId={"nproductcatcode"}
                                optionValue={"sproductcatname"}
                                 //ALPD-4758 done by Dhanushya RI,to load sample category only for categorybasedflow yes
                                 options={props.productCategory && props.productCategory.filter(Data =>
                                    Data.item.ncategorybasedflow===transactionStatus.YES) || []}
                                showOption={true}
                                value={props.masterData.selectedRecordCopy && props.masterData.selectedRecordCopy.isCopy === true && props.masterData.selectedRecordCopy && props.masterData.selectedRecordCopy["nproductcatcode"] ? props.masterData.selectedRecordCopy["nproductcatcode"] : props.tempFilterData["nproductcatcode"]}
                                isSearchable={true}
                                onChange={(event) => props.changeProductOrProductCategory(event, "nproductcatcode", 2, props.masterData, props.selectedRecord)}//, "getProduct", "productcategory"
                                sortOrder="ascending"
                            >
                            </FormSelectSearch>}
                        <FormInput
                            name={"sselectedprofilename"}
                            label={props.intl.formatMessage({ id: "IDS_SELECTEDPROFILE" })}
                            type="text"
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTEDPROFILE" })}
                            value={copyProfileName || ""}
                            readOnly={true}
                        />
                        <FormInput
                            name={"scopyspecname"}
                            label={props.intl.formatMessage({ id: "IDS_SPECNAME" })}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_SPECNAME" })}
                            value={props.selectedRecord ? props.selectedRecord["scopyspecname"] : ""}
                            isMandatory="*"
                            required={true}
                            maxLength={100}
                        />

                        <TreeDesign>
                            <PerfectScrollbar>

                                <FormTreeMenu
                                    data={props.Copydata === undefined ? props.data : props.Copydata}
                                    hasSearch={false}
                                    handleTreeClick={(event) => onCopyTreeClick(event)}
                                    initialOpenNodes={props.initialOpenNodes}
                                    focusKey={copyFocusKey}
                                    activeKey={copyActiveKey}
                                />

                            </PerfectScrollbar>
                        </TreeDesign>

                    </Col>
                </Row>
            </>)

    else {
        return (
            <> <Row>
                <Col md={12}>
                    {(props.tempFilterData.nsampletypecode && props.tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.NO) &&
                        (props.selectedRecord.ncategorybasedflow === transactionStatus.NO) ?
                        <FormInput
                            name={"sproductname"}
                            label={props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            value={props.selectedRecord ? props.selectedRecord["sproductname"] : ""}
                            readOnly={true}
                        />

                        : <FormInput
                            name={"sproductcatname"}
                            label={props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            value={props.selectedRecord ? props.selectedRecord["sproductcatname"] : ""}
                            readOnly={true}
                        />
                    }
                    <FormInput
                        name={"sspecname"}
                        label={props.intl.formatMessage({ id: "IDS_SPECNAME" })}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event, 1)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SPECNAME" })}
                        value={props.selectedRecord ? props.selectedRecord["sspecname"] : ""}
                        isMandatory="*"
                        required={true}
                        maxLength={100}
                    />
                </Col>
            </Row>
                <Row>
                    {/* <Col md={props.userInfo.istimezoneshow ? 6 : 12}> */}
                    {/* <Row>
                        <Col md={6}> */}


                    {/* <DateTimePicker
                        name={"dexpirydate"}
                        label={props.intl.formatMessage({ id: "IDS_EXPIRYDATEWOTIME" })}
                        className='form-control'
                        placeholderText="Select date.."
                        selected={props.selectedRecord["dexpirydate"]}
                        //dateFormat={"dd/MM/yyyy"}
                        dateFormat={props.userInfo.ssitedate}
                        timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                        showTimeInput={false}
                        isClearable={false}
                        onChange={date => props.handleDateChange("dexpirydate", date)}
                        value={props.selectedRecord["dexpirydate"]}
                        isMandatory={true}
                        required={true}
                    />
                </Col> */}
                    {props.userInfo.istimezoneshow === transactionStatus.YES &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzexpirydate"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.timeZoneList}
                                optionId="ntimezonecode"
                                optionValue="stimezoneid"
                                value={props.selectedRecord["ntzexpirydate"]}
                                defaultValue={props.selectedRecord["ntzexpirydate"]}
                                isMandatory={true}
                                isSearchable={true}
                                isClearable={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(value) => props.onComboChange(value, 'ntzexpirydate', 1)}
                            />
                            {/* </Col>
                    </Row> */}
                        </Col>
                    }
                    {/* <Col md={6}>
                    <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                            isSearchable={true}
                            name={"nprojecttypecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.projectTypeList}
                            value={props.selectedRecord["nprojecttypecode"] || ""}
                            defaultValue={props.selectedRecord["nprojecttypecode"]}
                            onChange={(event) => props.onComboChange(event, "nprojecttypecode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                </Col>
                 <Col md={6}>
                        <FormSelectSearch
                            name={"nprojectcode"}
                            formLabel={props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={props.projectList}
                            value={props.selectedRecord["nprojectcode"]}
                            defaultValue={props.selectedRecord["nprojectcode"]}
                            isMandatory={true}
                            isSearchable={true}
                            isClearable={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            onChange={(value) => props.onComboChange(value, 'nprojectcode', 1)}
                        />
                        
                    </Col> */}
                </Row>

                <Row>
                    <Col md={4}>
                        <CustomSwitch
                            name={"ntransactionstatus"}
                            label={props.intl.formatMessage({ id: "IDS_ACTIVE" })}
                            type="switch"
                            onChange={(event) => props.onInputOnChange(event, 1, [transactionStatus.ACTIVE, transactionStatus.DEACTIVE])}
                            placeholder={props.intl.formatMessage({ id: "IDS_ACTIVE" })}
                            defaultValue={props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false}
                            checked={props.selectedRecord["ntransactionstatus"] === transactionStatus.ACTIVE ? true : false}
                        >
                        </CustomSwitch>
                    </Col>



                    {
                        props.filterData && props.filterData.nproductcatcode.item.nmaterialtypecode == MaterialType.IQCSTANDARDMATERIALTYPE ? "" :
                            <Col md={4}>
                                <CustomSwitch
                                    name={"ncomponentrequired"}
                                    label={props.genericLabel && props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] + " " + props.intl.formatMessage({ id: "IDS_REQUIRED" })}
                                    type="switch"
                                    onChange={(event) => props.onInputOnChange(event, 1, [transactionStatus.YES, transactionStatus.NO])}
                                    placeholder={props.genericLabel && props.genericLabel["Component"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] + " " + props.intl.formatMessage({ id: "IDS_REQUIRED" })}
                                    // defaultValue={props.selectedRecord["ncomponentrequired"] === transactionStatus.YES ? true : false}
                                    //  checked={props.selectedRecord["ncomponentrequired"] === transactionStatus.YES ? true : false}
                                    checked={props.selectedRecord ? props.selectedRecord["ncomponentrequired"] === transactionStatus.YES ? true : false : false}
                                    //disabled={ props.nsampletypecode  === SampleType.CLINICALTYPE && props.settings && parseInt(props.settings[22]) === transactionStatus.YES ? true : false }
                                    //    disabled={props.tempFilterData && props.tempFilterData.nsampletypecode.item.ncategorybasedflowrequired === transactionStatus.YES ? true : false }
                                    disabled={props.tempFilterData && props.tempFilterData.nsampletypecode.item.ncomponentrequired === transactionStatus.YES ? true : false}

                                // disabled={true}//{props.operation==="copy"?true:false}
                                //   disabled={props.nsampletypecode === SampleType.CLINICALTYPE ? true : false}

                                >
                                </CustomSwitch>
                            </Col>
                    }


                    {/* <Col md={4} >
                    <CustomSwitch
                        name={"nclinicalspec"}
                        label={props.intl.formatMessage({ id: "IDS_CLINICALSPEC" })}
                        type="switch"
                        onChange={(event) => props.onInputOnChange(event, 1, [transactionStatus.YES, transactionStatus.NO])}
                        placeholder={props.intl.formatMessage({ id: "IDS_CLINICALSPEC" })}
                        defaultValue={props.selectedRecord["nclinicalspec"] === transactionStatus.YES ? true : false}
                        checked={props.selectedRecord["nclinicalspec"] === transactionStatus.YES ? true : false}
                    // disabled={true}//{props.operation==="copy"?true:false}
                    >
                    </CustomSwitch>
                </Col> */}


                </Row>


            </>
        );
    }

};

export default injectIntl(AddTestGroupSpecification);