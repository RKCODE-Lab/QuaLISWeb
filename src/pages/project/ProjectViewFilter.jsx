import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";
import { injectIntl } from 'react-intl';

const ProjectViewFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <Row>
                <Col md={6}>
                    <DateTimePicker
                                      name={"fromdate"}
                                      label={props.intl.formatMessage({ id: "IDS_FROM" })}
                                      className="form-control"
                                      placeholderText="Select date.."
                                      selected={props.selectedRecord["fromdate"] || props.fromDate ? new Date(props.fromDate): new Date()}
                                      dateFormat={props.userInfo.ssitedate}            
                                      isClearable={false}
                                      onChange={(date) => props.handleDateChange("fromdate", date)}
                                      value={props.selectedRecord["fromdate"] || props.fromDate ? new Date(props.fromDate): new Date()}
                        />
                </Col>
                <Col md={6}>
                    <DateTimePicker
                            name={"todate"}
                            label={props.intl.formatMessage({ id: "IDS_TO" })}
                            className="form-control"
                            placeholderText="Select date.."
                            selected={props.selectedRecord["todate"] || props.toDate ? new Date(props.toDate) :new Date()}
                            dateFormat={props.userInfo.ssitedate}
                            isClearable={false}
                            onChange={(date) => props.handleDateChange("todate", date)}              
                            value={props.selectedRecord["todate"] || props.toDate ? new Date(props.toDate) :new Date()}
                    />
                </Col>
                </Row>
            </Col>

            <Col md={12}>
                <FormSelectSearch
                    name={"nsampletypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterSampleType}
                    optionId='nsampletypecode'
                    optionValue='ssampletypename'
                    //     value={props.nfilterSampleType ? props.nfilterSampleType.nsampletypecode: ""}
                    value={props.selectedRecord ? props.selectedRecord.nsampletypecodevalue : ""}
                    //    value={props.filterProjectType ? props.filterProjectType[props.filterProjectType.length-1] : ""}
                    onChange={event => props.onComboChange(event, "nsampletypecodevalue", 2)}
                >
                </FormSelectSearch>
            </Col>

            <Col md={12}>
                <FormSelectSearch
                    name={"nprojecttypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterProjectType}
                    optionId='nprojecttypecode'
                    optionValue='sprojecttypename'
                    //     value={props.nfilterProjectType ? props.nfilterProjectType.nprojecttypecode: ""}
                    value={props.selectedRecord ? props.selectedRecord.nprojecttypecodevalue : ""}
                    //    value={props.filterProjectType ? props.filterProjectType[props.filterProjectType.length-1] : ""}
                    onChange={event => props.onComboChange(event, "nprojecttypecodevalue", 2)}
                >
                </FormSelectSearch>
            </Col>

        </Row>
    );
};

export default injectIntl(ProjectViewFilter);