import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

class AddComponentPopUp extends Component {

    render() {
        const { Component } = this.props;
        return (
            <Row>
                <Col md={12}>

                    <FormSelectSearch
                        formLabel={this.props.formatMessage({ id: "IDS_COMPONENT" })}
                        isSearchable={true}
                        name={"ncomponentcode"}
                        isDisabled={false}
                        placeholder={this.props.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={Component}
                        alphabeticalSort="true"
                        optionId="ncomponentcode"
                        optionValue="scomponentname"
                        value={this.props.selectComponent ? this.props.selectComponent["ncomponentcode"] : ""}
                        defaultValue={this.props.selectComponent ? this.props.selectComponent["ncomponentcode"] : ""}
                        //  showOption={true}
                        closeMenuOnSelect={true}
                        onChange={(event) => this.props.onComponentChange(event, 'ncomponentcode')}>
                    </FormSelectSearch>
                    <Row>
                        <Col md={'6'}>
                            <DateTimePicker
                                name={"dreceiveddate"}
                                label={this.props.intl.formatMessage({ id: "IDS_RECEIVEDDATEWOTIME" })}
                                className='form-control'
                                placeholderText="Select date.."
                                selected={this.props.selectComponent["dreceiveddate"]}
                                dateFormat={this.props.userInfo["ssitedate"]}
                                //timeInputLabel={this.props.intl.formatMessage({ id: "IDS_RECEIVEDDATE" })}
                                showTimeInput={false}
                                isClearable={false}
                                isMandatory={true}
                                required={true}
                                maxDate={this.props.CurrentTime}
                                maxTime={this.props.CurrentTime}
                                onChange={date => this.props.handleDateChange(date,"dreceiveddate",'component')}
                                value={this.props.selectComponent["dreceiveddate"]}

                            />
                        </Col>
                        <Col md={'6'}>
                            <FormSelectSearch
                                name={"ntzdreceivedate"}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                options={this.props.timeZoneList}
                                optionId="ntimezonecode"
                                optionValue="stimezoneid"
                                value={this.props.selectComponent["ntzdreceivedate"]}
                                defaultValue={this.props.selectComponent["ntzdreceivedate"]}
                                isMandatory={true}
                                isSearchable={true}
                                isClearable={false}
                                closeMenuOnSelect={true}
                                alphabeticalSort={true}
                                onChange={(value) => this.props.onComponentChange(value, 'ntzdreceivedate')}
                            />
                        </Col>
                    </Row>
                    <FormTextarea
                        label={this.props.formatMessage({ id: "IDS_COMMENTS" })}
                        name="scomments"
                        type="text"
                        onChange={(event) => this.props.onInputComponentOnChange(event)}
                        placeholder={this.props.formatMessage({ id: "IDS_COMMENTS" })}
                        value={this.props.selectComponent["scomments"] ? 
                        this.props.selectComponent["scomments"] : ""}
                        isMandatory={false}
                        required={false}
                        maxLength={255}
                    />
                </Col>

            </Row>
        );
    }
}

export default injectIntl(AddComponentPopUp);