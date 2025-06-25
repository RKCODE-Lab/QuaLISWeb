import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Row,Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';


const AddMethodValidity = (props) => {
    return (
        <Row>
        <Col md="12">
        <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
            <DateTimePicker
                       name={"dvaliditystartdate"} 
                       label={ props.intl.formatMessage({ id:"IDS_METHODVALIDITYSTARTDATE"})}                     
                       className='form-control'
                       placeholderText="Select date.."
                       selected={props.selectedRecord["dvaliditystartdate"]?props.selectedRecord["dvaliditystartdate"]:props.selectedRecord["dcurrentdate"]}
                       dateFormat={props.userInfo.ssitedate}
                       isMandatory={true}
                       showTimeInput={false}
                       minDate={props.selectedRecord["dcurrentdate"]}
                       isClearable={false}
                       onChange={date => props.handleDateChange("dvaliditystartdate", date,"svaliditystartdate")}
                       value={props.selectedRecord["dvaliditystartdate"]}
                    />
          </Col>            
        </Col>
        {props.userInfo.istimezoneshow === transactionStatus.YES  &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzvaliditystartdatetimezone"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzvaliditystartdatetimezone"] || ""}
                                defaultValue={props.selectedRecord["ntzvaliditystartdatetimezone"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzvaliditystartdatetimezone', 1)}
                            />
                        </Col>
                    }
        <Col md="12">
        <Col md={props.userInfo.istimezoneshow === transactionStatus.YES  ? 6 : 12}>
        <DateTimePicker
                       name={"dvalidityenddate"} 
                       label={ props.intl.formatMessage({ id:"IDS_VALIDITYENDDATE"})}                     
                       className='form-control'
                       placeholderText="Select date.."
                       selected={props.selectedRecord["dvalidityenddate"]?props.selectedRecord["dvalidityenddate"]:props.selectedRecord["dcurrentdate"]}
                       dateFormat={props.userInfo.ssitedate}
                       isMandatory={true}
                       showTimeInput={false}
                       minDate={props.selectedRecord["dcurrentdate"]}
                       isClearable={false}
                       onChange={date => props.handleDateChange("dvalidityenddate", date,"svalidityenddate")}
                       value={props.selectedRecord["dvalidityenddate"]}
                    />
                    </Col>
        </Col>
        {props.userInfo.istimezoneshow === transactionStatus.YES  &&
                        <Col md={6}>
                            <FormSelectSearch
                                name={"ntzvalidityenddatetimezone"}
                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={props.TimeZoneList}
                                value={props.selectedRecord["ntzvalidityenddatetimezone"] || ""}
                                defaultValue={props.selectedRecord["ntzvalidityenddatetimezone"]}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                // isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(event) => props.onComboChange(event, 'ntzvalidityenddatetimezone', 1)}
                            />
                        </Col>
                    }
        </Row>
    );
};

export default injectIntl(AddMethodValidity);