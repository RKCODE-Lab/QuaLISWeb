import { faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
//import { comboChangeUserRolePolicy } from '../../actions';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
class ResultEntryFilter extends React.Component {

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
        console.log("date:", this.props.fromDate, this.props.toDate);
        return (
            <div className="side_more_filter_wrap">
                <Row>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText={this.props.intl.formatMessage({ id: "IDS_FROM" })}
                            selected={this.props.fromDate}
                            value={this.props.fromDate}
                            dateFormat={this.props.userInfo.ssitedate}
                            onChange={date => this.props.onFilterComboChange(date, "fromDate")}
                            isClearable={false}
                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText={this.props.intl.formatMessage({ id: "IDS_TO" })}
                            selected={this.props.toDate}
                            value={this.props.toDate}
                            dateFormat={this.props.userInfo.ssitedate}
                            onChange={date => this.props.onFilterComboChange(date, "toDate")}
                            isClearable={false}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            name="nsampletypecode"
                            optionId="nsampletypecode"
                            optionValue="ssampletypename"
                            className='form-control'
                            options={this.props.SampleType}
                            value={this.props.SampleTypeValue ? { "label": this.props.SampleTypeValue.ssampletypename, "value": this.props.SampleTypeValue.nsampletypecode } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "nsampletypecode")}
                        />

                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            name="nregtypecode"
                            className='form-control'
                            options={this.props.RegType}
                            value={this.props.RegTypeValue ? { "label": this.props.RegTypeValue.sregtypename, "value": this.props.RegTypeValue.nregtypecode } : ""}
                            optionId="nregtypecode"
                            optionValue="sregtypename"
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "nregtypecode")}
                        />

                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            name="nregsubtypecode"
                            optionId="nregsubtypecode"
                            optionValue="sregsubtypename"
                            className='form-control'
                            options={this.props.RegSubType}
                            value={this.props.RegSubTypeValue ? { "label": this.props.RegSubTypeValue.sregsubtypename, "value": this.props.RegSubTypeValue.nregsubtypecode } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "nregsubtypecode")}
                        />

                        {/* <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_JOBSTATUS" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_JOBSTATUS" })}
                            name="sidsjobstatusname"
                            optionId="njobstatuscode"
                            optionValue="sidsjobstatusname"
                            className='form-control'
                            options={props.REJobStatus}
                            value={props.JobStatusValue ? { "label": props.JobStatusValue.sidsjobstatusname, "value": props.JobStatusValue.njobstatuscode } : ""}
                            isMandatory={false}
                            required={true}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => props.onFilterComboChange(event, "jobstatus")}
                        /> */}

                        {/* <Col md={12}>
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
            </Col> */}

                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_TESTSTATUS" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            name="ntransactionstatus"
                            optionId="ntransactionstatus"
                            optionValue="sfilterstatus"
                            className='form-control'
                            options={this.props.FilterStatus}
                            value={this.props.FilterStatusValue ? { "label": this.props.FilterStatusValue.sfilterstatus, "value": this.props.FilterStatusValue.ntransactionstatus } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event) => this.props.onFilterComboChange(event, "filter")}
                        />
                    </Col>
                </Row>
                {!this.state.showMore ?
                    <button className="btn_sidebar_open" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faAngleDoubleRight} /> </button> : ''}
                <div className={`side_more_filter ${this.state.showMore ? 'active' : ''} `} >
                    <button className="btn_sidebar_close" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faTimes} /> </button>
                    <Row>
                        {/* {this.props.RegSubTypeValue.nneedtemplatebasedflow? */}
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_CONFIGVERSION" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="sversionname"
                                optionId="napprovalconfigversioncode"
                                optionValue="sversionname"
                                className='form-control'
                                options={this.props.ApprovalVersion}
                                value={this.props.ApprovalVersionValue ? { "label": this.props.ApprovalVersionValue.sversionname, "value": this.props.ApprovalVersionValue.napprovalconfigversioncode } : ""}
                                isMandatory={false}

                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                onChange={(event) => this.props.onFilterComboChange(event, "version")}
                            />
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_DESIGNTEMPLATE" })}
                                isSearchable={true}
                                name={"ndesigntemplatemappingcode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={false}
                                options={this.props.DynamicDesignMapping}
                                optionId="ndesigntemplatemappingcode"
                                optionValue="sregtemplatename"
                                value={this.props.DesignTemplateMappingValue ? { "label": this.props.DesignTemplateMappingValue.sregtemplatename, "value": this.props.DesignTemplateMappingValue.ndesigntemplatemappingcode } : ""}
                                showOption={true}
                                sortField="ndesigntemplatemappingcode"
                                sortOrder="ascending"
                                onChange={(event) => this.props.onFilterComboChange(event, 'ndesigntemplatemappingcode', 'DesignTemplateMappingValue')}
                            />
                        </Col>
                        {/* :""} */}
                        <Col md={12}>

                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="ntestcode"
                                optionId="ntestcode"
                                optionValue="stestsynonym"
                                className='form-control'
                                options={this.props.Test}
                                value={this.props.TestValue ? { "label": this.props.TestValue.stestsynonym, "value": this.props.TestValue.ntestcode } : ""}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                onChange={(event) => this.props.onFilterComboChange(event, "test")}
                            />
                        </Col>

                        {this.props.RegSubTypeValue && (this.props.RegSubTypeValue.nneedbatch == true || this.props.RegSubTypeValue.nneedworklist == true) &&
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_WORKLISTORBATCH" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nconfigfiltercode"
                                optionId="sfiltername"
                                optionValue="sfiltername"
                                className='form-control'
                                options={this.props.ConfigurationFilter}
                                value={this.props.ConfigurationFilterValue ? { "label": this.props.ConfigurationFilterValue.sfiltername, "value": this.props.ConfigurationFilterValue.nconfigfiltercode } : ""}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={false}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={true}
                                onChange={(event) => this.props.onFilterComboChange(event, "nconfigfiltercode")}
                            />
                        </Col>
    }
     {this.props.ConfigurationFilterValue && this.props.ConfigurationFilterValue.nconfigfiltercode == 1 && this.props.RegSubTypeValue.nneedworklist == true &&
                        <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_WORKLIST" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nworklistcode"
                                optionId="sworklistno"
                                optionValue="sworklistno"
                                className='form-control'
                                options={this.props.Worklist}
                                value={this.props.WorklistValue ? { "label": this.props.WorklistValue.sworklistno, "value": this.props.WorklistValue.nworklistcode } : ""}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                onChange={(event) => this.props.onFilterComboChange(event, "nworklistcode")}
                            />
                        </Col>
    }
                      {this.props.ConfigurationFilterValue && this.props.ConfigurationFilterValue.nconfigfiltercode == 2 && this.props.RegSubTypeValue.nneedbatch == true &&
                         <Col md={12}>
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_BATCH" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nbatchmastercode"
                                optionId="nbatchmastercode"
                                optionValue="sbatcharno"
                                className='form-control'
                                options={this.props.Batch}
                                value={this.props.BatchValue ? { "label": this.props.BatchValue.sbatcharno, "value": this.props.BatchValue.nbatchmastercode } : ""}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={false}
                                onChange={(event) => this.props.onFilterComboChange(event, "nbatchmastercode")}
                            />
                        </Col> 
                         }
            
                    </Row>
                </div>
            </div>
        );
    }
}
export default injectIntl(ResultEntryFilter)