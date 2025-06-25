import React from "react";
import { injectIntl } from "react-intl";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "../../../components/date-time-picker/date-time-picker.component";
import FormSelectSearch from "../../../components/form-select-search/form-select-search.component";
import { rearrangeDateFormat } from "../../../components/CommonScript";

const BatchApprovalFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <Row>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromDate"}
                            label={props.intl.formatMessage({ id: "IDS_FROM" })}
                            className="form-control"
                            placeholderText="Select date.."
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={false}
                            //selected={props.filterRecord["fromDate"] ? props.filterRecord["fromDate"] : props.fromDate ? new Date(props.fromDate) : new Date()}
                            selected={props.filterRecord["fromDate"] ? props.filterRecord["fromDate"] : props.fromDate ? 
                                                rearrangeDateFormat(props.userInfo,props.fromDate) : new Date()}
                            
                            //value={props.filterRecord["fromDate"] ? props.filterRecord["fromDate"] : props.fromDate ? new Date(props.fromDate) : new Date()}
                            value={props.filterRecord["fromDate"] ? props.filterRecord["fromDate"] : props.fromDate ?
                                                rearrangeDateFormat(props.userInfo,props.fromDate) : new Date()}
                            onChange={(date) => props.handleDateChange("fromDate", date)}

                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"toDate"}
                            label={props.intl.formatMessage({ id: "IDS_TO" })}
                            className="form-control"
                            placeholderText="Select date.."
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={false}
                            //selected={props.filterRecord["toDate"] ? props.filterRecord["toDate"] : props.toDate ? new Date(props.toDate) : new Date()}
                            //value={props.filterRecord["toDate"] ? props.filterRecord["toDate"] : props.toDate ? new Date(props.toDate) : new Date()}
                            selected={props.filterRecord["toDate"] ? props.filterRecord["toDate"] : props.toDate ? 
                                            rearrangeDateFormat(props.userInfo,props.toDate) : new Date()}
                            value={props.filterRecord["toDate"] ? props.filterRecord["toDate"] : props.toDate ? 
                                            rearrangeDateFormat(props.userInfo,props.toDate) : new Date()}
                            onChange={(date) => props.handleDateChange("toDate", date)}

                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CONFIGVERSION" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_CONFIGVERSION" })}
                            name="napproveconfversioncode"
                            optionId="napprovalconfigversioncode"
                            optionValue="sversionname"
                            className='form-control'
                            options={props.approvalVersion}
                            value={props.filterRecord.napproveconfversioncode ? props.filterRecord.napproveconfversioncode : props.approvalVersionValue ? { "label": props.approvalVersionValue.sversionname, "value": props.approvalVersionValue.napprovalconfigversioncode } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => props.onApprovalVersionChange(event, "napproveconfversioncode")}
                        />
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_STATUS" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_STATUS" })}
                            name="ntransactionstatus"
                            optionId="ntransactionstatus"
                            optionValue="sfilterstatus"
                            className='form-control'
                            options={props.filterStatus}
                            value={props.filterRecord.ntransactionstatus ? props.filterRecord.ntransactionstatus : props.filterStatusValue ? { "label": props.filterStatusValue.sfilterstatus, "value": props.filterStatusValue.ntransactionstatus } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => props.onFilterComboChange(event, "ntransactionstatus")}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
export default injectIntl(BatchApprovalFilter);