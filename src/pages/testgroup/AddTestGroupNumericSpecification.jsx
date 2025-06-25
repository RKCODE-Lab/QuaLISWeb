import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row, FormGroup, Card } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';

const AddTestGroupNumericSpecification = (props) => {
    const { needActualResult, gender, grade, toAgePeriod, formAgePeriod } = props.parameterData;


    return (
        <Col md="12">
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_GENDER" })}
                isSearchable={true}
                name={"ngendercode"}
                // isDisabled={needActualResult}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                // isMandatory={!needActualResult}
                isMandatory={true}
                options={gender || []}
                optionId='ngendercode'
                optionValue='sgendername'
                value={props.selectedRecord && props.selectedRecord["ngendercode"] ? props.selectedRecord["ngendercode"] : ""}
                onChange={value => props.onComboChange(value, "ngendercode", 1)}
                alphabeticalSort={true}
            >
            </FormSelectSearch>
            <Row>
                <Col md={6}>
                    <FormNumericInput
                        name={"nfromage"}
                        label={props.intl.formatMessage({ id: "IDS_FROMAGE" })}
                        type="number"
                        value={props.selectedRecord["nfromage"]}
                        placeholder={props.intl.formatMessage({ id: "IDS_FROMAGE" })}
                        strict={true}
                        min={0}
                        isMandatory={true}
                        //max={9999999.99}
                        maxLength={3}
                        onChange={(value) => props.onNumericInputChange(value, "nfromage")}
                        noStyle={true}
                        className="form-control"
                        errors="Please provide a valid number."
                    />
                </Col>
                <Col md={6}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                        isSearchable={true}
                        name={"nfromageperiod"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        isClearable={true}
                        required={false}
                        isMulti={false}
                        options={formAgePeriod}
                        value={props.selectedRecord["nfromageperiod"] || ""}
                        defaultValue={props.selectedRecord["nfromageperiod"]}
                        onChange={(event) => props.onComboChange(event, "nfromageperiod", 1)}
                        closeMenuOnSelect={true}
                    >
                    </FormSelectSearch>
                </Col>
            </Row >

            <Row>
                <Col md={6}>
                    <FormNumericInput
                        name={"ntoage"}
                        label={props.intl.formatMessage({ id: "IDS_TOAGE" })}
                        type="number"
                        value={props.selectedRecord["ntoage"]}
                        placeholder={props.intl.formatMessage({ id: "IDS_TOAGE" })}
                        strict={true}
                        min={0}
                        isMandatory={true}
                        //max={9999999.99}
                        maxLength={3}
                        onChange={(value) => props.onNumericInputChange(value, "ntoage")}
                        noStyle={true}
                        className="form-control"
                        errors="Please provide a valid number."
                    />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                            isSearchable={true}
                            name={"ntoageperiod"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={true}
                            required={false}
                            isMulti={false}
                            options={toAgePeriod}
                            value={props.selectedRecord["ntoageperiod"] || ""}
                            defaultValue={props.selectedRecord["ntoageperiod"]}
                            onChange={(event) => props.onComboChange(event, "ntoageperiod", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

            </Row>

            <Row>

                <Col md="6">
                    <FormGroup>
                        <Card>
                            <Card.Header>{props.intl.formatMessage({ id: "IDS_INNERBAND" })}</Card.Header>
                            <Card.Body style={{ "padding-bottom": "0" }}>
                                <Row>
                                    <Col md="6">
                                        <FormInput
                                            name="nlowa"
                                            label={props.intl.formatMessage({ id: "IDS_LOWA" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["nlowa"] ? props.selectedRecord["nlowa"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_LOWA" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                    <Col md="6">
                                        <FormInput
                                            name="nhigha"
                                            label={props.intl.formatMessage({ id: "IDS_HIGHA" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["nhigha"] ? props.selectedRecord["nhigha"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_HIGHA" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </FormGroup>













                    <FormGroup>
                        <Card>
                            <Card.Header>{props.intl.formatMessage({ id: "IDS_LOQS" })}</Card.Header>
                            <Card.Body style={{ "padding-bottom": "0" }}>
                                <Row>
                                    <Col md="6">
                                        <FormInput
                                            name="sminloq"
                                            label={props.intl.formatMessage({ id: "IDS_MINVALUES" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["sminloq"] ? props.selectedRecord["sminloq"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_MINVALUES" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                    <Col md="6">
                                        <FormInput
                                            name="smaxloq"
                                            label={props.intl.formatMessage({ id: "IDS_MAXVALUES" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["smaxloq"] ? props.selectedRecord["smaxloq"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_MAXVALUES" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </FormGroup>


                    <FormGroup>
                        <Card>
                            <Card.Body style={{ "padding-bottom": "0" }}>
                                <FormInput
                                    name="sdisregard"
                                    label={props.intl.formatMessage({ id: "IDS_DISREGARDED" })}
                                    type="text"
                                    required={false}
                                    isMandatory={false}
                                    value={props.selectedRecord["sdisregard"] ? props.selectedRecord["sdisregard"] : ""}
                                    placeholder={props.intl.formatMessage({ id: "IDS_DISREGARDED" })}
                                    onChange={(event) => props.onInputOnChange(event, 4)}
                                    maxLength={10}

                                />
                            </Card.Body>
                        </Card>

                    </FormGroup>
                </Col>
                <Col md="6">

                    <FormGroup>
                        <Card>
                            <Card.Header>{props.intl.formatMessage({ id: "IDS_OUTERBAND" })}</Card.Header>
                            <Card.Body style={{ "padding-bottom": "0" }}>
                                <Row>
                                    <Col md="6">
                                        <FormInput
                                            name="nlowb"
                                            label={props.intl.formatMessage({ id: "IDS_LOWB" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["nlowb"] ? props.selectedRecord["nlowb"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_LOWB" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                    <Col md="6">
                                        <FormInput
                                            name="nhighb"
                                            label={props.intl.formatMessage({ id: "IDS_HIGHB" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["nhighb"] ? props.selectedRecord["nhighb"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_HIGHB" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </FormGroup>



                    <FormGroup>
                        <Card>
                            <Card.Header>{props.intl.formatMessage({ id: "IDS_LODS" })}</Card.Header>
                            <Card.Body style={{ "padding-bottom": "0" }}>
                                <Row>
                                    <Col md="6">
                                        <FormInput
                                            name="sminlod"
                                            label={props.intl.formatMessage({ id: "IDS_MINVALUES" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["sminlod"] ? props.selectedRecord["sminlod"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_MINVALUES" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                    <Col md="6">
                                        <FormInput
                                            name="smaxlod"
                                            label={props.intl.formatMessage({ id: "IDS_MAXVALUES" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["smaxlod"] ? props.selectedRecord["smaxlod"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_MAXVALUES" })}
                                            onChange={(event) => props.onInputOnChange(event, 4)}
                                            maxLength={10}

                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </FormGroup>




                    <FormGroup>
                        <Card>
                            <Card.Body style={{ "padding-bottom": "0" }}>
                                <Row>
                                    <Col md={6}>


                                        <FormInput
                                            name="sresultvalue"
                                            label={props.intl.formatMessage({ id: "IDS_DEFAULTRESULT" })}
                                            type="text"
                                            required={false}
                                            isMandatory={false}
                                            value={props.selectedRecord["sresultvalue"] ? props.selectedRecord["sresultvalue"] : ""}
                                            placeholder={props.intl.formatMessage({ id: "IDS_DEFAULTRESULT" })}
                                            onChange={(event) => props.onInputOnChange(event, 7)}
                                            maxLength={10}

                                        />

                                    </Col>

                                    <Col md="6">
                                        <FormSelectSearch
                                            formLabel={props.intl.formatMessage({ id: "IDS_GRADE" })}
                                            isSearchable={false}
                                            name={"ngradecode"}
                                            isDisabled={props.selectedRecord["sresultvalue"] === null || props.selectedRecord["sresultvalue"] === "" || props.selectedRecord["sresultvalue"] === undefined}
                                            placeholder="Please Select..."
                                            isMandatory={false}
                                            showOption={false}
                                            options={grade || []}
                                            optionId='ngradecode'
                                            optionValue='sdisplaystatus'
                                            value={props.selectedRecord ? props.selectedRecord["ngradecode"] : ""}
                                            onChange={value => props.onComboChange(value, "ngradecode", 1)}
                                            alphabeticalSort={true}
                                        //isClearable={true}
                                        >
                                        </FormSelectSearch>
                                    </Col>


                                </Row>

                            </Card.Body>
                        </Card>
                    </FormGroup>
                </Col>
            </Row>
        </Col >
    );
}

export default injectIntl(AddTestGroupNumericSpecification);