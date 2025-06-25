import { faAddressBook, faChevronRight, faComment, faCommentMedical, faComments, faCommentsDollar, faEye, faFlag, faGripVertical, faPlay, faPlus, faRecycle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Form, ListGroup, Media, Nav, Row } from 'react-bootstrap';
import { process } from '@progress/kendo-data-query';
import CustomAccordion from '../../components/custom-accordion/custom-accordion.component';
import { AtTableWrap, FormControlStatic, FontIconWrap } from '../../components/data-grid/data-grid.styles';
import { ListWrapper } from '../../components/client-group.styles';

import { FormattedMessage, injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { BuilderBorder, ContionalButton, DeleteRule } from '../configurationmaster/RuleEngineSqlbuilder.styled';
import '../../assets/styles/querybuilder.css';

import CustomTabs from '../../components/custom-tabs/custom-tabs.component';

import { ColumnType, parameterType, transactionStatus } from '../../components/Enumeration';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { stringOperatorData, conditionalOperatorData, numericOperatorData, joinConditionData, aggregateFunction, orderByList } from '../configurationmaster/RuleEngineQueryBuilderData';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormCheckbox from '../../components/form-checkbox/form-checkbox.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import SplitterLayout from 'react-splitter-layout';
import ModalShow from '../../components/ModalShow';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { sortData } from '../../components/CommonScript';
import TestGroupResultEntry from './TestGroupResultEntry';
import { ProductList } from '../product/product.styled';
import { ContactHeader, HeaderText } from '../testmanagement/testmaster-styled';
import { ClientList } from '../userroletemplate/userroletemplate.styles';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import TestPopOver from '../ResultEntryBySample/TestPopOver';
import { MediaLabel } from '../../components/App.styles';


const AddTestGroupRule = (props) => {
    const fieldsForGrid = props.activeTabIndex == 1 ? [
        { "idsName": "IDS_TOSITE", "dataField": "stositename", "width": "200px" },
        { "idsName": "IDS_FROMSITE", "dataField": "sfromsitename", "width": "200px" }

    ] : props.activeTabIndex == 2 ? [
        { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px" },
        { "idsName": "IDS_RESULTS", "dataField": "spredefinedname", "width": "200px" },
        { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "scommentsubtype", "width": "200px" },
        { "idsName": "IDS_COMMENTTYPE", "dataField": "scommenttype", "width": "200px" }

    ] : props.activeTabIndex == 3 ? [
        { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
        { "idsName": "IDS_REPEATCOUNT", "dataField": "nrepeatcountno", "width": "200px" }
    ] : props.activeTabIndex == 4 ? [
        { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "200px" },
        { "idsName": "IDS_OPTIONALPARAMETERS", "dataField": "sparametersynonym", "width": "200px" },
        { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "200px" },
        { "idsName": "IDS_RESULTS", "dataField": "senforceresult", "width": "200px" }
    ] : "";
    const customStyle = {
        'padding-top': '8px',
        'padding-left': '2px',
        'padding-right': '50px'
    }
    function createRules(items, groupIndex) {
        let design = [];
        console.log('props.selectedRecord->>', props.selectedRecord)
        props.selectedRecord && [...Array(items)].map((data, index) => {
            let stringOperators = stringOperatorData;
            design.push(
                <>
                    {index > 0 ? props.selectedRecord["groupList"][groupIndex]['button_or'] === true ?
                        <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
                        >
                            <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                        </ContionalButton> :
                        props.selectedRecord["groupList"][groupIndex]['button_and'] === true ?
                            <ContionalButton type="button" className={"builder-btn-primary"} marginLeft={0}
                            >
                                <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                            </ContionalButton> : "" : ""}
                    <Row className="my-3 ml-1">
                        <FontIconWrap className="d-font-icon action-icons-wrap" style={customStyle} data-tip={props.intl.formatMessage({ id: "IDS_DELETE" })}
                            onClick={() => props.deleteRule(groupIndex, index)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </FontIconWrap>
                        {/* <DeleteRule marginLeft={1} onClick={() => props.deleteRule(groupIndex, index)}>
                            <FontAwesomeIcon icon={faTrashAlt}  className="d-font-icon action-icons-wrap" />
                        </DeleteRule>  */}
                        <Col md={4} className="pl-0"  >
                            <FormSelectSearch
                                formGroupClassName="remove-floating-label-margin"
                                isSearchable={true}
                                name={"stestname"}
                                showOption={true}
                                options={props.rulesOption || []}
                                optionId='stestname'
                                optionValue='displayname'
                                value={props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["stestname"] || ""}
                                onChange={value => props.onRuleChange(value, "stestname", groupIndex, index)}
                            ></FormSelectSearch>
                        </Col>


                        {
                            props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["stestname"] &&
                            <>
                                {/* <Col md={1}>
                                    <FormInput
                                        formGroupClassName="remove-floating-label-margin"
                                        name={`sinputname`}
                                        type="text"
                                        value={props.intl.formatMessage({ id: "IDS_WITH" })}
                                        disabled={true}
                                    />
                                </Col> */}
                                <Col md={2}>
                                    <FormSelectSearch
                                        formGroupClassName="remove-floating-label-margin"
                                        formLabel=""
                                        isSearchable={true}
                                        name={"orderresulttype"}
                                        placeholder=""
                                        showOption={true}
                                        options={props.resultTypeList}
                                        optionId='nresultypecode'
                                        optionValue='orderresulttype'
                                        value={props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] || ""}
                                        onChange={value => props.onMasterDataChange(value, "orderresulttype", groupIndex, index)}
                                    >
                                    </FormSelectSearch>
                                </Col>
                                <Col md={2}>
                                    <FormSelectSearch
                                        formGroupClassName="remove-floating-label-margin"
                                        formLabel=""
                                        isSearchable={true}
                                        name={"ssymbolname"}
                                        placeholder=""
                                        showOption={true}
                                        options={
                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 3 &&
                                                props.selectedRecord["groupList"][groupIndex][index]["stestname"] &&
                                                props.selectedRecord["groupList"][groupIndex][index]["stestname"]['item']
                                                ['nparametertypecode'] === parameterType.NUMERIC ?
                                                numericOperatorData : stringOperators}
                                        optionId='nvalidationcode'
                                        optionValue='ssymbolname'
                                        value={props.selectedRecord["groupList"][groupIndex][index] && props.selectedRecord["groupList"][groupIndex][index]["ssymbolname"] || ""}
                                        onChange={value => props.onSymbolChange(value, "ssymbolname", groupIndex, index)}
                                    >
                                    </FormSelectSearch>
                                </Col>
                                {/* {props.selectedRecord["groupList"][groupIndex][index] ?
                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] && props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 3 ?
                                        props.selectedRecord["groupList"][groupIndex][index]["stestname"]['item']['nparametertypecode'] === parameterType.PREDEFINED ?
                                            <Col md={2}>
                                                <FormSelectSearch
                                                    formGroupClassName="remove-floating-label-margin"
                                                    isSearchable={true}
                                                    name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                                    showOption={true}
                                                    options={props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ?
                                                        props.DiagnosticCaseList : props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? props.GradeList
                                                            : props.PredefinedParameterOptions}

                                                    optionId={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}
                                                    optionValue={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.displaymember}

                                                    value={props.selectedRecord["groupList"][groupIndex][index] &&
                                                        props.selectedRecord["groupList"][groupIndex][index]
                                                        [props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' :
                                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? 'ngradecode' : 'ntestgrouptestpredefcode'] || ""}
                                                    onChange={value => props.onMasterDataChange(value,
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 1 ? 'ndiagnosticcasecode' :
                                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? 'ngradecode' : 'ntestgrouptestpredefcode'
                                                        , groupIndex, index)}
                                                ></FormSelectSearch>
                                            </Col> : props.selectedRecord["groupList"][groupIndex][index] &&
                                                props.selectedRecord["groupList"][groupIndex][index]["stestname"]['item']['nparametertypecode'] === parameterType.CHARACTER ?
                                                <Col md={2}>
                                                    <FormTextarea
                                                        name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                                        placeholder={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                        value={props.selectedRecord ? props.selectedRecord["senforceresult"] : ""}
                                                        rows="2"
                                                        isMandatory={false}
                                                        required={false}
                                                        maxLength={255}
                                                        onChange={(event) => props.onRuleInputChange(event, 'ntestgrouptestcharcode', groupIndex, index)}
                                                    />
                                                </Col> :
                                                <Col md={2}>
                                                    <FormNumericInput
                                                        name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}

                                                        placeholder={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                        value={props.selectedRecord ? props.selectedRecord["senforceresult"] : ""}
                                                        type="number"
                                                        strict={true}
                                                        maxLength={10}
                                                        noStyle={true}
                                                        onChange={(event) => props.onRuleNumericInputOnChange(event, 'ntestgrouptestnumericcode', groupIndex, index)}
                                                        precision={0}
                                                        min={0}
                                                        className="form-control"
                                                        isMandatory={false}
                                                        required={false}
                                                    />
                                                </Col> :
                                        //asusual
                                        <Col md={2}>
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                isSearchable={true}
                                                name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                                showOption={true}
                                                options={props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ?
                                                    props.DiagnosticCaseList : props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? props.GradeList
                                                        : props.PredefinedParameterOptions}

                                                optionId={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}
                                                optionValue={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.displaymember}

                                                value={props.selectedRecord["groupList"][groupIndex][index] &&
                                                    props.selectedRecord["groupList"][groupIndex][index]
                                                    [props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' :
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? 'ngradecode' : 'ntestgrouptestpredefcode'] || ""}
                                                onChange={value => props.onMasterDataChange(value,
                                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 1 ? 'ndiagnosticcasecode' :
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? 'ngradecode' : 'ntestgrouptestpredefcode'
                                                    , groupIndex, index)}
                                            ></FormSelectSearch>
                                        </Col> : ""
                                } */}


                                {props.selectedRecord["groupList"][groupIndex][index] ?
                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 3 &&
                                        props.selectedRecord["groupList"][groupIndex][index]["stestname"]['item']['nparametertypecode'] === parameterType.PREDEFINED ?
                                        <Col md={2}>
                                            <FormSelectSearch
                                                formGroupClassName="remove-floating-label-margin"
                                                isSearchable={true}
                                                name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                                showOption={true}
                                                options={props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ?
                                                    props.DiagnosticCaseList : props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? props.GradeList
                                                        : props.PredefinedParameterOptions &&
                                                        props.PredefinedParameterOptions.length > 0 && props.PredefinedParameterOptions[groupIndex] &&
                                                        props.PredefinedParameterOptions[groupIndex].length > 0 &&
                                                        props.PredefinedParameterOptions[groupIndex][index]}

                                                optionId={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}
                                                optionValue={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.displaymember}

                                                value={props.selectedRecord["groupList"][groupIndex][index] &&
                                                    props.selectedRecord["groupList"][groupIndex][index]
                                                    [props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' :
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? 'ngradecode' : 'ntestgrouptestpredefcode'] || ""}
                                                onChange={value => props.onMasterDataChange(value,
                                                    props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 1 ? 'ndiagnosticcasecode' :
                                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 2 ? 'ngradecode' : 'ntestgrouptestpredefcode'
                                                    , groupIndex, index)}
                                            ></FormSelectSearch>
                                        </Col> :
                                        props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 3 &&
                                            props.selectedRecord["groupList"][groupIndex][index]["stestname"]['item']['nparametertypecode'] === parameterType.CHARACTER ?
                                            <Col md={2}>
                                                <FormTextarea
                                                    name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                                    placeholder={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                    value={props.selectedRecord["groupList"][groupIndex][index] ? props.selectedRecord["groupList"][groupIndex][index]["ntestgrouptestcharcode"] : ""}
                                                    rows="2"
                                                    isMandatory={false}
                                                    required={false}
                                                    maxLength={255}
                                                    onChange={(event) => props.onRuleInputChange(event, 'ntestgrouptestcharcode', groupIndex, index)}
                                                />
                                            </Col> :
                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 3 &&
                                                props.selectedRecord["groupList"][groupIndex][index]["stestname"]['item']['nparametertypecode'] === parameterType.NUMERIC ?
                                                <Col md={2}>
                                                    <FormNumericInput
                                                        name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}

                                                        placeholder={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                        value={props.selectedRecord["groupList"][groupIndex][index] ? props.selectedRecord["groupList"][groupIndex][index]["ntestgrouptestnumericcode"] : ""}
                                                        type="text"
                                                        strict={true}
                                                        maxLength={10}
                                                        noStyle={true}
                                                        onChange={(event) => props.onRuleNumericInputOnChange(event, 'ntestgrouptestnumericcode', groupIndex, index)}
                                                        precision={2}
                                                        min={0}
                                                        className="form-control"
                                                        isMandatory={false}
                                                        required={false}
                                                    />
                                                </Col> :
                                                <Col md={2}>
                                                    <FormSelectSearch
                                                        formGroupClassName="remove-floating-label-margin"
                                                        isSearchable={true}
                                                        name={`${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`}
                                                        showOption={true}
                                                        options={props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ?
                                                            props.DiagnosticCaseList : props.GradeList}

                                                        optionId={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}
                                                        optionValue={props.selectedRecord["groupList"][groupIndex][index]["stestname"].items && props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.displaymember}

                                                        value={props.selectedRecord["groupList"][groupIndex][index] &&
                                                            props.selectedRecord["groupList"][groupIndex][index]
                                                            [props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                                props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value == 1 ? 'ndiagnosticcasecode' : 'ngradecode'] || ""}
                                                        onChange={value => props.onMasterDataChange(value,
                                                            props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"] &&
                                                                props.selectedRecord["groupList"][groupIndex][index]["orderresulttype"].value === 1 ? 'ndiagnosticcasecode' : 'ngradecode'// `${props.selectedRecord["groupList"][groupIndex][index]["stestname"].items.valuemember}`
                                                            , groupIndex, index)}
                                                    ></FormSelectSearch>
                                                </Col> : ""
                                }


                            </>
                        }
                    </Row>
                </>
            )
        });
        return design;
    }

    function onKeyPress(event, index, paremterResultcode) {
        if (event.keyCode === 13) {
            for (let i = 0; i < event.target.form.elements.length; i++) {
                if (parseInt(event.target.form.elements[i].id) === paremterResultcode[index + 1]) {
                    event.target.form.elements[i].focus();
                    break;
                }
            }
            event.preventDefault();
        }
    }
    function createGroupRules() {
        console.log('props.addGroupList->', props)
        let indexCount = 0;
        let design = [];
        console.log('props.addGroupList->', props.addGroupList)
        props.selectedRecord["groupList"] && props.addGroupList.length > 0 && props.addGroupList.map((items, index) => {

            let stringOperators = stringOperatorData;
            if (props.selectedRecord["groupList"] && props.selectedRecord["groupList"][index]["stestname"]
                && !props.selectedRecord["groupList"][index]["stestname"].items.needmasterdata
                && props.selectedRecord["groupList"][index]["stestname"].items.columntype === ColumnType.TEXTINPUT) {
                const temp = stringOperators.filter(item => {
                    if (item.items.symbolType !== 6) {
                        return item
                    }
                });
                stringOperators = temp;
            }

            if (items > -1) {
                indexCount = indexCount + 1;
            };
            design.push(
                <>{index > 0 && <Row>
                    <ContionalButton type="button" className={props.selectedRecord["groupListJoins"] &&
                        props.selectedRecord["groupListJoins"][index - 1] && props.selectedRecord["groupListJoins"][index - 1]["button_and"] === true ? "builder-btn-primary" : ""} marginLeft={1}
                        onClick={() => props.onConditionClick("button_and", (index - 1), true)}>
                        <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                    </ContionalButton>
                    <ContionalButton type="button" className={props.selectedRecord["groupListJoins"] &&
                        props.selectedRecord["groupListJoins"][index - 1] && props.selectedRecord["groupListJoins"][index - 1]["button_or"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                        onClick={() => props.onConditionClick("button_or", (index - 1), true)}>
                        <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                    </ContionalButton>
                    <ContionalButton type="button" className={props.selectedRecord["groupListJoins"] &&
                        props.selectedRecord["groupListJoins"][index - 1] && props.selectedRecord["groupListJoins"][index - 1]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                        onClick={() => props.onConditionClick("button_not", (index - 1), true)}>
                        <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                    </ContionalButton>
                </Row>}
                    {items > -1 ?
                        <>
                            <BuilderBorder key={index} className="p-3 mb-1">
                                <Row >

                                    <Col md={12} >
                                        <Button onClick={() => props.addRule("views", index)} className="mr-1 rulesengine-rule-btn">
                                            {'+'} <FormattedMessage id="IDS_RULE" defaultMessage="Rule" />
                                        </Button>
                                        {items > 1 ?
                                            <Row className="rulesengine-condition-btn ">
                                                <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_and"] === true ? "builder-btn-primary" : ""} marginLeft={1}
                                                    onClick={() => props.onConditionClick("button_and", index, false)}>
                                                    <span><FormattedMessage id="IDS_AND" defaultMessage="And" /></span>
                                                </ContionalButton>
                                                <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_or"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                                    onClick={() => props.onConditionClick("button_or", index, false)}>
                                                    <span><FormattedMessage id="IDS_OR" defaultMessage="Or" /></span>
                                                </ContionalButton>
                                                <ContionalButton type="button" className={props.selectedRecord["groupList"][index]["button_not"] === true ? "builder-btn-primary" : ""} marginLeft={0}
                                                    onClick={() => props.onConditionClick("button_not", index, false)}>
                                                    <span><FormattedMessage id="IDS_NOT" defaultMessage="NOT" /></span>
                                                </ContionalButton>
                                            </Row>

                                            :
                                            <>
                                                <Row >
                                                    <br >
                                                    </br>
                                                </Row>
                                            </>
                                        }
                                    </Col>

                                </Row>
                                <>
                                    {createRules(items, index)}
                                </>

                            </BuilderBorder>

                        </> : <></>
                    }


                </>)
        });

        return design;
    }


    function testParameterAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameter) =>
            accordionMap.set(testParameter.npkAtestparametercode,
                <Col className='p-0' testParameter={testParameter}>

                    <Row>
                        <Col md="12">
                            <div className='d-flex align-items-center mb-2'>
                                    {testParameter.ParameterRulesEngine&&testParameter.ParameterRulesEngine.length>0&& <h4 className='inner_h4'> {props.intl.formatMessage({ id: "IDS_RESULTS" })}</h4>}
                                    {/* <Nav.Item className="add-txt-btn" name="addcodedresultname"
                                        onClick={() => props.addParameter()}
                                    >
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>{" "}
                                        <FormattedMessage id="IDS_PARAMETERS" defaultMessage="Parameters" />
                                    </Nav.Item> */}
                                    <Nav.Item>
                                    <Col md={12}>
                                                        <CustomSwitch
                                                            label={props.intl.formatMessage({ id: "IDS_NEEDSAMPLE" })}
                                                            type="switch"
                                                            name={"nneedsample"}
                                                            onChange={(event) => props.onInputSwitchChange(event)}
                                                            placeholder={props.intl.formatMessage({ id: "IDS_NEEDSAMPLE" })}
                                                            defaultValue={ props.masterData.selectedParameterRulesEngine && props.masterData.selectedParameterRulesEngine.nneedsample === 3 ? true : false }    //  ALPD-5797   Added validation by Vishakh blank issue
                                                            isMandatory={false}
                                                            required={false}
                                                            checked={props.masterData.selectedParameterRulesEngine && props.masterData.selectedParameterRulesEngine.nneedsample  === 3 ? true : false}  //  ALPD-5797   Added validation by Vishakh blank issue
                                                        //  disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                                                        >
                                                        </CustomSwitch>
                                                    </Col>

                                    </Nav.Item>
                                    <Nav.Link
                                        data-tip={props.intl.formatMessage({ id: "IDS_ENTERRESULT" })}
                                        className="btn btn-circle outline-grey ml-auto" role="button"
                                        onClick={() => props.addParameter()}>
                                        <FontAwesomeIcon icon={faAddressBook} />
                                    </Nav.Link>
                                    </div>
                                    <ListGroup as="ul">
                                        {testParameter.ParameterRulesEngine &&
                                            sortData(testParameter.ParameterRulesEngine, 'descending', 'slNo').map((parameter, predefindex) => {
                                                let isAdditionalInfoRequired = parameter.hasOwnProperty('additionalInfo') &&
                                                    parameter['additionalInfo'] !== "" && parameter['additionalInfo'] !== null
                                                    && parameter['additionalInfo'] !== undefined ? true : false
                                                return (<>
                                                        <ListGroup.Item key={predefindex} as="li" className='rulesengine-parameter-list' >
                                                            <Media>
                                                                <Media.Body>
                                                                    <ContactHeader className="mt-0 text-break">{//props.intl.formatMessage({ id: "IDS_PARAMETERNAME" }) + ' : ' +
                                                                     parameter.sparametersynonym}</ContactHeader>
                                                                    <ProductList className='text-break'>{props.intl.formatMessage({ id: "IDS_RESULTS" })  + ' : ' + parameter.sfinal}</ProductList>
                                                                    {/* <ProductList>{'grade' + ' : ' + parameter.sgradename}</ProductList> */}
                                                                    {/* {props.gradeValues[parameter.ngradecode] &&
                                                                        <ListWrapper>{props.intl.formatMessage({ id: "IDS_RESULTFLAG" })} : <MediaLabel className="labelfont" style={{ color: props.gradeValues[parameter.ngradecode][0]['scolorhexcode'] }}>
                                                                            {parameter.ngradecode === undefined ? "" : props.gradeValues[parameter.ngradecode][0]['sgradename']}</MediaLabel></ListWrapper>

                                                                    } */}

                                                                </Media.Body>
                                                                <div>
                                                                    <div className='d-flex  justify-content-end mr-1'>
                                                                        <ClientList className="action-icons-wrap">
                                                                            <FontIconWrap className="d-font-icon action-icons-wrap" testParameter={testParameter}
                                                                                data-tip={props.intl && props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            ><a onClick={() => props.deletetestparameter(parameter)} class="float-right mr-3">
                                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                                </a></FontIconWrap> 
                                                                        </ClientList>
                                                                       
                                                                    </div>
                                                                    {isAdditionalInfoRequired &&
                                                                            <Col md={2} className="pt-2">
                                                                                <TestPopOver intl={props.intl} needIcon={true} needPopoverTitleContent={true} placement="left" stringList={
                                                                                    parameter.hasOwnProperty('additionalInfo') &&
                                                                                    [parameter['additionalInfo']]} ></TestPopOver>
                                                                            </Col>}
                                                                </div>
                                                            </Media>
                                                        </ListGroup.Item>
                                                   
                                                    {/* {isAdditionalInfoRequired &&
                                                        <Col md={2} className="pt-2">
                                                            <TestPopOver intl={props.intl} needIcon={true} needPopoverTitleContent={true} placement="left" stringList={
                                                                parameter.hasOwnProperty('additionalInfo') &&
                                                                [parameter['additionalInfo']]} ></TestPopOver>
                                                        </Col>}  */}
                                               

                                                </>
                                                )
                                            })
                                        }

                                    </ListGroup>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col md={12} className="d-flex justify-content-end pr-0">
                            <Nav.Link name="addtestparameter" className="add-txt-btn pr-0" testParameter={testParameter}
                                onClick={() => props.addModalSite()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameter={testParameter} /> { }
                                <FormattedMessage id="IDS_OUTSOURCE" defaultMessage="Add Site" testParameter={testParameter} />
                            </Nav.Link>
                        </Col>
                    </Row> */}
                    {/* {
                        <>

                            <DataGrid
                                key="testsectionkey"
                                primaryKeyField="nresultusedmaterialcode"
                                dataResult={props.masterData["testSite"] && process(sortData(props.masterData["testSite"][testParameter.npkAtestparametercode], 'descending', 'npksitecode') || [],
                                    props.dataStateObject && props.dataStateObject[testParameter.npkAtestparametercode]
                                        ? props.dataStateObject[testParameter.npkAtestparametercode] : { skip: 0, take: 10 })}
                                dataState={props.dataStateObject && props.dataStateObject[testParameter.npkAtestparametercode]
                                    ? props.dataStateObject[testParameter.npkAtestparametercode] : { skip: 0, take: 10 }}
                                dataStateChange={(event) => { props.dataStateChange(event, testParameter.npkAtestparametercode) }}

                                extractedColumnList={fieldsForGrid}
                                controlMap={props.controlMap}
                                userRoleControlRights={props.userRoleControlRights}
                                pageable={true}
                                isActionRequired={true}
                                scrollable={'scrollable'}
                                hideColumnFilter={true}
                                selectedId={0}
                                testParameter={testParameter}
                                deleteRecord={props.deletModalSite}
                                deleteParam={{ operation: "delete" }}
                                actionIcons={[{
                                    title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                    controlname: "faTrashAlt",
                                    hidden: false,
                                    objectName: "delete",
                                    onClick: props.deletModalSite

                                }]}
                            >
                            </DataGrid></>
                        // : ""
                    } */}
                </Col>
            )
        );

        return accordionMap;
    }
    function testCommentsAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameterComments) =>
            accordionMap.set(testParameterComments.npkBtestparametercode,
                <Col md="12" testParameterComments={testParameterComments}>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end pr-0">
                            <Nav.Link name="addtestparameter" className="add-txt-btn" testParameterComments={testParameterComments}
                                onClick={() => props.addComments()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameterComments={testParameterComments} /> { }
                                <FormattedMessage id="IDS_COMMENTS" defaultMessage="Add Test Comments" testParameterComments={testParameterComments} />
                            </Nav.Link>
                        </Col>
                    </Row>
                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nresultusedmaterialcode"
                        dataResult={props.masterData["testComments"] && process(sortData(props.masterData["testComments"][testParameterComments.npkBtestparametercode], 'descending', 'npKAsampletestcommentscode') || [],
                            props.dataStateObject && props.dataStateObject[testParameterComments.npkBtestparametercode]
                                ? props.dataStateObject[testParameterComments.npkBtestparametercode] : { skip: 0, take: 10 })}
                        dataState={props.dataStateObject && props.dataStateObject[testParameterComments.npkBtestparametercode]
                            ? props.dataStateObject[testParameterComments.npkBtestparametercode] : { skip: 0, take: 10 }}
                        dataStateChange={(event) => { props.dataStateChange(event, testParameterComments.npkBtestparametercode) }}

                        extractedColumnList={fieldsForGrid}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        pageable={true}
                        isActionRequired={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={true}
                        selectedId={0}
                        testParameterComments={testParameterComments}
                        deleteRecord={props.deletModalSite}
                        deleteParam={{ operation: "delete" }}
                        actionIcons={[{
                            title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                            controlname: "faTrashAlt",
                            hidden: false,
                            objectName: "delete",
                            onClick: props.deletModalSite

                        }]}
                    >
                    </DataGrid>
                </Col>
            )
        );

        return accordionMap;
    }
    function reportCommentsAccordion(TestParameter) {
        const accordionMap = new Map();
        TestParameter.map((testParameterreportComments) =>
            accordionMap.set(testParameterreportComments.ntestgrouptestparametercode,
                <Col md="12" testParameterreportComments={testParameterreportComments}>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end">
                            <Nav.Link name="deletetestparameter" className="add-txt-btn" testParameterreportComments={testParameterreportComments}
                                onClick={() => props.deleteModalTest()}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} testParameterreportComments={testParameterreportComments} /> { }
                                <FormattedMessage id="IDS_DELETE" defaultMessage="Delete" testParameterreportComments={testParameterreportComments} />
                            </Nav.Link>
                        </Col>
                    </Row>
                    <div className="actions-stripe" testParameterreportComments={testParameterreportComments}>
                        <div className="d-flex justify-content-end" testParameterreportComments={testParameterreportComments}>
                            <Nav.Link name="addtestparameter" className="add-txt-btn" testParameterreportComments={testParameterreportComments}
                                onClick={() => props.addComments()}
                            >
                                <FontAwesomeIcon icon={faPlus} testParameterreportComments={testParameterreportComments} /> { }
                                <FormattedMessage id="IDS_ADDREPORTCOMMENTS" defaultMessage="Add Report Comments" testParameterreportComments={testParameterreportComments} />
                            </Nav.Link>
                        </div>
                    </div>

                    <DataGrid
                        key="testsectionkey"
                        primaryKeyField="nresultusedmaterialcode"
                        dataResult={props.masterData["reportComments"] && process(props.masterData["reportComments"][testParameterreportComments.ntestgrouptestparametercode] || [],
                            props.dataState
                                ? props.dataState : { skip: 0, take: 10 })}
                        dataState={props.dataState
                            ? props.dataState : { skip: 0, take: 10 }}
                        dataStateChange={props.dataStateChange}

                        extractedColumnList={fieldsForGrid}
                        controlMap={props.controlMap}
                        userRoleControlRights={props.userRoleControlRights}
                        pageable={true}
                        isActionRequired={true}
                        scrollable={'scrollable'}
                        hideColumnFilter={true}
                        selectedId={0}
                        testParameterComments={testParameterreportComments}
                        deleteRecord={props.deletModalSite}
                        deleteParam={{ operation: "delete" }}
                        actionIcons={[{
                            title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                            controlname: "faTrashAlt",
                            hidden: false,
                            objectName: "delete",
                            onClick: props.deletModalSite

                        }]}
                    >
                    </DataGrid>
                </Col>
            )
        );

        return accordionMap;
    }
    function TabDetails() {
        const resultTabMap = new Map();
        if (props.addOutcomeList.length === 0) {
            props.activeTabIndex == 1 ?
                resultTabMap.set("IDS_Test",
                    <>
                        <div className="actions-stripe">
                            <div className="d-flex justify-content-end">
                                <Nav.Link name="addtestparameter"
                                    onClick={() => props.addTest("IDS_Test")}>
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                </Nav.Link>
                            </div>
                        </div>
                        {props.masterData.testParameter && props.masterData.testParameter.length > 0 &&
                            <CustomAccordion
                                key="parameteraccordion"
                                clickIconGroup={true}
                                deleteAccordion={props.deleteModalTest}
                                accordionTitle={"stestsynonym"}
                                accordionComponent={testParameterAccordion(props.masterData.testParameter)}
                                inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                                accordionClick={props.getOutcomeDetails}
                                accordionPrimaryKey={"npkAtestparametercode"}
                                accordionObjectName={"testParameter"}
                                selectedKey={props.masterData.selectedParameterRulesEngine ? props.masterData.selectedParameterRulesEngine.npkAtestparametercode : 0}
                            />
                        }
                    </>
                ) : props.activeTabIndex == 2 ?
                    resultTabMap.set("IDS_COMMENTS",
                        <>
                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    <Nav.Link name="addtestparameter"
                                        onClick={() => props.addTest("IDS_COMMENTS")}>
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                    </Nav.Link>
                                </div>
                            </div>
                            {props.masterData.testParameterComments && props.masterData.testParameterComments.length > 0 &&
                                <CustomAccordion
                                    key="parameteraccordion"
                                    clickIconGroup={true}
                                    deleteAccordion={props.deleteModalTest}
                                    accordionTitle={"stestsynonym"}
                                    accordionComponent={testCommentsAccordion(props.masterData.testParameterComments)}
                                    inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                                    accordionClick={props.getOutcomeDetails}
                                    accordionPrimaryKey={"npkBtestparametercode"}
                                    accordionObjectName={"testParameterComments"}
                                    selectedKey={props.masterData.selectedParameterRulesEngine ? props.masterData.selectedParameterRulesEngine.npkBtestparametercode : 0}
                                />
                            }
                        </>
                    ) : props.activeTabIndex == 3 ?
                        resultTabMap.set("IDS_REPEAT",
                            <>
                                <div className="actions-stripe">
                                    <div className="d-flex justify-content-end">
                                        <Nav.Link name="addtestparameter"
                                            onClick={() => props.addTest("IDS_REPEAT")}>
                                            <FontAwesomeIcon icon={faPlus} /> { }
                                            <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                        </Nav.Link>
                                    </div>
                                </div>
                                {props.masterData.testRepeat && props.masterData.testRepeat.length > 0 &&
                                    <DataGrid
                                        key="testsectionkey"
                                        primaryKeyField="nresultusedmaterialcode"
                                        dataResult={props.masterData["testRepeat"] && process(sortData(props.masterData["testRepeat"], 'descending', 'npkCtestparametercode') || [],
                                            props.dataStatetestRepeat
                                                ? props.dataStatetestRepeat : { skip: 0, take: 10 })}
                                        dataState={props.dataStatetestRepeat
                                            ? props.dataStatetestRepeat : { skip: 0, take: 10 }}
                                        dataStateChange={(event) => { props.dataStateChangetestRepeat(event) }}
                                        extractedColumnList={fieldsForGrid}
                                        controlMap={props.controlMap}
                                        userRoleControlRights={props.userRoleControlRights}
                                        pageable={true}
                                        isActionRequired={true}
                                        scrollable={'scrollable'}
                                        hideColumnFilter={true}
                                        selectedId={0}
                                        testRepeat={props.masterData.testRepeat}
                                        deleteRecord={props.deleteModalTest}
                                        deleteParam={{ operation: "delete" }}
                                        actionIcons={[{
                                            title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                            controlname: "faTrashAlt",
                                            hidden: false,
                                            objectName: "delete",
                                            onClick: props.deleteModalTest
                                        }]}
                                    >
                                    </DataGrid>
                                }
                            </>
                        ) : props.activeTabIndex == 4 ?
                            resultTabMap.set("IDS_ENFORCERESULT",
                                <>
                                    <div className="actions-stripe">
                                        <div className="d-flex justify-content-end">
                                            <Nav.Link name="addtestparameter"
                                                onClick={() => props.addTest("IDS_ENFORCERESULT")}>
                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                            </Nav.Link>
                                        </div>
                                    </div>
                                    {props.masterData.testenforceTests && props.masterData.testenforceTests.length > 0 &&
                                        <DataGrid
                                            key="testsectionkey"
                                            primaryKeyField="nresultusedmaterialcode"
                                            dataResult={props.masterData["testenforceTests"] && process(sortData(props.masterData["testenforceTests"], 'descending', 'npkDtestparametercode') || [],
                                                props.dataStatetestEnforce
                                                    ? props.dataStatetestEnforce : { skip: 0, take: 10 })}
                                            dataState={props.dataStatetestEnforce
                                                ? props.dataStatetestEnforce : { skip: 0, take: 10 }}
                                            dataStateChange={(event) => { props.dataStateChangetestEnforce(event) }}
                                            extractedColumnList={fieldsForGrid}
                                            controlMap={props.controlMap}
                                            userRoleControlRights={props.userRoleControlRights}
                                            pageable={true}
                                            isActionRequired={true}
                                            scrollable={'scrollable'}
                                            hideColumnFilter={true}
                                            selectedId={0}
                                            testenforceTests={props.masterData.testenforceTests}
                                            deleteRecord={props.deleteModalTest}
                                            deleteParam={{ operation: "delete" }}
                                            actionIcons={[{
                                                title: props.intl.formatMessage({ id: "IDS_DELETE" }),
                                                controlname: "faTrashAlt",
                                                hidden: false,
                                                objectName: "delete",
                                                onClick: props.deleteModalTest
                                            }]}
                                        >
                                        </DataGrid>
                                    }
                                </>
                            ) :
                            resultTabMap.set("IDS_REPORTCOMMENTS",
                                <>
                                    <div className="actions-stripe">
                                        <div className="d-flex justify-content-end">
                                            <Nav.Link name="addtestparameter"
                                                onClick={() => props.addTest()}>
                                                <FontAwesomeIcon icon={faPlus} /> { }
                                                <FormattedMessage id="IDS_Test" defaultMessage="Add Test" />
                                            </Nav.Link>
                                        </div>
                                    </div>
                                    {props.masterData.testParameterreportComments && props.masterData.testParameterreportComments.length > 0 &&
                                        <CustomAccordion
                                            key="parameteraccordion"
                                            accordionTitle={"stestparametersynonym"}
                                            accordionComponent={reportCommentsAccordion(props.masterData.testParameterreportComments)}
                                            inputParam={{ masterData: props.masterData, userInfo: props.userInfo, nFlag: 5 }}
                                            accordionClick={props.getOutcomeDetails}
                                            accordionPrimaryKey={"ntestgrouptestparametercode"}
                                            accordionObjectName={"testParameterreportComments"}
                                            selectedKey={props.masterData.selectedParameterRulesEngine ? props.masterData.selectedParameterRulesEngine.ntestgrouptestparametercode : 0}
                                        />
                                    }
                                </>
                            )
        }
        return resultTabMap;
    }
    function testfilter(list) {
        let activeTabIndex = props.activeTabIndex
        if (props.masterData.selectedParameterRulesEngine) {
            let dynamicList = activeTabIndex === 2 ? props.masterData["testComments"] && props.masterData["testComments"][props.masterData.selectedParameterRulesEngine.ntestgrouptestparametercode]
                : props.masterData["reportComments"] && props.masterData["reportComments"][props.masterData.selectedParameterRulesEngine.ntestgrouptestparametercode]
            if (dynamicList !== undefined) {
                list = list.filter(({ value }) => !dynamicList.some(x => x.nsampletestcommentscode == value))
            }
        }
        return list
    }
    const mandatoryFields =
        props.action === 'IDS_SAVERULEMODAL' ?
            [{ "idsName": "IDS_RULESENGINENAME", "dataField": "srulename", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" }//, 
                //  { "idsName": "IDS_SORTORDER", "dataField": "nruleexecorder", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" }
            ] :
            props.activeTabIndex === 1 ?
                props.action === 'IDS_ADDTEST' ? [
                    { "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    // { "idsName": "IDS_FROMSITE", "dataField": "nfromsitecode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    // { "idsName": "IDS_TOSITE", "dataField": "ntositecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ] :
                    props.action === 'IDS_ADDPARAMETER' ? "" :
                        [
                            { "idsName": "IDS_FROMSITE", "dataField": "nfromsitecode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                            { "idsName": "IDS_TOSITE", "dataField": "ntositecode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                        ]
                :
                props.activeTabIndex === 2 ? [
                    { "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_COMMENTTYPE", "dataField": "ncommenttypecode", "width": "200px" },
                    { "idsName": "IDS_COMMENTSUBTYPE", "dataField": "ncommentsubtypecode", "width": "200px" },
                    props.isneedsgeneralcomments === true ?
                        { "idsName": "IDS_GENERALCOMMENTS", "dataField": "sgeneralcomments", "width": "200px" } :
                        { "idsName": "IDS_PREFINEDCOMMENTS", "dataField": "nsampletestcommentscode", "width": "200px" }
                ] :
                    props.activeTabIndex === 3 ? [
                        { "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
                    ] : props.activeTabIndex === 4 ? [
                        { "idsName": "IDS_TESTNAME", "dataField": "ntestgrouptestcode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                        { "idsName": "IDS_OPTIONALPARAMETERS", "dataField": "ntestgrouptestparametercode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                        { "idsName": "IDS_RESULTFLAG", "dataField": "ngradecode", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                        { "idsName": "IDS_RESULTS", "dataField": "senforceresult", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "file" }
                    ] : ""
    return (

        <div class="modal-inner-content">
            <div class="row margin-top-negative-1">
                <div class="p-0 col-md-12">
                    <div class="vertical-tab-top popup rules-engine-add-rule"
                    >
                        <>
                            <Col className={`tab-left-area p-0  ${props.activeTabIndex
                                ? 'active' : ""} ${props.enablePropertyPopup ? 'active-popup' : ""}`}>
                                <div className="center-area-wrap vertical-tab border-0 mr-0 popup-fixed-center-headed-full-width">
                                    <div className="center-area mt-3 mb-0 mx-4">
                                        <Row className='d-flex pt-0'>
                                            <Col md={6}>
                                                <Button onClick={() => props.addGroup("views")} className="mr-1">
                                                    {'+'} <FormattedMessage id="IDS_GROUP" defaultMessage="Group" />
                                                </Button>
                                                <Button onClick={() => props.resetRule()}>
                                                    <FormattedMessage id="IDS_RESET" defaultMessage="Reset" />
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12} className="ml-0 mr-0">

                                                {props.addGroupList.length > 0 ?
                                                    <>
                                                        <BuilderBorder className='border-0 mb-0'>    {
                                                            createGroupRules()}   </BuilderBorder>
                                                    </>

                                                    : <></>}
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <div md={6} className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab vertical-tab-expand ${props.activeTabIndex
                                ? 'active' : ""}`} >
                                <div className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${props.activeTabIndex
                                    ? 'active' : ""}`} style={{ width: props.enablePropertyPopup ? props.propertyPopupWidth + '%' : "" }}>
                                    <span className={` vertical-tab-close ${props.activeTabIndex
                                        ? 'active' : ""}`} onClick={() => props.changePropertyView(0)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                                    <div className={` vertical-tab-content-common  ${props.activeTabIndex && props.activeTabIndex
                                        ? 'active' : ""}`}>
                                        <h4 className='inner_h4'>
                                            {props.intl.formatMessage({ id: "IDS_OUTCOME" })}
                                        </h4>
                                        {props.activeTabIndex && props.activeTabIndex
                                            ?
                                            <CustomTabs activeKey={props.activeTestTab
                                            } tabDetail={TabDetails()} />
                                            : ""}

                                    </div>
                                </div>
                                <div className='tab-head'>
                                    <ul>
                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 1 ? 'active' : ""}`}
                                            onClick={() => props.changePropertyView(1)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                            <span>
                                                {props.intl.formatMessage({ id: "IDS_Test" })}
                                            </span>
                                        </li>
                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 2 ? 'active' : ""}`}
                                            onClick={() => props.changePropertyView(2)}>
                                            <FontAwesomeIcon icon={faComments} />
                                            <span>
                                                {props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                            </span>
                                        </li>
                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 3 ? 'active' : ""}`}
                                            onClick={() => props.changePropertyView(3)}>
                                            <FontAwesomeIcon icon={faRecycle} />
                                            <span>
                                                {props.intl.formatMessage({ id: "IDS_REPEAT" })}
                                            </span>
                                        </li>
                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 4 ? 'active' : ""}`}
                                            onClick={() => props.changePropertyView(4)}>
                                            <FontAwesomeIcon icon={faFlag} />
                                            <span>
                                                {props.intl.formatMessage({ id: "IDS_ENFORCERESULT" })}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* <ListWrapper className="client-listing-wrap toolbar-top-wrap mtop-4 screen-height-window">
                                <Row noGutters={true} bsPrefix="toolbar-top">
                                    <Col className="parent-port-height">
                                        <ListWrapper className={`vertical-tab-top ${props.enablePropertyPopup ? 'active-popup' : ""}`}>

                                            <Col className={`tab-left-area p-0  ${props.activeTabIndex
                                                ? 'active' : ""} ${props.enablePropertyPopup ? 'active-popup' : ""}`}>
                                                <div className="center-area-wrap vertical-tab border-0 mr-0 popup-fixed-center-headed-full-width">
                                                    <div className="center-area mt-3 mb-0 mx-4">
                                                        <Row className='d-flex pt-0'>
                                                            <Col md={6}>
                                                                <Button onClick={() => props.addGroup("views")} className="mr-1">
                                                                    {'+'} <FormattedMessage id="IDS_GROUP" defaultMessage="Group" />
                                                                </Button>
                                                                <Button onClick={() => props.resetRule()}>
                                                                    <FormattedMessage id="IDS_RESET" defaultMessage="Reset" />
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={12} className="ml-0 mr-0">

                                                                {props.addGroupList.length > 0 ?
                                                                    <>
                                                                        <BuilderBorder className='border-0 mb-0'>    {
                                                                            createGroupRules()}   </BuilderBorder>
                                                                    </>

                                                                    : <></>}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Col>  
                                            <div md={6} className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab vertical-tab-expand ${props.activeTabIndex
                                                ? 'active' : ""}`} >
                                                <div className={`${props.enablePropertyPopup ? 'active-popup' : ""} vertical-tab-content pager_wrap wrap-class ${props.activeTabIndex
                                                    ? 'active' : ""}`} style={{ width: props.enablePropertyPopup ? props.propertyPopupWidth + '%' : "" }}>
                                                    <span className={` vertical-tab-close ${props.activeTabIndex
                                                        ? 'active' : ""}`} onClick={() => props.changePropertyView(0)}><FontAwesomeIcon icon={faChevronRight} /> </span>
                                                    <div className={` vertical-tab-content-common  ${props.activeTabIndex && props.activeTabIndex
                                                        ? 'active' : ""}`}>
                                                        <h4 className='inner_h4'>
                                                            {props.intl.formatMessage({ id: "IDS_OUTCOME" })}
                                                        </h4>
                                                        {props.activeTabIndex && props.activeTabIndex
                                                            ?
                                                            <CustomTabs activeKey={props.activeTestTab
                                                            } tabDetail={TabDetails()} />
                                                            : ""}

                                                    </div>
                                                </div>
                                                <div className='tab-head'>
                                                    <ul>
                                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 1 ? 'active' : ""}`}
                                                            onClick={() => props.changePropertyView(1)}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                            <span>
                                                                {props.intl.formatMessage({ id: "IDS_Test" })}
                                                            </span>
                                                        </li>
                                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 2 ? 'active' : ""}`}
                                                            onClick={() => props.changePropertyView(2)}>
                                                            <FontAwesomeIcon icon={faComments} />
                                                            <span>
                                                                {props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                                                            </span>
                                                        </li>
                                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 3 ? 'active' : ""}`}
                                                            onClick={() => props.changePropertyView(3)}>
                                                            <FontAwesomeIcon icon={faRecycle} />
                                                            <span>
                                                                {props.intl.formatMessage({ id: "IDS_REPEAT" })}
                                                            </span>
                                                        </li>
                                                        <li className={`${props.activeTabIndex && props.activeTabIndex == 4 ? 'active' : ""}`}
                                                            onClick={() => props.changePropertyView(4)}>
                                                            <FontAwesomeIcon icon={faFlag} />
                                                            <span>
                                                                {props.intl.formatMessage({ id: "IDS_ENFORCERESULT" })}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                    <span className='tab-click-toggle-btn'>
                                                        <CustomSwitch
                                                            // label={"Popup Nav"}
                                                            label={props.intl.formatMessage({ id: "IDS_POPUPNAV" })}
                                                            type="switch"
                                                            name={"PopupNav"}
                                                            onChange={(event) => props.onInputSwitchOnChange(event)}
                                                            defaultValue={props.enablePropertyPopup}
                                                            isMandatory={false}
                                                            required={true}
                                                            checked={props.enablePropertyPopup}
                                                        />
                                                    </span>
                                                </div>
                                            </div>

                                        </ListWrapper>
                                    </Col>
                                </Row>
                            </ListWrapper > */}






                            {
                                props.modalParameterPopup ?
                                    <SlideOutModal
                                        show={props.modalParameterPopup}
                                        closeModal={props.closeModalShow}
                                        //operation={props.action}
                                        esign={false}
                                        inputParam={{}}
                                        screenName={'IDS_RESULTENTRY'}
                                        onSaveClick={props.modalsaveClick}
                                        //hideSave={this.props.Login.screenName === "IDS_VIEWRULE" || this.props.Login.screenName === "IDS_VIEWOUTCOME" || this.props.Login.screenName === "IDS_SUBCODERESULT" ? true : false}
                                        // size={"lg"}
                                        selectedRecord={props.selectedRecord || {}}
                                        addComponent={
                                            <TestGroupResultEntry
                                                onKeyPress={onKeyPress}
                                                parameterResults={props.selectedRecord.ParameterRulesEngine || []}
                                                screenName={'IDS_ADDTEST'}
                                                PredefinedValues={props.PredefinedValues}
                                                onResultInputChange={props.onResultInputChange}
                                                onGradeEvent={props.onGradeEvent}
                                                gradeValues={props.gradeValues || []}
                                                selectedResultGrade={props.selectedRecord.selectedResultGrade || []}
                                            />
                                        }
                                    />
                                    :
                                    props.openModalPopup &&
                                    <ModalShow
                                        modalShow={true}
                                        // size={props.activeTabIndex === 1 && (props.action === 'IDS_ADDPARAMETER' || props.action === 'IDS_ADDTEST') ? 'lg' : ""}
                                        modalTitle={props.action === 'IDS_ADDPARAMETER' ? props.intl.formatMessage({ id: 'IDS_ADDPARAMETER' }) :
                                            props.action === 'IDS_SAVERULEMODAL' ? 'IDS_RULESENGINENAME' :
                                                props.action === 'IDS_ADDREPORTCOMMENTS' ? props.intl.formatMessage({ id: 'IDS_ADDREPORTCOMMENTS' }) :
                                                    props.action === 'IDS_ADDTESTCOMMENTS' ? props.intl.formatMessage({ id: 'IDS_ADDTESTCOMMENTS' })
                                                        : props.action === 'IDS_ADDTEST' ? props.activeTabIndex == 3 ? props.intl.formatMessage({ id: 'IDS_ADDREPEATTEST' }) :
                                                            props.intl.formatMessage({ id: 'IDS_ADDTEST' }) :
                                                            props.intl.formatMessage({ id: 'IDS_ADDOUTSOURCESITE' })}

                                        closeModal={props.closeModalShow}
                                        onSaveClick={props.action === 'IDS_SAVERULEMODAL' ? props.save : props.modalsaveClick}
                                        // validateEsign={this.validateEsign}
                                        selectedRecord={props.selectedRecord}
                                        mandatoryFields={mandatoryFields}
                                        modalBody={

                                            props.openmodalsavePopup === true ?
                                                <Row>
                                                    <Col md={12}>
                                                        <FormInput
                                                            label={props.intl.formatMessage({ id: "IDS_RULESENGINENAME" })}
                                                            name={`srulename`}
                                                            placeholder={props.intl.formatMessage({ id: "IDS_RULESENGINENAME" })}
                                                            type="text"
                                                            maxLength={100}
                                                            required={false}
                                                            isMandatory={true}
                                                            value={props.selectedRecord["srulename"] || ""}
                                                            onChange={(event) => props.onInputChange(event)}
                                                        />
                                                    </Col>
                                                    {/* <Col md={12}>
                                                <FormNumericInput
                                                    name={'nruleexecorder'}
                                                    label={props.intl.formatMessage({ id: "IDS_SORTORDER" })}
                                                    placeholder={props.intl.formatMessage({ id: "IDS_SORTORDER" })}
                                                    value={props.selectedRecord["nruleexecorder"] ? props.selectedRecord["nruleexecorder"] : ""}
                                                    type="text"
                                                    strict={true}
                                                    maxLength={10}
                                                    noStyle={true}
                                                    onChange={(event) => props.onRuleNumericInputOnChange(event, 'nruleexecorder')} 
                                                    min={0}
                                                    isMandatory={true}
                                                    className="form-control" 
                                                    required={false}
                                                />
                                            </Col> */}
                                                </Row>
                                                :
                                                props.activeTabIndex == 1 ?
                                                    <Col md={12}>
                                                        <Row>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                                    isSearchable={true}
                                                                    name={"ntestgrouptestcode"}
                                                                    showOption={true}
                                                                    options={props.testInitiateTestCombo || []}
                                                                    optionId='ntestgrouptestcode'
                                                                    optionValue='stestparametersynonym'
                                                                    value={props.selectedRecord["ntestgrouptestcode"] && props.selectedRecord["ntestgrouptestcode"] || ""}
                                                                    onChange={value => props.onmodalComboChange(value, 'ntestgrouptestcode')}
                                                                    isMandatory={true}
                                                                    isDisabled={props.action === 'IDS_ADDTEST'
                                                                        ? props.modalParameterPopup ? true : false : true}
                                                                ></FormSelectSearch>
                                                            </Col>
                                                            {/* <Col md={12}>
                                                        <CustomSwitch
                                                            label={props.intl.formatMessage({ id: "IDS_NEEDSAMPLE" })}
                                                            type="switch"
                                                            name={"nneedsample"}
                                                            onChange={(event) => props.onInputChange(event)}
                                                            placeholder={props.intl.formatMessage({ id: "IDS_NEEDSAMPLE" })}
                                                            defaultValue={props.selectedRecord ? props.selectedRecord["nneedsample"] === 3 ? true : false : ""}
                                                            isMandatory={false}
                                                            required={false}
                                                            checked={props.selectedRecord["nneedsample"] === 3 ? true : false}
                                                        //  disabled={props.selectedRecord ? props.selectedRecord["ndefaultstatus"] === 3 ? true : false : false}
                                                        >
                                                        </CustomSwitch>
                                                    </Col> */}
                                                            {
                                                                props.action === 'IDS_ADDPARAMETER'
                                                                    || props.action === 'IDS_ADDTEST'
                                                                    ?
                                                                    // <div className="center-area-wrap vertical-tab border-0 mr-0 popup-fixed-center-headed-full-width">
                                                                    <TestGroupResultEntry
                                                                        parameterResults={props.selectedRecord.ParameterRulesEngine || []}
                                                                        screenName={'IDS_ADDTEST'}
                                                                        PredefinedValues={props.PredefinedValues}
                                                                        onResultInputChange={props.onResultInputChange}
                                                                        onGradeEvent={props.onGradeEvent}
                                                                        gradeValues={props.gradeValues || []}
                                                                        selectedResultGrade={props.selectedRecord.selectedResultGrade || []}
                                                                    />
                                                                    // </div>
                                                                    : ""
                                                            }
                                                            {/* <Col md={12}>
                                                        <FormSelectSearch
                                                            formLabel={props.intl.formatMessage({ id: "IDS_PARAMETERS" })}
                                                            isSearchable={true}
                                                            name={"ntestgrouptestparametercode"}
                                                            showOption={true}
                                                            options={props.testGroupTestParameterRulesEngine || []}
                                                            optionId='ntestgrouptestparametercode'
                                                            optionValue='stestparametersynonym'
                                                            value={props.selectedRecord["ntestgrouptestparametercode"] && props.selectedRecord["ntestgrouptestparametercode"] || ""}
                                                            onChange={value => props.onmodalComboChange(value, 'ntestgrouptestparametercode')}
                                                            isMandatory={true}
                                                            isDisabled={false}
                                                        ></FormSelectSearch>
                                                    </Col> */}
                                                        </Row>

                                                        {(
                                                            props.action === 'IDS_ADDSITE'// || props.action === 'IDS_ADDTEST'
                                                                ? true : false
                                                        )
                                                            ?
                                                            <Row>
                                                                <Col md={12}>
                                                                    <FormSelectSearch
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_FROMSITE" })}
                                                                        // formGroupClassName="remove-floating-label-margin"
                                                                        isSearchable={true}
                                                                        name={"nfromsitecode"}
                                                                        showOption={true}
                                                                        options={props.siteList || []}
                                                                        optionId='nfromsitecode'
                                                                        optionValue='ssitename'
                                                                        isMandatory={true}
                                                                        value={props.selectedRecord["nfromsitecode"] && props.selectedRecord["nfromsitecode"] || ""}
                                                                        onChange={value => props.onmodalComboChange(value, 'nfromsitecode')}
                                                                    //  isMandatory={true}
                                                                    ></FormSelectSearch>
                                                                </Col>
                                                                <Col md={12}>
                                                                    <FormSelectSearch
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_TOSITE" })}
                                                                        //    formGroupClassName="remove-floating-label-margin"
                                                                        isSearchable={true}
                                                                        name={"ntositecode"}
                                                                        showOption={true}
                                                                        options={props.siteList || []}
                                                                        optionId='ntositecode'
                                                                        optionValue='ssitename'
                                                                        isMandatory={true}
                                                                        value={props.selectedRecord["ntositecode"] && props.selectedRecord["ntositecode"] || ""}
                                                                        onChange={value => props.onmodalComboChange(value, 'ntositecode')}
                                                                    //  isMandatory={true}
                                                                    ></FormSelectSearch>
                                                                </Col>
                                                            </Row> : ""
                                                        }
                                                    </Col>
                                                    :
                                                    props.activeTabIndex == 2 ?
                                                        <Row>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                                    isSearchable={true}
                                                                    name={"ntestgrouptestcode"}
                                                                    showOption={true}
                                                                    options={props.testCommentsTestCombo || []}
                                                                    optionId='ntestgrouptestcode'
                                                                    optionValue='stestparametersynonym'
                                                                    value={props.selectedRecord["ntestgrouptestcode"] && props.selectedRecord["ntestgrouptestcode"] || ""}
                                                                    onChange={value => props.onmodalComboChange(value, 'ntestgrouptestcode')}
                                                                    isMandatory={true}
                                                                    isDisabled={props.action === 'IDS_ADDTEST' ? false : true}
                                                                ></FormSelectSearch>
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_COMMENTTYPE" })}
                                                                    isSearchable={true}
                                                                    name={"ncommenttypecode"}
                                                                    showOption={true}
                                                                    options={props.CommentType || []}
                                                                    optionId='ncommenttypecode'
                                                                    optionValue='scommenttype'
                                                                    value={props.selectedRecord["ncommenttypecode"] && props.selectedRecord["ncommenttypecode"] || ""}
                                                                    onChange={value => props.onmodalComboChange(value, 'ncommenttypecode')}
                                                                    isMandatory={true}
                                                                ></FormSelectSearch>
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={props.intl.formatMessage({ id: "IDS_COMMENTSUBTYPE" })}
                                                                    isSearchable={true}
                                                                    name={"ncommentsubtypecode"}
                                                                    showOption={true}
                                                                    options={props.CommentSubType || []}
                                                                    optionId='ncommentsubtypecode'
                                                                    optionValue='scommentsubtype'
                                                                    value={props.selectedRecord["ncommentsubtypecode"] && props.selectedRecord["ncommentsubtypecode"] || ""}
                                                                    onChange={value => props.onmodalComboChange(value, 'ncommentsubtypecode')}
                                                                    isMandatory={true}
                                                                ></FormSelectSearch>
                                                            </Col>
                                                            {props.selectedRecord["ncommentsubtypecode"] ?
                                                                props.isneedsgeneralcomments === true ?
                                                                    <Col md={12}>
                                                                        <FormTextarea
                                                                            name={"sgeneralcomments"}
                                                                            label={props.intl.formatMessage({ id: "IDS_GENERALCOMMENTS" })}
                                                                            type="text"
                                                                            value={props.selectedRecord && props.selectedRecord['sgeneralcomments'] || ""}
                                                                            // isMandatory={control.mandatory}
                                                                            // required={control.mandatory}
                                                                            onChange={(event) => props.onInputChange(event, 1)}
                                                                            rows="2"
                                                                            maxLength={"255"}
                                                                            isDisabled={false}
                                                                            isMandatory={true}
                                                                        />
                                                                    </Col> : <Col md={12}>
                                                                        <FormSelectSearch
                                                                            formLabel={props.intl.formatMessage({ id: "IDS_PREDEFINEDNAME" })}
                                                                            isSearchable={true}
                                                                            name={"nsampletestcommentscode"}
                                                                            showOption={true}
                                                                            options={props.predefcomments || []}
                                                                            optionId='nsampletestcommentscode'
                                                                            optionValue='spredefinedname'
                                                                            value={props.selectedRecord["nsampletestcommentscode"] && props.selectedRecord["nsampletestcommentscode"] || ""}
                                                                            onChange={value => props.onmodalComboChange(value, 'nsampletestcommentscode')}
                                                                            isMandatory={true}
                                                                        ></FormSelectSearch>
                                                                        {/* <FormInput
                                                                    formGroupClassName="remove-floating-label-margin"
                                                                    label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                                                    name={`sdescription`}
                                                                    type="text"
                                                                    required={false}
                                                                    isMandatory={true}
                                                                    value={props.selectedRecord["sdescription"] && props.selectedRecord["sdescription"] || ""}
                                                                    onChange={(event) => props.onInputChange(event)}
                                                                /> */}
                                                                        <FormTextarea
                                                                            formGroupClassName="remove-floating-label-margin"
                                                                            label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                                                                            name={`sdescription`}
                                                                            type="text"
                                                                            required={false}
                                                                            isMandatory={true}
                                                                            value={props.selectedRecord["sdescription"] && props.selectedRecord["sdescription"] || ""}
                                                                            onChange={(event) => props.onInputChange(event)}
                                                                        />
                                                                    </Col>
                                                                : ""
                                                            }

                                                        </Row>
                                                        : props.activeTabIndex == 3 ?
                                                            <Row>
                                                                <Col md={12}>
                                                                    <FormSelectSearch
                                                                        formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                                        isSearchable={true}
                                                                        name={"ntestgrouptestcode"}
                                                                        showOption={true}
                                                                        options={props.testRepeatTestCombo || []}
                                                                        optionId='ntestgrouptestcode'
                                                                        optionValue='stestparametersynonym'
                                                                        value={props.selectedRecord["ntestgrouptestcode"] && props.selectedRecord["ntestgrouptestcode"] || ""}
                                                                        onChange={value => props.onmodalComboChange(value, 'ntestgrouptestcode')}
                                                                        isMandatory={true}
                                                                        isDisabled={props.action === 'IDS_ADDTEST' ? false : true}
                                                                    ></FormSelectSearch>
                                                                </Col>
                                                                <Col md={12}>
                                                                    <FormNumericInput
                                                                        name={'nrepeatcountno'}
                                                                        label={props.intl.formatMessage({ id: "IDS_REPEATCOUNT" })}
                                                                        placeholder={props.intl.formatMessage({ id: "IDS_REPEATCOUNT" })}
                                                                        value={props.selectedRecord["nrepeatcountno"] ? props.selectedRecord["nrepeatcountno"] : ""}
                                                                        type="text"
                                                                        strict={true}
                                                                        maxLength={10}
                                                                        noStyle={true}
                                                                        onChange={(event) => props.onRuleNumericInputOnChange(event, 'nrepeatcountno')}
                                                                        //  precision={2}
                                                                        min={0}
                                                                        max={9}
                                                                        className="form-control"
                                                                        isMandatory={false}
                                                                        required={false}
                                                                    />
                                                                </Col>
                                                            </Row> : props.activeTabIndex == 4 ?
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <FormSelectSearch
                                                                            formLabel={props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                                                                            isSearchable={true}
                                                                            name={"ntestgrouptestcode"}
                                                                            showOption={true}
                                                                            options={props.testenforceTestCombo || []}
                                                                            optionId='ntestgrouptestcode'
                                                                            optionValue='stestparametersynonym'
                                                                            value={props.selectedRecord["ntestgrouptestcode"] && props.selectedRecord["ntestgrouptestcode"] || ""}
                                                                            onChange={value => props.onmodalComboChange(value, 'ntestgrouptestcode')}
                                                                            isMandatory={true}
                                                                            isDisabled={props.action === 'IDS_ADDTEST' ? false : true}
                                                                        ></FormSelectSearch>
                                                                    </Col>
                                                                    <Col md={12}>
                                                                        <FormSelectSearch
                                                                            formLabel={props.intl.formatMessage({ id: "IDS_OPTIONALPARAMETERS" })}
                                                                            isSearchable={true}
                                                                            name={"ntestgrouptestparametercode"}
                                                                            showOption={true}
                                                                            options={props.testGroupTestParameterRulesEngine || []}
                                                                            optionId='ntestgrouptestparametercode'
                                                                            optionValue='stestparametersynonym'
                                                                            value={props.selectedRecord["ntestgrouptestparametercode"] && props.selectedRecord["ntestgrouptestparametercode"] || ""}
                                                                            onChange={value => props.onmodalComboChange(value, 'ntestgrouptestparametercode')}
                                                                            isMandatory={true}
                                                                            isDisabled={false}
                                                                        ></FormSelectSearch>
                                                                    </Col>
                                                                    <Col md={12}>
                                                                        <FormTextarea
                                                                            name="senforceresult"
                                                                            label={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                                            placeholder={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                                                                            value={props.selectedRecord ? props.selectedRecord["senforceresult"] : ""}
                                                                            rows="2"
                                                                            isMandatory={true}
                                                                            required={false}
                                                                            maxLength={255}
                                                                            onChange={(event) => props.onInputChange(event, 1)}
                                                                        />
                                                                    </Col>
                                                                    <Col md={12}>
                                                                        <FormSelectSearch
                                                                            formLabel={props.intl.formatMessage({ id: "IDS_RESULTFLAG" })}
                                                                            isSearchable={true}
                                                                            name={"ngradecode"}
                                                                            showOption={true}
                                                                            options={props.GradeList || []}
                                                                            optionId='ngradecode'
                                                                            optionValue='sgradename'
                                                                            value={props.selectedRecord["ngradecode"] && props.selectedRecord["ngradecode"] || ""}
                                                                            onChange={value => props.onmodalComboChange(value, 'ngradecode')}
                                                                            isMandatory={true}
                                                                            isDisabled={false}
                                                                        ></FormSelectSearch>
                                                                    </Col>
                                                                </Row> : ""
                                        }
                                    />
                            }
                        </>
                    </div></div></div>

        </div >
    );
};

export default injectIntl(AddTestGroupRule);