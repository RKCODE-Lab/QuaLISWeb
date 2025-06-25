import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../../components/Enumeration';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';

const AddEmailConfig = (props) => {
    return (
        <Row>
            <Col md={12}>

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_HOSTNAME" })}
                    name={"nemailhostcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailhostcode"] ? props.selectedRecord["nemailhostcode"] : ""}
                    options={props.emailHost}
                    optionId="nemailhostcode"
                    optionValue="shostname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    isDisabled={props.operation=== "update"? true : false}
                    onChange={(event) => props.onComboChange(event, "nemailhostcode")}
                />
         
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SCREENNAME" })}
                    name={"nemailscreencode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailscreencode"] ? props.selectedRecord["nemailscreencode"] : ""}
                    options={props.emailScreen}
                    optionId="nemailscreencode"
                    optionValue="sscreenname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailscreencode")}
                />
           
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                    name={"nemailtemplatecode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailtemplatecode"] ? props.selectedRecord["nemailtemplatecode"] : ""}
                    options={props.emailTemplate}
                    optionId="nemailtemplatecode"
                    optionValue="stemplatename"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={false}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailtemplatecode")}
                />
           
            {/* <Col md={12}>
            <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_ACTIONTYPE" })}
                            name={"ntranscode"} 
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            value={props.selectedRecord["nactiontype"] ? props.selectedRecord["nactiontype"] : ""}
                            options={props.actionType}
                            optionId="nactiontype"
                            optionValue="stransdisplaystatus"
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            as={"select"}
                            onChange={(event) => props.onComboChange(event, "nactiontype")} 
                        />
            </Col> */}
            {/* <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_FORMNAME" })}
                    name={"ntranscode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nformcode"] ? props.selectedRecord["nformcode"] : ""}
                    options={props.formName}
                    optionId="nformcode"
                    optionValue="sformname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nformcode")}
                />
            </Col> */}

                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_CONTROLNAME" })}
                    name={"ncontrolcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["ncontrolcode"] ? props.selectedRecord["ncontrolcode"] : ""}
                    options={props.formControls}
                    optionId="ncontrolcode"
                    optionValue="scontrolname"
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "ncontrolcode")}
                />
           
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_EMAILQUERY" })}
                    name={"nemailuserquerycode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    value={props.selectedRecord["nemailuserquerycode"] ? props.selectedRecord["nemailuserquerycode"] : ""}
                    options={props.emailQueryList}
                    optionId="nemailuserquerycode"
                    optionValue="squery"
                    isMandatory={false}
                    isMulti={false}
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                    as={"select"}
                    onChange={(event) => props.onComboChange(event, "nemailuserquerycode")}
                />

                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_MAILENABLE" })}
                    type="switch"
                    name={"nenableemail"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_MAILENABLE" })}
                    defaultValue={props.selectedRecord["nenableemail"] ? props.selectedRecord["nenableemail"] === transactionStatus.YES ? true : false : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["nenableemail"] ? props.selectedRecord["nenableemail"] === transactionStatus.YES ? true : false : false}
                    disabled={false}
                >
                </CustomSwitch>
            </Col>
            {props.operation === 'create' ?
                <Col md={12}>
                    <FormMultiSelect
                        name={"nusercode"}
                        label={props.intl.formatMessage({ id: "IDS_USERS" })}
                        options={props.users || []}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                  
                        optionId="nusercode"
                        optionValue="semail"
                        value={props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"] || [] :[]}
                        isMandatory={false}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, "nusercode")}
                    />
                </Col> : ""}

        </Row>
    );
};

export default injectIntl(AddEmailConfig);