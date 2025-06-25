import { faCalculator, faSave, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Row, Button, Nav } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { MediaHeader, MediaSubHeader } from '../../components/App.styles';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormInput from '../../components/form-input/form-input.component';

const ResultEntryFormulaForm = (props) => {

    //      test(a,b){

    //    }

    return (
        <Row>
            {props.selectedRecord && props.selectedRecord.parameterData ?
                <>
                    <Col md={12}>
                        <MediaHeader className={`labelfont`} style={{ color: "#007bff" }}>
                            {props.selectedRecord ? props.selectedRecord.formulainput ? props.selectedRecord.formulainput :"" :""}
                        </MediaHeader>

                    </Col>

                    <Col md={12}>
                        {props.selectedRecord.parameterData.sarno ?
                            <MediaHeader className={`labelfont`} style={{ color: "#172b4d" }}>
                                {props.selectedRecord.parameterData.sarno}
                            </MediaHeader>
                            : ""}
                        {props.selectedRecord.parameterData.stestsynonym ?
                            <MediaHeader className={`labelfont`} style={{ color: "#505f79" }}>
                                { }{ } {props.selectedRecord.parameterData.stestsynonym} {props.selectedRecord.parameterData.sretestrepeatcount}
                            </MediaHeader>
                            : ""}
                        {props.selectedRecord.parameterData.sparametersynonym ?
                            <MediaSubHeader className={`labelfont`} style={{ color: "#97a0af" }}>
                                { }{ } {props.selectedRecord.parameterData.sparametersynonym}{ }{ }
                            </MediaSubHeader>
                            : ""}
                    </Col>

                </>
                : ""}
            {props.DynamicFields.map((fields, index) => {
               // const test = props.selectedRecord.ResultParameter.filter(x => x.ntestparametercode === fields.ndynamicformulafieldcode)

                return (
                    <>
                        <Col md="8" className="mt-4" key={index}>
                            <FormInput
                                name={`dynamicformulafield_${index}`}
                                label={fields.sdynamicfieldname}
                                type="text"
                                required={true}
                                isMandatory={true}
                                value={props.selectedRecord.selectedForumulaInput && props.selectedRecord.selectedForumulaInput.length > 0 ?
                                    props.selectedRecord.selectedForumulaInput[index] ? props.selectedRecord.selectedForumulaInput[index].svalues : "" : ""}
                                //value={test.length > 0 ?
                                //     test[0].sresult : "" }
                                //value={props.selectedRecord["formulainput"] ? props.selectedRecord["formulainput"][`dynamicformulafield_${index}`] : ""}
                                placeholder={fields.sdynamicfieldname}
                                onChange={(event) => props.onFormulaInputChange(event, index, fields)}
                                maxLength={9}
                            />
                        </Col>
                        {
                            fields.nisaverageneed > 1 ?
                                <Col md={2}>
                                    {/* average_button_style d-flex product-category justify-content-end icon-group-wrap */}
                                    {/* <Button className="btn-user btn-primary-blue average_button_style" 
                         onClick={() => props.getAverageResult(fields,index,props.selectedRecord.selectedForumulaInput,props.masterData,props.selectedRecord)}
                         >
                            <FormattedMessage id='IDS_AVERAGE' defaultMessage='Average' />
                        </Button> */}
                                    <CustomSwitch
                                        label={"Average"}
                                        type="switch"
                                        name={`dynamicaveragefield_${index}`}
                                        onChange={(event) => props.getAverageResult(event, fields, index, props.selectedRecord.selectedForumulaInput, props.masterData, props.selectedRecord)}
                                        defaultValue={props.selectedRecord ? props.selectedRecord.selectedForumulaInput ? props.selectedRecord.selectedForumulaInput.senableAverage : false : false}
                                        isMandatory={false}
                                        required={true}
                                        checked={props.selectedRecord ? props.selectedRecord.selectedForumulaInput ? props.selectedRecord.selectedForumulaInput.senableAverage : false : false}
                                    />

                                </Col>
                                : ""
                        }
                        {/* // </Col> */}
                    </>

                )
            }
            )
            }
        </Row >
    )
}


export default ResultEntryFormulaForm;