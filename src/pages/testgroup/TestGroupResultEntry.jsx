import React from 'react'
import { Row, Col, Nav, Button, Modal, Card } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ListWrapper } from '../../components/client-group.styles';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DropZone from '../../components/dropzone/dropzone.component';
import '../../components/list-master/list-master.styles';
import { attachmentType, transactionStatus } from '../../components/Enumeration';
import '../ResultEntryBySample/result.css';
import '../../assets/styles/tree.css';
import { MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';
import FormInput from '../../components/form-input/form-input.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faEye, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import TestPopOver from '../ResultEntryBySample/TestPopOver';



class TestGroupResultEntry extends React.Component {
    renderSwitch = (parameter, index, result, screenName) => {
        const selectedResultGrade = this.props.selectedResultGrade;
        const gradeValues = this.props.gradeValues;
        const gradeCode = selectedResultGrade ? selectedResultGrade.length > 0 ?
            selectedResultGrade[index] ? selectedResultGrade[index]['ngradecode'] : undefined : "" : "";
        let isAdditionalInfoRequired = parameter.hasOwnProperty('additionalInfo') &&
            parameter['additionalInfo'] !== "" && parameter['additionalInfo'] !== null ? true : false
        //  parameter.jsondata['value'] ? JSON.parse(parameter.jsondata['value']).hasOwnProperty('additionalInfo') &&
        //     JSON.parse(parameter.jsondata['value'])['additionalInfo'] !== "" ? true : false :
        //     parameter.jsondata.hasOwnProperty('additionalInfo') &&
        //         parameter.jsondata['additionalInfo'] !== "" ? true : false
        switch (parameter.nparametertypecode) {
            case 1: {
                return (
                    <>
                        <div className='row w-100'>
                            <Col md={6}>
                                <FormInput
                                    name={parameter.ntestgrouptestparametercode}
                                    type="text"
                                    required={false}
                                    isMandatory={false}
                                    value={this.props.parameterResults.length > 0 ?
                                        this.props.parameterResults[index] ? (this.props.parameterResults[index]['sresult'] !== null ? this.props.parameterResults[index]['sresult'] : "") : "" : ""}
                                    // placeholder={parameter.sparametersynonym}
                                    //label={parameter.sparametersynonym}
                                    onChange={(event) => this.props.onResultInputChange(event, index, parameter)}
                                    onBlur={() => this.props.onGradeEvent(this.props.parameterResults, index, parameter)}
                                    maxLength={9}
                                    onKeyUp={(event) => this.props.onKeyPress(event, index, this.props.paremterResultcode)}
                                />
                            </Col>
                            {parameter.ntestgrouptestformulacode > 0 ?
                                <Col md={2} className="d-flex product-category justify-content-end icon-group-wrap">
                                    <Nav.Link title="Calculate Formula" className="btn btn-circle outline-grey ml-2" role="button" id={screenName + -+index}
                                        onClick={(event) => this.props.getFormula(parameter, this.props.Login.userInfo, this.props.Login.masterData, index, event)}>
                                        <FontAwesomeIcon title="Calculate Formula" icon={faCalculator} />
                                    </Nav.Link>
                                </Col>
                                : ""}
                            {/* <Col md={4}>
                                {gradeValues[gradeCode]&&
                                 <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                 {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>}
                               
                              
                            </Col>   */}
                        </div>
                    </>
                );
            }
            case 2: {
                return (
                    <>
                        <Col md={isAdditionalInfoRequired ? 8 : 10} className="pl-0" >
                            <FormSelectSearch
                                name={parameter.ntestgrouptestparametercode}
                                as={"select"}
                                //formLabel={parameter.sparametersynonym}
                                defaultValue={{ "value": parameter.sresultpredefinedname, "label": parameter.sresultpredefinedname }}
                                //  defaultValue={parameter.sresult && (parameter.sresult!=null || parameter.sresult !== "") ?  { "value": parameter.ngradecode, "label": parameter.sresult } :
                                //  this.props.PredefinedValues ? constructOptionList(this.props.PredefinedValues[parameter.ntestgrouptestparametercode]||[],'ngradecode',
                                // 'spredefinedname' , undefined, undefined, undefined).get("DefaultValue"):""}

                                options={this.props.PredefinedValues ? this.props.PredefinedValues[parameter.ntestgrouptestparametercode] : ""}
                                optionId={"ntestgrouptestpredefcode"}
                                optionValue={"spredefinedname"}
                                isMulti={false}
                                isDisabled={false}
                                isSearchable={true}
                                isClearable={parameter.nresultmandatory === transactionStatus.YES ? false : true}
                                isMandatory={false}
                                onKeyUp={(event) => this.props.onKeyPress(event, index, this.props.paremterResultcode)}
                                onChange={(event) => this.props.onResultInputChange(event, index, parameter)}
                                onBlur={() => this.props.onGradeEvent(this.props.parameterResults, index, parameter)}
                            />
                        </Col>
                       {/* <Col md={2} className="pt-2"> 
                       {gradeValues[gradeCode]&&
                            <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>}
                         
                        </Col>  */}
                        {isAdditionalInfoRequired &&

                            <Col md={2} className="pt-2">
                                {/* <Button className="btn btn-circle outline-grey ml-2" variant="link"
                                     //   hidden={this.props.userRoleControlRights.indexOf(this.props.viewId) === -1}
                                        title={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                        data-tip={  parameter.jsondata['value'] ?
                                        JSON.parse(parameter.jsondata['value'])['additionalInfo'] :
                                        parameter.jsondata['additionalInfo']}
                                        data-for="tooltip_list_wrap"
                                         onClick={() => this.props.viewAdditionalInfo(parameter.ntestgrouptestparametercode)}
                                        >
                                        <FontAwesomeIcon icon={faEye}/>
                                     </Button>     */}
                                {/* <Modal.Title id="password" className="header-primary flex-grow-1">
                                      <FormattedMessage id='IDS_ADDITIONALINFOREQURIED' defaultMessage='Cancel' />
                                      </Modal.Title> */}

                                <TestPopOver intl={this.props.intl} needIcon={true} needPopoverTitleContent={true} placement="left" stringList={
                                    // parameter.jsondata['value'] ?
                                    //      [JSON.parse(parameter.jsondata['value'])['additionalInfo']] :
                                    //              [parameter.jsondata['additionalInfo']] 
                                    parameter.hasOwnProperty('additionalInfo') &&
                                    [parameter['additionalInfo']]} ></TestPopOver>
                                {/* <Nav.Link
                                        className="btn btn-circle outline-grey ml-2"
                                        // data-for="tooltip-common-wrap"
                                        //  data-place={action.dataplace && action.dataplace ? action.dataplace : ""}
                                         data-tip={ parameter.jsondata['value'] ?
                                         JSON.parse(parameter.jsondata['value'])['additionalInfo'] :
                                                 parameter.jsondata['additionalInfo'] }
                                        data-html={true}
                                        //   hidden={this.props.userRoleControlRights.indexOf(this.props.viewId) === -1}
                                        onClick={() => this.props.viewAdditionalInfo(parameter.ntestgrouptestparametercode)}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </Nav.Link>  */}

                            </Col>
                        }

                    </>
                );
            }
            case 3: {
                return (
                    <>
                        <Col md={10} className="pl-0">
                            <FormTextarea
                                name={parameter.ntestgrouptestparametercode}
                                //label={parameter.sparametersynonym}
                                //placeholder={parameter.sparametersynonym}
                                type="text"
                                defaultValue={parameter.sresult}
                                isMandatory={false}
                                required={false}
                                maxLength={255}
                                onChange={(event) => this.props.onResultInputChange(event, index, parameter)}
                              onBlur={() => this.props.onGradeEvent(this.props.parameterResults, index, parameter)}
                            />
                        </Col>
                        {/* <Col md={2}> 
                        {gradeValues[gradeCode]&&
                            <ListWrapper><MediaLabel className="labelfont" style={{ color: gradeValues[gradeCode][0]['scolorhexcode'] }}>
                                {gradeCode === undefined ? "" : gradeValues[gradeCode][0]['sgradename']}</MediaLabel></ListWrapper>}
                          
                        </Col>  */}
                    </>
                );
            }
            case 4: {
                return (
                    <Col md={12} className="pl-0">
                        <DropZone
                            maxFiles={1}
                            isMandatory={false}
                            //label={parameter.sparametersynonym}
                            accept=".pdf"
                            minSize={0}
                            maxSize={20}
                            multiple={false}
                            editFiles={parameter.sfinal != null ? parameter : ""}
                            attachmentTypeCode={attachmentType.FTP}
                            fileSizeName="nfilesize"
                            fileName="sfinal"
                            index={index}
                            deleteAttachment={this.props.deleteAttachmentParamFile}
                            onDrop={(event) => this.props.onResultInputChange(event, index, parameter)}
                        //disabled={disabled}
                        />
                    </Col>
                )
            }
            default:
                return ("");
        }
    }

    render() {
        return (
            <Row> 
                {this.props.parameterResults.map((parameterResult, index) => {
                    return (
                        <>
                            {/* {this.props.needSubSample && parameterResult.ssamplearno ?
                                <MediaHeader className={`labelfont`} style={{ color: "#007bff" }}>
                                    {parameterResult.ssamplearno}
                                    {parameterResult.stestsynonym ?
                                        <span className={`labelfont`}
                                            style={{ color: "#97a0af", paddingLeft: '0.2rem' }}>
                                            { }{ } {parameterResult.stestsynonym}
                                        </span>
                                        : ""}
                                </MediaHeader>
                                : parameterResult.sarno ?
                                    <MediaHeader className={`labelfont`} style={{ color: "#007bff" }}>
                                        {parameterResult.sarno}
                                        {parameterResult.stestsynonym ?
                                            <span className={`labelfont`}
                                                style={{ color: "#97a0af", paddingLeft: '0.2rem' }}>
                                                { }{ } {parameterResult.stestsynonym}
                                            </span>
                                            : ""}
                                    </MediaHeader>
                                    : ""
                            } */}

                            <Col md={12} className="pl-0 mt-2">
                                <MediaHeader className={`labelfont`} style={{ color: "#505f79" }}
                                >
                                    { }{ } {parameterResult.sparametersynonym}{ }{ }
                                    {parameterResult.nresultmandatory === transactionStatus.NO ? "(optional)" : ""}
                                </MediaHeader>
                            </Col>
                            {this.renderSwitch(parameterResult, index, parameterResult.ntestgrouptestparametercode,
                                this.props.screenName)}
                        </>
                    )
                })
                }
            </Row >
        )
    }
}

export default injectIntl(TestGroupResultEntry);