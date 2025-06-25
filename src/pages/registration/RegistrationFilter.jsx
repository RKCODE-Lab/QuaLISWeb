import React from 'react';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';
import { faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class RegistrationFilter extends React.Component {
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
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.props.FromDate}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.props.handleFilterDateChange("fromdate", date)}
                            value={this.props.FromDate}

                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"todate"}
                            label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.props.ToDate}
                            dateFormat={this.props.userInfo["ssitedate"]}
                            isClearable={false}
                            onChange={date => this.props.handleFilterDateChange("todate", date)}
                            value={this.props.ToDate}

                        />
                    </Col>
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
                            value={this.props.SampleTypeValue ? { "label": this.props.SampleTypeValue.ssampletypename, "value": this.props.SampleTypeValue.ssampletypename } : ""}
                            showOption={true}
                            sortField="nsorter"
                            sortOrder="ascending"
                            onChange={(event) => this.props.onSampleTypeChange(event, 'nsampletypecode', 'SampleTypeValue')}
                        >
                        </FormSelectSearch>
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
                            onChange={(event) => this.props.onRegTypeChange(event, 'nregtypecode', 'RegTypeValue')}
                        >
                        </FormSelectSearch>
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
                            onChange={(event) => this.props.onRegSubTypeChange(event, 'nregsubtypecode', 'RegSubTypeValue')}
                        >
                        </FormSelectSearch>
                    </Col>
                    {/* {this.props.RegSubTypeValue.nneedtemplatebasedflow ?
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
                                onChange={(event) => this.props.onDesignTemplateChange(event, 'ndesigntemplatemappingcode', 'DesignTemplateMappingValue')}
                            >
                            </FormSelectSearch>
                        </Col>
                        : ""} */}
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLESTATUS" })}
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
                        >
                        </FormSelectSearch>
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
                                onChange={(event) => this.props.onApprovalConfigVersionChange(event, "version","ApprovalConfigVersionValue")}
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
                                onChange={(event) => this.props.onDesignTemplateChange(event, 'ndesigntemplatemappingcode', 'DesignTemplateMappingValue')}
                            >
                            </FormSelectSearch>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default injectIntl(RegistrationFilter);