import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const ProtocolFilter = (props) => {
  return (
    <Row>
      <Col md={12}>        
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id:"IDS_CONFIGVERSION"})}
                placeholder={props.intl.formatMessage({ id:"IDS_CONFIGVERSION"})}
                name="napprovalconfigversioncode"
                optionId="napprovalconfigversioncode"
                optionValue="sversionname"
                className='form-control'
                options={props.configVersion}
                value={props.configVersionValue? { "label": props.configVersionValue.sversionname, "value": props.configVersionValue.napprovalconfigversioncode } : ""}
                isMandatory={false}
                isMulti={false}
                isSearchable={true}
                isDisabled={false}
                alphabeticalSort={false}
                isClearable={false}
                onChange={(event)=>props.onFilterComboChange(event,"napprovalconfigversioncode")}
            />
        </Col>
        <Col md={12}>        
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id:"IDS_DESIGNTEMPLATE"})}
                placeholder={props.intl.formatMessage({ id:"IDS_DESIGNTEMPLATE"})}
                name="ndesigntemplatemappingcode"
                optionId="ndesigntemplatemappingcode"
                optionValue="sregtemplatename"
                className='form-control'
                options={props.dynamicDesignMapping}
                value={props.dynamicDesignMappingValue? { "label": props.dynamicDesignMappingValue.sregtemplatename, "value": props.dynamicDesignMappingValue.ndesigntemplatemappingcode } : ""}
                isMandatory={false}
                isMulti={false}
                isSearchable={true}
                isDisabled={false}
                alphabeticalSort={false}
                isClearable={false}
                onChange={(event)=>props.onFilterComboChange(event,"ndesigntemplatemappingcode")}
            />
        </Col>
        
        <Col md={12}>        
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id:"IDS_STATUS"})}
                placeholder={props.intl.formatMessage({ id:"IDS_STATUS"})}
                name="ntransactionstatus"
                optionId="ntransactionstatus"
                optionValue="sfilterstatus"
                className='form-control'
                options={props.status}
                value={props.statusValue? { "label": props.statusValue.sfilterstatus, "value": props.statusValue.ntransactionstatus } : ""}
                isMandatory={false}
                isMulti={false}
                isSearchable={true}
                isDisabled={false}
                alphabeticalSort={false}
                isClearable={false}
                onChange={(event)=>props.onFilterComboChange(event,"ntransactionstatus")}
            />
        </Col>         
    </Row>
  );
};
export default injectIntl(ProtocolFilter);