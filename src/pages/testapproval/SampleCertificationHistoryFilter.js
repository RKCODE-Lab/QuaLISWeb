import React from 'react';

import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const SampleCertificationHistoryFilter = (props) => {
    return (
        <Row>
            <Col md={6}>
                <DateTimePicker
                    name={"fromdate"}
                    label={props.formatMessage({ id: "IDS_FROM" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={props.FromDate}
                    dateFormat={props.userInfo["ssitedate"]}
                    isClearable={false}
                    onChange={date => props.handleFilterDateChange("fromdate", date)}
                    value={props.FromDate}

                />
            </Col>
            <Col md={6}>
                <DateTimePicker
                    name={"todate"}
                    label={props.formatMessage({ id: "IDS_TO" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={props.ToDate}
                    dateFormat={props.userInfo["ssitedate"]}
                    isClearable={false}
                    onChange={date => props.handleFilterDateChange("todate", date)}
                    value={props.ToDate}

                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_SAMPLETYPE" })}
                    isSearchable={true}
                    name={"nsampletypecode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={props.SampleType}
                    optionId="nsampletypecode"
                    optionValue="ssampletypename"
                    value={props.SampleTypeValue ? props.SampleTypeValue.nsampletypecode : ""}
                    //value={props.SampleTypeValue ? { "label": props.SampleTypeValue.ssampletypename, "value": props.SampleTypeValue.nsampletypecode } : ""}
                    showOption={true}
                    sortField="nsorter"
                    sortOrder="ascending"
                    onChange={(event) => props.onSampleTypeChange(event, 'nsampletypecode', 'SampleTypeValue')}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                    isSearchable={true}
                    name={"nregtypecode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={props.RegistrationType}
                    optionId="nregtypecode"
                    optionValue="sregtypename"
                    // value = { props.RegTypeValue["nregtypecode"] }
                    value={props.RegTypeValue ? props.RegTypeValue.nregtypecode : ""}
                    showOption={true}
                    //sortField="nsorter"
                    //sortOrder="ascending"
                   // onChange={(event) => props.onRegTypeChange(event, 'nregtypecode', 'RegTypeValue')}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                    isSearchable={true}
                    name={"nregsubtypecode"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={props.RegistrationSubType}
                    optionId="nregsubtypecode"
                    optionValue="sregsubtypename"
                    value={props.regSubTypeValue ? props.regSubTypeValue.nregsubtypecode : ""}
                    showOption={true}
                    sortField="nsorter"
                    sortOrder="ascending"
                    onChange={(event) => props.onRegSubTypeChange(event, 'nregsubtypecode', 'RegSubTypeValue')}
                >
                </FormSelectSearch>
            </Col>
            {/* <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_FILTERSTATUS" })}
                    isSearchable={true}
                    name={"ntransactionstatus"}
                    isDisabled={false}
                    placeholder={props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={props.FilterStatus}
                    optionId="ntransactionstatus"
                    optionValue="stransdisplaystatus"
                    value={props.FilterStatusValue ? props.FilterStatusValue.ntransactionstatus : ""}
                   // value={props.FilterStatusValue ? { "label": props.FilterStatusValue.stransdisplaystatus, "value": props.FilterStatusValue.napprovalstatuscode } : ""}
                    showOption={true}
                    sortField="stransdisplaystatus"
                    sortOrder="ascending"
                    onChange={(event) => props.onFilterChange(event, 'ntransactionstatus')}
                >
                </FormSelectSearch>
            </Col> */}
        </Row>
    );
}
export default injectIntl(SampleCertificationHistoryFilter);