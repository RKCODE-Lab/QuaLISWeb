import React, { Component } from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row, Card, Tab, Nav, TabContent, Button } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import { Draggable, Droppable } from 'react-drag-and-drop';

class AddFormula extends Component {

    render() {
        return (
            <Row>
                <Col md="6">
                    <FormInput
                        name={"sformulaname"}
                        label={this.props.intl.formatMessage({ id: "IDS_FORMULANAME" })}
                        type="text"
                        onChange={(event) => this.props.onInputOnChange(event, 1)}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_FORMULANAME" })}
                        value={this.props.selectedRecord? this.props.selectedRecord["sformulaname"]:""}
                        isMandatory="*"
                        required={true}
                        maxLength={100}
                    />
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_TESTCATEGORY" })}
                        isSearchable={true}
                        name={"ntestcategorycode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        showOption={true}
                        options={this.props.testCategory}
                        optionId='ntestcategorycode'
                        optionValue='stestcategoryname'
                        value={this.props.selectedRecord["ntestcategorycode"]}
                        onChange={value => this.props.onComboChange(value, "ntestcategorycode", 3)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                    <FormSelectSearch
                        formLabel={this.props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                        isSearchable={true}
                        name={"ntestcode"}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        showOption={true}
                        options={this.props.testMaster}
                        optionId='ntestcode'
                        optionValue='stestname'
                        value={this.props.selectedRecord["ntestcode"]}
                        onChange={value => this.props.onComboChange(value, "ntestcode", 4)}
                        alphabeticalSort={true}
                    >
                    </FormSelectSearch>
                    <Card className="at-tabs">
                        <Tab.Container defaultActiveKey={"fieldstab"}>
                            <Card.Header className="d-flex tab-card-header">
                                <Nav as="ul" className="nav nav-tabs card-header-tabs flex-grow-1">
                                    <Nav.Item as="li">
                                        <Nav.Link eventKey="fieldstab">
                                        {this.props.intl.formatMessage({id: "IDS_FIELDNAME"})}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Nav.Link eventKey="operatorstab">
                                        {this.props.intl.formatMessage({id: "IDS_OPERATORS"})}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Nav.Link eventKey="functionstab">
                                        {this.props.intl.formatMessage({id: "IDS_FUNCTIONS"})}
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <TabContent>
                                <Tab.Pane eventKey="fieldstab">
                                    <Row noGutters={true}>
                                        <Col md="12">
                                            <Grid 
                                                resizable
                                                scrollable = "scrollable"
                                                style={{height: '350px'}}
                                                data={process(this.props.dynamicFormulaFields, { skip: 0, take: this.props.dynamicFormulaFields.length })}
                                                >
                                                
                                                <GridColumn width="36px" 
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="testfields" data={JSON.stringify(row["dataItem"])}>
                                                                <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                                            </Draggable>
                                                        </td>
                                                    )}
                                                />
                                                {/* <GridColumn field="stestname" title={this.props.intl.formatMessage({id:"IDS_TEST"})}  */}

                                                <GridColumn 
                                                    title={this.props.intl.formatMessage({id:"IDS_TEST"})}
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="testfields" data={JSON.stringify(row["dataItem"])}>
                                                            {row["dataItem"]["stestname"]}
                                                            </Draggable>
                                                        </td>
                                                    )}
                                                />
                                                    
                                                {/* <GridColumn field="sparametername" title={this.props.intl.formatMessage({id:"IDS_PARAMETER"})} 
                                                  
                                                /> */}

                                                 <GridColumn 
                                                    title={this.props.intl.formatMessage({id:"IDS_PARAMETER"})}
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="testfields" data={JSON.stringify(row["dataItem"])}>
                                                            {row["dataItem"]["sparametername"]}
                                                            </Draggable>
                                                        </td>
                                                    )}
                                                />    

                                            </Grid>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="operatorstab">
                                    <Row noGutters={true}>
                                        <Col md="12">
                                            <Grid 
                                                resizable
                                                scrollable = "scrollable"
                                                style={{height: '350px'}}
                                                data={process(this.props.operators, { skip: 0, take: this.props.operators.length })}
                                                >
                                                
                                                <GridColumn width="36px"
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="operatorfields" data={JSON.stringify(row["dataItem"])}>
                                                                <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                                            </Draggable>
                                                        </td>
                                                    )}
                                                />
                                               {/* <GridColumn field="soperator" title={this.props.intl.formatMessage({id:"IDS_OPERATORS"})}  */}

                                               <GridColumn 
                                                     title={this.props.intl.formatMessage({id:"IDS_OPERATORS"})} 
                                                     cell={(row) => (
                                                        <td>
                                                            <Draggable type="operatorfields" data={JSON.stringify(row["dataItem"])}>
                                                            {row["dataItem"]["soperator"]}
                                                            </Draggable>
                                                        </td>
                                                    )}
                                                />
                                                   
                                            
                                            </Grid>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="functionstab">
                                    <Row noGutters={true}>
                                        <Col md="12">
                                            <Grid 
                                                resizable
                                                scrollable = "scrollable"
                                                style={{height: '350px'}}
                                                data={process(this.props.functions, { skip: 0, take: this.props.functions.length })}
                                                onRowClick={this.props.getSyntax}
                                                >
                                                <GridColumn width="36px" 
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="functionfields" data={JSON.stringify(row["dataItem"])}
                                                            >
                                                                <FontAwesomeIcon icon={faGripVertical} className="dragicon"></FontAwesomeIcon>
                                                            </Draggable>
                                                        </td>
                                                       
                                                    )}
                                                />
                                                {/* <GridColumn field="sfunctionname" title={this.props.intl.formatMessage({id:"IDS_FUNCTIONS"})} 
                                                   
                                                /> */}
                                                <GridColumn 
                                                title={this.props.intl.formatMessage({id:"IDS_FUNCTIONS"})} 
                                                    cell={(row) => (
                                                        <td>
                                                            <Draggable type="functionfields" data={JSON.stringify(row["dataItem"])}
                                                            >
                                                            {row["dataItem"]["sfunctionname"]} 
                                                            </Draggable>
                                                        </td>
                                                       
                                                    )}
                                                />
                                            </Grid>                                         
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                            </TabContent>
                        </Tab.Container>
                    </Card>
                </Col>
                <Col md="6">
                    <FormInput
                        name="userinput"
                        label={ this.props.intl.formatMessage({ id:"IDS_INPUT"}) } 
                        type="text"
                        value={this.props.selectedRecord["userinput"]?this.props.selectedRecord["userinput"]:""}
                        placeholder={ this.props.intl.formatMessage({ id:"IDS_INPUT"}) } 
                        onChange = { (event) => this.props.onInputOnChange(event, 4) }
                        maxLength={10}
                        onKeyUp={ (event)=>this.props.onUserInputs(event) }
                        onFocus={this.props.onFocus}
                    />
                    <FormInput
                        name={"syntax"}
                        label={this.props.intl.formatMessage({ id: "IDS_SYNTAX" })}
                        type="text"
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SYNTAX" })}
                        value={this.props.selectedRecord["sfunctionsyntax"]?this.props.selectedRecord["sfunctionsyntax"]:""}
                        required={false}
                        isDisabled={true}
                    /> 
                    <Droppable
                        types={['testfields', 'operatorfields', 'functionfields']}
                        onDrop={(event)=>this.props.onFormulaDrop(event)}
                    >
                        <FormTextarea
                            name={"sformulacalculationdetail"}
                            label={this.props.intl.formatMessage({ id: "IDS_FORMULA" })}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_FORMULA" })}
                            value={this.props.selectedRecord["sformulacalculationdetail"]? this.props.selectedRecord["sformulacalculationdetail"]:""}
                            rows="5"
                            isMandatory="*"
                            required={true}
                            maxLength={512}
                            readOnly={true}
                        >
                        </FormTextarea>                              
                    </Droppable>
                    <div className="d-flex justify-content-end mb-3">
                        <Button className="btn-user btn-cancel" variant="" onClick={()=>this.props.clearFormula()}>
                            <FormattedMessage id='IDS_CLEAR' defaultMessage='Clear' />
                        </Button>
                        <Button className="btn-user btn-primary-blue" onClick={()=>this.props.validateFormula()}>
                            <FormattedMessage id='IDS_VALIDATEFORMULA' defaultMessage='Validate Formula' />                     
                        </Button>
                    </div>
                    <FormInput
                        name={"query"}
                        label={this.props.intl.formatMessage({ id: "IDS_VALIDATEFORMULA" })}
                        type="text"
                        placeholder={this.props.intl.formatMessage({ id: "IDS_VALIDATEFORMULA" })}
                        //ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
                        value={this.props.selectedRecord["query"]? this.props.selectedRecord["query"]:""}
                        required={false}
                        maxLength={100}
                        isDisabled={true}
                    />
                    <FormInput
                        name={"result"}
                        label={this.props.intl.formatMessage({ id: "IDS_VALIDATEDRESULT" })}
                        type="text"
                        placeholder={this.props.intl.formatMessage({ id: "IDS_VALIDATEDRESULT" })}
                        //ALPD-5543--Added by Vignesh R(07-04-2025)--Test Master-->cannot drag and drop the formula while saving and continuing in certain situations.(Check description)
                        value={this.props.selectedRecord["result"]? this.props.selectedRecord["result"]:""}
                        required={false}
                        maxLength={100}
                        isDisabled={true}
                    />
                </Col>
            </Row>
        );
    }

}

export default injectIntl(AddFormula);