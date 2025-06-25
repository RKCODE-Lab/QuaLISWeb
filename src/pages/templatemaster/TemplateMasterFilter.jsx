import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
const TemplateMasterFilter = (props) => {
    console.log("props:", props);
     return (

        <Row>
            <Col md={12}>
                {props.filterSampleType ?
                    <FormSelectSearch
                        name={"nsampletypecode"}
                        formLabel={props.formatMessage({ id: "IDS_SAMPLETYPE" })}
                        optionId='nsampletypecode'
                        optionValue='ssampletypename'
                        options={props.filterSampleType}
                        value={props.defaultsampletype}
                       // menuPosition={"fixed"}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isSearchable={true}
                        isDisabled={false}
                        isMandatory={false}
                        onChange={event => props.onComboChange(event, "sampleType")}
                    />
                : ""}

                {/* {props.filterCateogryType[props.labelName] ? props.filterCateogryType[props.labelName].length > 0 ? */}
                {/* {props.filterCateogryType ? props.filterCateogryType.length > 0 ? */}
                    <FormSelectSearch
                        name={props.catogryValuemember&&props.catogryValuemember}
                        formLabel={props.labelName&&props.formatMessage({ id: props.labelName })}
                        optionId={props.catogryValuemember&&props.catogryValuemember}
                        optionValue={props.categoryDisplaymemeber&&props.categoryDisplaymemeber}
                        options={props.filterCateogryType&&props.filterCateogryType}
                        placeholder={props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        value={props.defaultCatogoryType&&props.defaultCatogoryType||{}}
                       // menuPosition={"fixed"}
                        isSearchable={true}
                        isDisabled={false}
                        isMandatory={false}
                        onChange={(event) => props.onComboChange(event, 'cateogryType')}
                    />
                {/* : "" : ""} */}
            </Col>
        </Row>
    );
};
export default TemplateMasterFilter;