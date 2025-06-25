import React from 'react';
import { Col, Row, FormGroup, Card } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
const AddSpecification = (props) => {
    return (
        <Row>
            <Col md="6">
                {/* Don't delete these commented lines because this feature is needed for Agaram LIMS */}
                {/* Start Here */}

                <FormGroup>
                    <Card>
                        <Card.Header>{props.intl.formatMessage({ id:"IDS_INNERBAND"})}</Card.Header>
                        <Card.Body style={{"padding-bottom": "0"}}>
                            <Row>
                                <Col md="6">
                                    <FormInput
                                        name="smina"
                                        label={ props.intl.formatMessage({ id:"IDS_MINA"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["smina"]?props.selectedRecord["smina"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MINA"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                                <Col md="6">
                                    <FormInput
                                        name="smaxa"
                                        label={ props.intl.formatMessage({ id:"IDS_MAXA"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["smaxa"]?props.selectedRecord["smaxa"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MAXA"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </FormGroup>
                <FormGroup>
                    <Card>
                        <Card.Header>{props.intl.formatMessage({ id:"IDS_LOQS"})}</Card.Header>
                        <Card.Body style={{"padding-bottom": "0"}}>
                            <Row>
                                <Col md="6">
                                    <FormInput
                                        name="sminloq"
                                        label={ props.intl.formatMessage({ id:"IDS_MINLOQ"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["sminloq"]?props.selectedRecord["sminloq"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MINLOQ"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                                <Col md="6">
                                    <FormInput
                                        name="smaxloq"
                                        label={ props.intl.formatMessage({ id:"IDS_MAXLOQ"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["smaxloq"]?props.selectedRecord["smaxloq"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MAXLOQ"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </FormGroup> 
               
                
                {/* End Here */}
                
                {/* Don't delete these commented lines because this feature is needed for Agaram LIMS */}
                {/* Start Here */}
                
                {/* End Here */}
          
                <FormGroup>
                    <Card body>
                        <FormInput
                            name="sdisregard"
                            label={ props.intl.formatMessage({ id:"IDS_DISREGARDED"}) } 
                            type="text"
                            required={false}
                            isMandatory={false}
                            value={props.selectedRecord["sdisregard"]?props.selectedRecord["sdisregard"]:""}
                            placeholder={ props.intl.formatMessage({ id:"IDS_DISREGARDED"}) } 
                            onChange = { (event) => props.onInputOnChange(event, 4) }
                            maxLength={10}

                        />
                    </Card>
                </FormGroup> 
            </Col>

            <Col md="6">
                {/* Don't delete these commented lines because this feature is needed for Agaram LIMS */}
                {/* Start Here */}

                <FormGroup>
                    <Card>
                        <Card.Header>{props.intl.formatMessage({ id:"IDS_OUTERBAND"})}</Card.Header>
                        <Card.Body style={{"padding-bottom": "0"}}>
                            <Row>
                                <Col md="6">
                                    <FormInput
                                        name="sminb"
                                        label={ props.intl.formatMessage({ id:"IDS_MINB"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["sminb"]?props.selectedRecord["sminb"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MINB"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                                <Col md="6">
                                    <FormInput
                                        name="smaxb"
                                        label={ props.intl.formatMessage({ id:"IDS_MAXB"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["smaxb"]?props.selectedRecord["smaxb"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MAXB"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </FormGroup>
                <FormGroup>
                    <Card>
                        <Card.Header>{props.intl.formatMessage({ id:"IDS_LODS"})}</Card.Header>
                        <Card.Body style={{"padding-bottom": "0"}}>
                            <Row>
                                <Col md="6">
                                    <FormInput
                                        name="sminlod"
                                        label={ props.intl.formatMessage({ id:"IDS_MINLOD"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["sminlod"]?props.selectedRecord["sminlod"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MINLOD"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col>
                                <Col md="6">
                                    <FormInput
                                        name="smaxlod"
                                        label={ props.intl.formatMessage({ id:"IDS_MAXLOD"}) } 
                                        type="text"
                                        required={false}
                                        isMandatory={false}
                                        value={props.selectedRecord["smaxlod"]?props.selectedRecord["smaxlod"]:""}
                                        placeholder={ props.intl.formatMessage({ id:"IDS_MAXLOD"}) } 
                                        onChange = { (event) => props.onInputOnChange(event, 4) }
                                        maxLength={10}

                                    />
                                </Col> 
                            </Row>
                        </Card.Body>
                    </Card>
                </FormGroup>
                
                {/* End Here */}
                
                {/* Don't delete these commented lines because this feature is needed for Agaram LIMS */}
                {/* Start Here */}
                
                {/* End Here */}
                <FormGroup>
                    <Card body>
                        <Row>
                            <Col md="6">
                                <FormInput
                                    name="sresultvalue"
                                    label={ props.intl.formatMessage({ id:"IDS_DEFAULTRESULT"}) } 
                                    type="text"
                                    required={false}
                                    isMandatory={false}
                                    value={props.selectedRecord["sresultvalue"]?props.selectedRecord["sresultvalue"]:""}
                                    placeholder={ props.intl.formatMessage({ id:"IDS_DEFAULTRESULT"}) } 
                                    onChange = { (event) => props.onInputOnChange(event, 7) }
                                    maxLength={10}

                                />
</Col>
                                
                                
                                <Col md="6">
               <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_GRADE" })}
                        isSearchable={false}
                        name={"ngradecode"}
                        isDisabled={props.selectedRecord.sresultvalue === null || props.selectedRecord.sresultvalue === ""||props.selectedRecord.sresultvalue===undefined}
                        placeholder="Please Select..."
                        isMandatory={false}//{props.selectedRecord["sresultvalue"] !== null && props.selectedRecord["sresultvalue"]!== ""}
                        showOption={false}
                        options={props.grade || []}
                        optionId='ngradecode'
                        optionValue='sgradename'
                        value={props.selectedRecord ? props.selectedRecord["ngradecode"] : ""}
                        onChange={value => props.onComboChange(value, "ngradecode", 1)}
                        alphabeticalSort={true}
                        //isClearable={true}
                    >
                    </FormSelectSearch>
                            </Col>
                        </Row>
                    </Card>
                </FormGroup>
            </Col>
        </Row>
     );
}

export default injectIntl(AddSpecification);