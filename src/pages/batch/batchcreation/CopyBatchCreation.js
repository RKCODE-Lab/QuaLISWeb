import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Card, FormLabel } from 'react-bootstrap';

import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import { ReadOnlyText } from '../../../components/App.styles';
import { FormGroup } from 'react-bootstrap';


const CopyBatchCreation = (props) => {
    return (<>
        <Row>
            <Col md={12}>
                <Card>
                    <Card.Header>
                        {props.intl.formatMessage({ id: "IDS_BATCHDETAILSTOBECOPIED" })}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_BATCHRELEASENUMBER" message="Batch Release Number" /></FormLabel>
                                        <ReadOnlyText>{props.selectedBacthCreation.nreleasebatchcode}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_PRODUCTCATEGORY" message="Product Category" /></FormLabel>
                                        <ReadOnlyText>{props.selectedBacthCreation.sproductcatname}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_PRODUCT" message="Product" /></FormLabel>
                                        <ReadOnlyText>{props.selectedBacthCreation.sproductname}</ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_MANUFACTURER" message="Manufacturer" /></FormLabel>
                                        <ReadOnlyText>
                                            {props.selectedBacthCreation.smanufname}
                                        </ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_LICENSENUMBER" message="License Number" /></FormLabel>
                                        <ReadOnlyText>
                                            {props.selectedBacthCreation.slicencenumber}
                                        </ReadOnlyText>
                                    </FormGroup>
                                </Col>

                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_CERTIFICATETYPE" message="Certificate Type" /></FormLabel>
                                        <ReadOnlyText>
                                            {props.selectedBacthCreation.scertificatetype}
                                        </ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_STUDYPLAN" message="Study Plan" /></FormLabel>
                                        <ReadOnlyText>
                                            {props.selectedBacthCreation.sspecname}
                                        </ReadOnlyText>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_NOOFCONTAINER" message="No. of Container" /></FormLabel>
                                        <ReadOnlyText>{props.selectedBacthCreation.nnoofcontainer} </ReadOnlyText>
                                    </FormGroup>
                                </Col>

                                <Col md={4}>
                                    <FormGroup>
                                        <FormLabel><FormattedMessage id="IDS_BATCHFILINGNUMBER" message="Batch Filing Lot No." /></FormLabel>
                                        <ReadOnlyText>{props.selectedBacthCreation.sbatchfillinglotno} </ReadOnlyText>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mtop-4">
            <Col md={12}>

                <FormInput
                    name={"sbatchfillinglotno"}
                    type="text"
                    label={props.intl.formatMessage({ id: "IDS_BATCHFILINGNUMBER" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_BATCHFILINGNUMBER" })}
                    value={props.selectedRecord["sbatchfillinglotno"]}
                    isMandatory={true}
                    required={true}
                    maxLength={10}
                    onChange={(event) => props.onInputOnChange(event)}
                />

                <DateTimePicker
                    name={"dvaliditystartdate"}
                    label={props.intl.formatMessage({ id: "IDS_VALIDITYSTARTDATEWOTIME" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={props.selectedRecord["dvaliditystartdate"]}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    isMandatory={true}
                    showTimeInput={false}           
                    required={true}
                    maxDate={props.selectedRecord["dvaliditystartdate"]}
                    maxTime={props.selectedRecord["dvaliditystartdate"]}
                    onChange={date => props.handleDateChange("dvaliditystartdate", date)}
                    value={props.selectedRecord["dvaliditystartdate"]}
                />

                {/* <FormSelectSearch
                                name={"ntzvaliditystartdate"}
                                formLabel={ props.intl.formatMessage({ id:"IDS_TIMEZONE"})}                                
                                placeholder="Please Select..."                                
                                options={ props.timeZoneList}
                                value = { props.selectedRecord["ntzvaliditystartdate"] }
                                isMandatory={true}
                                isMulti={false}
                                isSearchable={true}
                                isClearable={false}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange = {(event)=> props.onComboChange(event, 'ntzvaliditystartdate')}                               
                            /> */}


                <DateTimePicker
                    name={"dexpirydate"}
                    label={props.intl.formatMessage({ id: "IDS_EXPIRYDATEWOTIME" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={props.selectedRecord["dexpirydate"]}
                    dateFormat={props.userInfo.ssitedate}
                    isClearable={false}
                    isMandatory={true}
                    required={true}
                    showTimeInput={false}     
                    minDate={props.selectedRecord["dvaliditystartdate"]}
                    minTime={props.selectedRecord["dvaliditystartdate"]}
                    onChange={date => props.handleDateChange("dexpirydate", date)}
                    value={props.selectedRecord["dexpirydate"]}
                />

                <FormSelectSearch
                    name={"ntzexpirydate"}
                    formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                    placeholder="Please Select..."
                    options={props.timeZoneList}
                    value={props.selectedRecord["ntzexpirydate"]}
                    isMandatory={true}
                    isMulti={false}
                    isSearchable={true}
                    isClearable={false}
                    isDisabled={false}
                    closeMenuOnSelect={true}
                    onChange={(event) => props.onComboChange(event, 'ntzexpirydate')}
                />
            </Col>
        </Row>

    </>
    )
}
export default injectIntl(CopyBatchCreation);
