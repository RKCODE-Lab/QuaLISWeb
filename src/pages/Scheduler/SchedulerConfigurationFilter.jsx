import React from 'react';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ALPD-4914 created SchedulerConfigurationFilter.jsx file for scheduler configuration screen
class SchedulerConfigurationFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: false
        }
    }
    showMoreToggle = () => {
        this.setState({
            showMore: !this.state.showMore

        })
    }
    render() {
        return (
            <div className="side_more_filter_wrap">
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                            isSearchable={true}
                            name={"nsampletypecode"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.SampleType}
                            optionId="nsampletypecode"
                            optionValue="ssampletypename"
                            value={this.props.SampleTypeValue ? { "label": this.props.SampleTypeValue.ssampletypename, "value": this.props.SampleTypeValue.nsampletypecode } : ""}
                            showOption={true}
                            sortField="nsorter"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onSampleTypeChange(event, 'SampleTypeValue')}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                            isSearchable={true}
                            name={"nregtypecode"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.RegistrationType}
                            optionId="nregtypecode"
                            optionValue="sregtypename"
                            value={this.props.RegTypeValue ? { "label": this.props.RegTypeValue.sregtypename, "value": this.props.RegTypeValue.nregtypecode } : ""}
                            showOption={true}
                            sortField="nsorter"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onRegTypeChange(event, 'RegTypeValue')}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                            isSearchable={true}
                            name={"nregsubtypecode"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.RegistrationSubType}
                            optionId="nregsubtypecode"
                            optionValue="sregsubtypename"
                            value={this.props.RegSubTypeValue ? { "label": this.props.RegSubTypeValue.sregsubtypename, "value": this.props.RegSubTypeValue.nregsubtypecode } : ""}
                            showOption={true}
                            sortField="nsorter"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onRegSubTypeChange(event, 'RegSubTypeValue')}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SCHEDULERCONFIGTYPE" })}
                            isSearchable={true}
                            name={"nschedulerconfigtypecode"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.SchedulerConfigType}
                            optionId="nschedulerconfigtypecode"
                            optionValue="sschedulerconfigtypename"
                            value={this.props.SchedulerConfigTypeValue ? { "label": this.props.SchedulerConfigTypeValue.sschedulerconfigtypename, "value": this.props.SchedulerConfigTypeValue.nschedulerconfigtypecode } : ""}
                            showOption={true}
                            sortField="nsorter"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onSchedulerConfigTypeChange(event, 'SchedulerConfigTypeValue')}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_STATUS" })}
                            isSearchable={true}
                            name={"ntransactionstatus"}
                            isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.FilterStatus}
                            optionId="ntransactionstatus"
                            optionValue="stransdisplaystatus"
                            value={this.props.FilterStatusValue ? { "label": this.props.FilterStatusValue.stransdisplaystatus, "value": this.props.FilterStatusValue.ntransactionstatus } : ""}
                            showOption={true}
                            sortField="stransdisplaystatus"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onFilterChange(event, 'FilterStatusValue')}
                        />
                    </Col>
                </Row>
                {!this.state.showMore ?
                    <button className="btn_sidebar_open" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faAngleDoubleRight} /> </button> : ''}
                <div className={`side_more_filter ${this.state.showMore ? 'active' : ''} `} >
                    <button className="btn_sidebar_close" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faTimes} /> </button>
                    <Row>
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONFIGVERSION" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="sversionname"
                                optionId="napprovalconfigversioncode"
                                optionValue="sversionname"
                                className='form-control'
                                options={this.props.ApprovalConfigVersion}
                                value={this.props.ApprovalConfigVersionValue ? { "label": this.props.ApprovalConfigVersionValue.sversionname, "value": this.props.ApprovalConfigVersionValue.napproveconfversioncode } : ""}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                onChange={(event) => this.props.onApprovalConfigVersionChange(event, "ApprovalConfigVersionValue")}
                            />
                        </Col>
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_DESIGNTEMPLATE" })}
                                isSearchable={true}
                                name={"ndesigntemplatemappingcode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={this.props.DynamicDesignMapping}
                                optionId="ndesigntemplatemappingcode"
                                optionValue="sregtemplatename"
                                value={this.props.DesignTemplateMappingValue ? { "label": this.props.DesignTemplateMappingValue.sregtemplatename, "value": this.props.DesignTemplateMappingValue.ndesigntemplatemappingcode } : ""}
                                showOption={true}
                                sortField="ndesigntemplatemappingcode"
                                sortOrder="ascending"
                                onChange={(event) => this.props.onDesignTemplateChange(event, 'DesignTemplateMappingValue')}
                            >
                            </FormSelectSearch>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default injectIntl(SchedulerConfigurationFilter);