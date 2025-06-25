import React from 'react';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row } from 'react-bootstrap';
import { transactionStatus } from '../../components/Enumeration';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';


//ALPD-4984
//Added by Neeraj 
const AddRulesCopy = (props) => {
    return (
        <Row>
             <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORY" })}
                    isSearchable={true}
                    name={"nproductcatcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={props.getProductCategory || []}
                    optionId='label'
                    optionValue='value'
                    value={props.selectedRecord["nproductcatcode"]||""}
                    onChange={value => props.onComboChange(value, "nproductcatcode")}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            {props.selectedRecord &&
            props.selectedRecord["nproductcatcode"] && 
            props.selectedRecord["nproductcatcode"].item &&
            props.selectedRecord["nproductcatcode"].item.ncategorybasedflow===transactionStatus.NO ?
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                    isSearchable={true}
                    name={"nproductcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={props.getProductList || []}
                    optionId='label'
                    optionValue='value'
                    value={props.selectedRecord["nproductcode"]||""}
                    onChange={value => props.onComboChange(value, "nproductcode")}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            :""}
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_ROOT" })}
                    isSearchable={true}
                    name={"ntemplatemanipulationcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={props.getProfileRoot || []}
                    optionId='label'
                    optionValue='value'
                    value={props.selectedRecord["ntemplatemanipulationcode"]||""}
                    onChange={value => props.onComboChange(value, "ntemplatemanipulationcode")}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
      
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SPECIFICATION" })}
                    isSearchable={true}
                    name={"nallottedspeccode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={props.getSpecificationList || []}
                    optionId='label'
                    optionValue='value'
                    value={props.selectedRecord["nallottedspeccode"]||""}
                    onChange={value => props.onComboChange(value, "nallottedspeccode")}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
        {props.selectedRecord &&
        props.selectedRecord["nallottedspeccode"] && 
        props.selectedRecord["nallottedspeccode"].item &&
        props.selectedRecord["nallottedspeccode"].item.ncomponentrequired===transactionStatus.YES ?
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_COMPONENT" })}
                    isSearchable={true}
                    name={"ncomponentcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    showOption={true}
                    options={props.getComponentList || []}
                    optionId='label'
                    optionValue='value'
                    value={props.selectedRecord["ncomponentcode"]||""}
                    onChange={value => props.onComboChange(value, "ncomponentcode")}
                    alphabeticalSort={true}
                >
                </FormSelectSearch>
            </Col>
            :""}

            <Col md={12}>
                <FormMultiSelect
                        name={"ntestgrouprulesenginecode"}
                        label={props.intl.formatMessage({ id: "IDS_RULESENGINENAME" })}
                        options={props.getRulesList || []}
                        optionId={"value"}
                        optionValue="label"
                        value={props.selectedRecord && props.selectedRecord["ntestgrouprulesenginecode"]||[]}
                        isMandatory={true}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange={event => props.onComboChange(event, "ntestgrouprulesenginecode")}
                    />
            </Col>
        </Row>
    )
}
export default injectIntl(AddRulesCopy);