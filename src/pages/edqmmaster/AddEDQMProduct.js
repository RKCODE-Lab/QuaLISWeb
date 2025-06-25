import React from 'react';

import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
//import FormTextarea from '../../components/form-textarea/form-textarea.component';
//import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const AddEDQMProduct = (props) => {

    return (

        <Row>
            <Col md={6}>
                <Col md={12}>
                    <FormInput
                        name={"sofficialproductname"}
                        label={props.formatMessage({ id: "IDS_PRODUCTNAME" })}
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_PRODUCTNAME" })}
                        value={props.selectedRecord["sofficialproductname"]}
                        isMandatory={true}
                        required={true}
                        maxLength={255}
                    />

                </Col>
                <Col md={12}>

                    <FormSelectSearch
                        name={"nproductdomaincode"}
                        formLabel={props.formatMessage({ id: "IDS_PRODUCTDOMAIN" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.productDomainData}
                        optionId='nproductdomaincode'
                        optionValue='sproductdomain'
                        defaultValue={props.nproductdomaincode}
                        showOption={true}
                        required={true}

                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'nproductdomaincode')}

                    >
                    </FormSelectSearch>

                </Col>
                <Col md={12}>

                    <FormSelectSearch
                        name={"nproductdesccode"}
                        formLabel={props.formatMessage({ id: "IDS_PRODUCTDESC" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.productDescData}
                        optionId='nproductdesccode'
                        optionValue='sproductclass'
                        defaultValue={props.nproductdesccode}
                        showOption={true}
                        required={true}

                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'nproductdesccode')}
                    >
                    </FormSelectSearch>

                </Col>
                <Col md={12}>

                    <FormSelectSearch
                        name={"nproducttypecode"}
                        formLabel={props.formatMessage({ id: "IDS_PRODUCTTYPE" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={props.productTypeByID && parseInt(props.productTypeByID.nproducttypemand) === 3 ? true : false}
                        required={props.productTypeByID && parseInt(props.productTypeByID.nproducttypemand) === 3 ? true : false}
                        options={props.productTypeData}
                        optionId='nproducttypecode'
                        optionValue='sproducttype'
                        defaultValue={props.nproducttypecode}
                        showOption={true}
                        isClearable={true}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'nproducttypecode')}

                    >
                    </FormSelectSearch>

                </Col>
            </Col>
            <Col md={6}>
                <Col md={12}>

                    <FormSelectSearch
                        name={"nbulktypecode"}
                        formLabel={props.formatMessage({ id: "IDS_BULKTYPE" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={false}
                        options={props.bulkTypeData}
                        optionId='nbulktypecode'
                        optionValue='sbulktype'
                        defaultValue={props.nbulktypecode}
                        showOption={true}
                        required={false}
                        isClearable={true}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'nbulktypecode')}

                    >
                    </FormSelectSearch>

                </Col>
                <Col md={12}>

                    <FormSelectSearch
                        name={"ncomponentbulkgroupcode"}
                        formLabel={props.formatMessage({ id: "IDS_COMPONENTBULKGROUP" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={false}
                        options={props.componentBulkData}
                        optionId='ncomponentbulkgroupcode'
                        optionValue='scomponentbulkgroup'
                        defaultValue={props.ncomponentbulkgroupcode}
                        showOption={true}
                        required={false}
                        isClearable={true}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ncomponentbulkgroupcode')}

                    >
                    </FormSelectSearch>

                </Col>
                <Col md={12}>

                    <FormSelectSearch
                        name={"nmasterfiletypecode"}
                        formLabel={props.formatMessage({ id: "IDS_MASTERFILETYPE" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={false}
                        options={props.masterFileData}
                        optionId='nmasterfiletypecode'
                        optionValue='smasterfiletype'
                        defaultValue={props.nmasterfiletypecode}
                        showOption={true}
                        required={false}
                        isClearable={true}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'nmasterfiletypecode')}

                    >
                    </FormSelectSearch>

                </Col>
                <Col md={12}>

                    <FormSelectSearch
                        name={"nsafetymarkercode"}
                        formLabel={props.formatMessage({ id: "IDS_SAFETYMARKNAME" })}
                        isSearchable={false}
                        isDisabled={false}
                        isMulti={false}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={props.safetyMarkByID && parseInt(props.safetyMarkByID.nsafetymarkermand) === 3 ? true : false}
                        required={props.safetyMarkByID && parseInt(props.safetyMarkByID.nsafetymarkermand) === 3 ? true : false}
                        options={props.safetyFileData}
                        optionId='nsafetymarkercode'
                        optionValue='ssafetymarkername'
                        defaultValue={props.nsafetymarkercode}
                        isClearable={true}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'nsafetymarkercode')}

                    >
                    </FormSelectSearch>
                </Col>
            </Col>

        </Row>



    )
}
export default AddEDQMProduct;
