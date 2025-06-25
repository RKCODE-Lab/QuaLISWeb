import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
//import { Col, Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl, FormattedMessage } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Nav } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';

const AddCodedResult = (props) => {
    const { needCodedResult, needActualResult, grade } = props.parameterData;
    const testMethodColumnList = [
        { "idsName": "IDS_SUBCODEDRESULT", "dataField": "ssubcodedresult", "width": "200px" }];
        
    return (
        <Col md="12">
            <FormInput
                name="spredefinedname"
                label={props.intl.formatMessage({ id: "IDS_CODEDRESULT" })}
                type="text"
                required={!needCodedResult}
                isMandatory={needCodedResult ? "" : "*"}
                isDisabled={needCodedResult}
                value={props.selectedRecord && props.selectedRecord["spredefinedname"] ? props.selectedRecord["spredefinedname"] : ""}
                placeholder={props.intl.formatMessage({ id: "IDS_CODEDRESULT" })}
                //onChange = { (event) => props.onInputOnChange(event, 1) }
                onChange={(event) => props.onInputOnChange(event, 6)}
                maxLength={100}
            />
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_ACTUALRESULT" })}
                isSearchable={true}
                name={"ngradecode"}
                isDisabled={needActualResult}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={!needActualResult}
                options={grade || []}
                optionId='ngradecode'
                optionValue='sdisplaystatus'
                value={props.selectedRecord && props.selectedRecord["ngradecode"] ? props.selectedRecord["ngradecode"] : ""}
                onChange={value => props.onComboChange(value, "ngradecode", 1)}
                alphabeticalSort={true}
            >
            </FormSelectSearch>

            {/* <FormTextarea
                name={"sresultparacomment"}
                //label={props.intl.formatMessage({ id: "IDS_RESULTPARAMETERCOMMENTS" })}IDS_CODEDRESULTSYNONYM
                label={props.intl.formatMessage({ id: "IDS_CODEDRESULTSYNONYM" })}
                onChange={(event) => props.onInputOnChange(event, 1)}
                placeholder={props.intl.formatMessage({ id: "IDS_CODEDRESULTSYNONYM" })}
                //value={props.selectedRecord?props.selectedRecord["sresultparacomment"]:""}
                value={props.selectedRecord && props.selectedRecord["sresultparacomment"] ? props.selectedRecord["sresultparacomment"] : ""}
                isDisabled={needActualResult}
                rows="2"
                required={false}
                maxLength={500}
                isMandatory={needCodedResult ? "" : "*"}
            ></FormTextarea> */}

            <FormInput
                name="spredefinedsynonym"
                label={props.intl.formatMessage({ id: "IDS_CODEDRESULTSYNONYM" })}
                type="text"
                required={!needCodedResult}
                isMandatory={needCodedResult ? "" : "*"}
                isDisabled={needCodedResult}
                value={props.selectedRecord && props.selectedRecord["spredefinedsynonym"] ? props.selectedRecord["spredefinedsynonym"] : ""}
                placeholder={props.intl.formatMessage({ id: "IDS_CODEDRESULTSYNONYM" })}
                //onChange = { (event) => props.onInputOnChange(event, 1) }
                onChange={(event) => props.onInputOnChange(event, 1)}
                maxLength={100}
            />
{props.userInfo.nformcode === 62?
<FormTextarea
name={"spredefinedcomments"}
label={props.intl.formatMessage({ id: "IDS_RESULTPARAMETERCOMMENTS" })}IDS_CODEDRESULTSYNONYM
onChange={(event) => props.onInputOnChange(event, 1)}
placeholder={props.intl.formatMessage({ id: "IDS_RESULTPARAMETERCOMMENTS" })}
value={props.selectedRecord && props.selectedRecord["spredefinedcomments"] ? props.selectedRecord["spredefinedcomments"] : ""}
isDisabled={needActualResult}
rows="2"
required={false}
maxLength={255}
isMandatory={false}
></FormTextarea>
            :""}
{props.userInfo.nformcode === 62?




            <Row>
                
                <Col md={6}>

                
                    <CustomSwitch
                        name={"nneedresultentryalert"}
                        label={props.intl.formatMessage({ id: "IDS_AlERTFORRESULTENTRY" })}
                        type="switch"
                        onChange={(event) => props.onInputOnChange(event, 5, [3, 4])}
                        placeholder={props.intl.formatMessage({ id: "IDS_AlERTFORRESULTENTRY" })}
                        defaultValue={props.selectedRecord["nneedresultentryalert"] === 3 ? true : false}
                        checked={props.selectedRecord["nneedresultentryalert"] === 3 ? true : false}
                    >
                    </CustomSwitch>
                </Col>
                <Col md={6}>
                    <CustomSwitch
                        name={"nneedsubcodedresult"}
                        label={props.intl.formatMessage({ id: "IDS_SUBCODERESULTNEED" })}
                        type="switch"
                        onChange={(event) => props.onInputOnChange(event, 5, [3, 4])}
                        placeholder={props.intl.formatMessage({ id: "IDS_SUBCODERESULTNEED" })}
                        defaultValue={props.selectedRecord["nneedsubcodedresult"] === 3 ? true : false}
                        checked={props.selectedRecord["nneedsubcodedresult"] === 3 ? true : false}
                        disabled={props.selectedRecord["nneedresultentryalert"] === 3 ? false : true}
                    >
                    </CustomSwitch>
                </Col>
                {props.selectedRecord["nneedresultentryalert"] === 3?
                <Col>

                    <FormTextarea
                        name="salertmessage"
                        label={props.intl.formatMessage({ id: "IDS_ALERTMESSAGE" })}
                        type="text"
                        required={props.selectedRecord["nneedresultentryalert"] === 3 ? false : true}
                        isMandatory={props.selectedRecord["nneedresultentryalert"] === 3 ? "*" : ""}
                        //isDisabled={needCodedResult}
                        value={props.selectedRecord && props.selectedRecord["salertmessage"] ? props.selectedRecord["salertmessage"] : ""}
                        placeholder={props.intl.formatMessage({ id: "IDS_ALERTMESSAGE" })}
                        //onChange = { (event) => props.onInputOnChange(event, 1) }
                        onChange={(event) => props.onInputOnChange(event, 1)}
                        maxLength={255}
                        isDisabled={props.selectedRecord["nneedresultentryalert"] === 3 ? false : true}
                    ></FormTextarea>
                </Col>
                :""}
            </Row>
            :""}
            <>
            {props.userInfo.nformcode===62?
            <div className='d-flex justify-content-end mb-3'>
                <Nav.Item className="add-txt-btn" name="addcodedresultname"
                    hidden={props.selectedRecord["nneedsubcodedresult"] === 4 ? true : false}
                    onClick={() => props.addSubCodedResult()}>
                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>{" "}
                    <FormattedMessage id="IDS_SUBCODEDRESULT" defaultMessage="Sub Coded Result" />
                </Nav.Item>
            </div>
:""}
            </>



            {props.selectedRecord["nneedsubcodedresult"] === 3 && props.userInfo.nformcode===62 ?
                //  <Row noGutters={true}>
                // <Col md="12">
                <DataGrid
                    key="ssubcodedresult"
                    primaryKeyField="ssubcodedresult"
                    // dataResult={[]}
                    dataResult={props.selectedsubcodedresult || []}
                    // dataResult={this.props.selectedWorklistHistory ||[]}
                    dataState={{}}
                    // dataState={this.state.sectionDataState}
                    // dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                    data={[]}
                    extractedColumnList={testMethodColumnList}
                    controlMap={props.controlMap}
                    userRoleControlRights={props.userRoleControlRights}
                    pageable={false}
                    scrollable={'scrollable'}
                    gridHeight={'335px'}
                    isActionRequired={true}
                    methodUrl="AuditTrail"
                    hideColumnFilter={true}
                    actionIcons={[{
                        title: props.intl.formatMessage({ id: "IDS_CODEDRESULT" }),
                        // title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }),
                        controlname: "faTrashAlt",
                        objectName: "ExceptionLogs",

                       
                        hidden: props.userRoleControlRights && props.userRoleControlRights.indexOf(props.controlMap.has("DeleteSubCodedResult") && props.controlMap.get("DeleteSubCodedResult").ncontrolcode)  === -1,
                        onClick: (item, key, nn) => props.deleteSubCodedResult(item, key, nn)
                        //onClick: (subCodedResult) => props.deleteSubCodedResult(subCodedResult)
                    }]}
                //userRoleControlRights={this.props.userRoleControlRights}

                >
                </DataGrid>
                // </Col>
                // </Row>
                : ""}
            {/* <FormTextarea
                    name={"sresultparacomment"}
                    label={props.intl.formatMessage({ id: "IDS_CODEDRESULTSYNONYM" })}
                    onChange={(event) => props.onInputOnChange(event, 1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CODEDRESULTSYNONYM" })}
                    //value={props.selectedRecord?props.selectedRecord["sresultparacomment"]:""}
                    value={props.selectedRecord && props.selectedRecord["sresultparacomment"]?props.selectedRecord["sresultparacomment"]:""}
                    isDisabled={needActualResult}
                    isMandatory={true}
                    rows="2"
                    required={true}
                    maxLength={500}
                ></FormTextarea> */}
        </Col>




    );
}

export default injectIntl(AddCodedResult);