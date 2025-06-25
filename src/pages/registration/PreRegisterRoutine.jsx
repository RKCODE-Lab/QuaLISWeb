import React, { Component } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { HeaderSpan, TreeDesign } from './registration.styled';
import FormTreeMenu from '../../components/form-tree-menu/form-tree-menu.component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import './registration.css'
import { FormattedMessage, injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

class PreRegisterRoutine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTestItem: [],
            selectedSourceItem: [],
            selectedTest: []
        }
    }

    render() {
        const testColumnList = [
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", width: "200px" },
            { "idsName": "IDS_SECTION", "dataField": "ssectionname", width: "150px" },
            // { "idsName": "IDS_SOURCE", "dataField": "ssourcename", width: "100px" },
            { "idsName": "IDS_METHOD", "dataField": "smethodname", width: "150px" },
            { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", width: "150px" }]
        const { ProductCategory, Product, Manufacturer, Specification, Client, OpenNodes, FocusKey, ActiveKey,
            Supplier, ContainerType, StorageCondition, Disposition, Unit, Priority, Period, timezone ,selectedTest} = this.props;
        const diableAllStatus = this.props.statustoEditDetail && this.props.statustoEditDetail.napprovalstatuscode;
        const recordStatus = this.props.selectedRecord && this.props.selectedRecord.ntransactionstatus;

        if(this.props && this.props.AgaramTree && this.props.AgaramTree.length > 0){
            this.props.AgaramTree[0]["label"] = this.props.AgaramTree[0]["label"] === 'root' ? 
            this.props.intl.formatMessage({ id: "IDS_ROOT" }) : this.props.AgaramTree[0]["label"];
        }

        return (
            <>
                <Row>
                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                {/* Client */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_CLIENTNAME" })}
                                    isSearchable={true}
                                    isDisabled={diableAllStatus === recordStatus}
                                    name={"nclientcode"}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    options={Client}
                                    alphabeticalSort="true"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nclientcode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nclientcode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onClientComboChange(event)}>
                                </FormSelectSearch>

                                {/* Product Category */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLEDCATEGORY" })}
                                    isSearchable={true}
                                    name={"nproductcatcode"}
                                    isDisabled={this.props.operation === 'update' ? true : false}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    options={ProductCategory}
                                    alphabeticalSort="true"
                                    optionId="nproductcatcode"
                                    optionValue="sproductcatname"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nproductcatcode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nproductcatcode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onproductCategoryChange(event, 'nproductcatcode')}>
                                </FormSelectSearch>

                                {/* Product */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                                    isSearchable={true}
                                    name={"nproductcode"}
                                    isDisabled={this.props.operation === 'update' ? true : false}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    options={Product}
                                    alphabeticalSort="true"
                                    optionId="nproductcode"
                                    optionValue="sproductname"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nproductcode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nproductcode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onProductChange(event, 'nproductcode')}>
                                </FormSelectSearch>
                            </Col>

                            {/* Spec Tree */}
                            <Col md={12} className="r_treepadding" >
                                <TreeDesign operation={this.props.operation}>

                                    {this.props.AgaramTree && this.props.AgaramTree.length > 0 &&
                                        <PerfectScrollbar>
                                            <FormTreeMenu
                                                data={this.props.AgaramTree}
                                                handleTreeClick={this.props.onTreeClick}
                                                // openNodes={OpenNodes}
                                                hasSearch={false}
                                                initialOpenNodes={OpenNodes}
                                                // initialFocusKey={InitialFocusKey}
                                                // initialActiveKey={InitialActiveKey}
                                                focusKey={FocusKey || ""}
                                                activeKey={ActiveKey || ""}
                                            />
                                        </PerfectScrollbar>

                                    }

                                </TreeDesign>
                            </Col>

                            {/* Spec */}
                            <Col md={6}>
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_SPECIFICATION" })}
                                    isSearchable={true}
                                    name={"nallottedspeccode"}
                                    isDisabled={this.props.operation === 'update' ? true : false}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    options={Specification}
                                    alphabeticalSort="true"
                                    optionId="nallottedspeccode"
                                    optionValue="sspecname"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nallottedspeccode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nallottedspeccode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onspecChange(event, ['nallottedspeccode', 'sversionno'])}>
                                </FormSelectSearch>
                            </Col>

                            {/* Spec Version */}
                            <Col md={6}>
                                <FormInput
                                    label={this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                                    name="sversion"
                                    type="text"
                                    maxLength="100"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sversion"] || "" : ""}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                                    isDisabled={true}
                                />
                            </Col>
                            <Col md={12}>

                                {/* Manufacturer */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_MANUFACTURER" })}
                                    isSearchable={true}
                                    name={"nmanufcode"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={false}
                                    isClearable={true}
                                    options={Manufacturer}
                                    alphabeticalSort="true"
                                    optionId="nmanufcode"
                                    optionValue="smanufname"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nmanufcode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nmanufcode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'nmanufcode')}>
                                </FormSelectSearch>

                                {/* Supplier */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_SUPPLIER" })}
                                    isSearchable={true}
                                    name={"nsuppliercode"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={false}
                                    isClearable={true}
                                    options={Supplier}
                                    alphabeticalSort="true"
                                    optionId="nsuppliercode"
                                    optionValue="ssuppliername"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nsuppliercode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nsuppliercode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'nsuppliercode')}>
                                </FormSelectSearch>
                                {/* Sample Condition */}
                                <FormTextarea
                                    label={this.props.intl.formatMessage({ id: "IDS_SAMPLECONDITION" })}
                                    name="ssamplecondition"
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SAMPLECONDITION" })}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["ssamplecondition"] : ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={255}
                                    row={2}
                                    isDisabled={diableAllStatus === recordStatus}
                                />

                                {/* Storage Condition */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_STORAGECONDITION" })}
                                    isSearchable={true}
                                    isClearable={true}
                                    name={"nstorageconditioncode"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={false}
                                    options={StorageCondition}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nstorageconditioncode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nstorageconditioncode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'nstorageconditioncode')}>
                                </FormSelectSearch>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={6}>
                                {/* Recieved Date */}
                                <DateTimePicker
                                    name={"dreceiveddate"}
                                    label={this.props.intl.formatMessage({ id: "IDS_RECEIVEDDATE" })}
                                    className='form-control'
                                    placeholderText={this.props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                                    selected={this.props.selectedRecord ? this.props.selectedRecord["dreceiveddate"] : new Date()}
                                    dateFormat={this.props.userInfo["ssitedatetime"]}
                                    timeInputLabel={this.props.intl.formatMessage({ id: "IDS_RECEIVEDDATE" })}
                                    showTimeInput={true}
                                    isClearable={false}
                                    isMandatory={true}
                                    required={true}
                                    isDisabled={diableAllStatus === recordStatus}
                                    maxDate={this.props.CurrentTime}
                                    maxTime={this.props.CurrentTime}
                                    onChange={date => this.props.handleDateChange("dreceiveddate", date)}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["dreceiveddate"] : new Date()}
                                />
                            </Col>
                            <Col md={6}>
                                <FormSelectSearch
                                    name={"ntzdreceivedate"}
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    options={timezone}
                                    optionId="ntimezonecode"
                                    optionValue="stimezoneid"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["ntzdreceivedate"] : []}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["ntzdreceivedate"] : []}
                                    isMandatory={true}
                                    isSearchable={true}
                                    isClearable={false}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                    isDisabled={diableAllStatus === recordStatus}
                                    onChange={(value) => this.props.onComboChange(value, 'ntzdreceivedate')}
                                />
                            </Col>

                            <Col md={12}>
                                {/* Container */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_CONTAINERTYPE" })}
                                    isSearchable={true}
                                    name={"ncontainertypecode"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={false}
                                    isClearable={true}
                                    options={ContainerType}
                                    alphabeticalSort="true"
                                    optionId="ncontainertypecode"
                                    optionValue="ssuppliername"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["ncontainertypecode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["ncontainertypecode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'ncontainertypecode')}>
                                </FormSelectSearch>

                                {/* OUR File Code*/}
                                <FormInput
                                    name="sourfile"
                                    label={this.props.intl.formatMessage({ id: "IDS_OURFILECODE" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_OURFILECODE" })}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sourfile"] : ""}
                                    type="text"
                                    maxLength="100"
                                    isMandatory={false}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    isDisabled={diableAllStatus === recordStatus}
                                />

                                {/* OUR File Code*/}
                                <FormInput
                                    name="sbatchno"
                                    label={this.props.intl.formatMessage({ id: "IDS_BATCHNO" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_BATCHNO" })}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sbatchno"] : ""}
                                    type="text"
                                    maxLength="100"
                                    isMandatory={false}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    isDisabled={diableAllStatus === recordStatus}
                                />

                                {/* OUR File Code*/}
                                <FormInput
                                    name="slotno"
                                    label={this.props.intl.formatMessage({ id: "IDS_LOTNO" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_LOTNO" })}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["slotno"] : ""}
                                    type="text"
                                    maxLength="100"
                                    isMandatory={false}
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    isDisabled={diableAllStatus === recordStatus}
                                />

                                {/* Disposition */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_DISPOSITION" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={true}
                                    name={"ndisposition"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    isMandatory={true}
                                    options={Disposition}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["ndisposition"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["ndisposition"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'ndisposition')}>
                                </FormSelectSearch>
                            </Col>
                            <Col md={6}>
                                <FormNumericInput
                                    label={this.props.intl.formatMessage({ id: "IDS_TOTALQUANTITY" })}
                                    name="stotalqty"
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_TOTALQUANTITY" })}
                                    type="number"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["stotalqty"] : ""}
                                    min={0}
                                    strict={true}
                                    maxLength={8}
                                    onChange={(event) => this.props.onNumericInputChange(event, "stotalqty")}
                                    noStyle={true}
                                    precision={2}
                                    className="form-control"
                                    isMandatory={true}
                                    errors="Please provide a valid number."
                                    isDisabled={diableAllStatus === recordStatus}
                                />
                            </Col>
                            <Col md={6}>
                                {/* Disposition */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_UNIT" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={true}
                                    name={"ntotalunitcode"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    isMandatory={true}
                                    options={Unit}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["ntotalunitcode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["ntotalunitcode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'ntotalunitcode')}>
                                </FormSelectSearch>
                            </Col>
                            <Col md={12}>
                                {/* Disposition */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_PRIORITY" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={true}
                                    name={"npriority"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    isMandatory={true}
                                    options={Priority}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["npriority"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["npriority"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'npriority')}>
                                </FormSelectSearch>
                            </Col>
                            <Col md={6}>
                                <FormNumericInput
                                    label={this.props.intl.formatMessage({ id: "IDS_DEADLINE" })}
                                    name="sdeadline"
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_DEADLINE" })}
                                    type="number"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sdeadline"] : ""}
                                    min={0}
                                    strict={true}
                                    maxLength={8}
                                    onChange={(event) => this.props.onNumericInputChange(event, "sdeadline")}
                                    noStyle={true}
                                    precision={0}
                                    className="form-control"
                                    isMandatory={false}
                                    errors="Please provide a valid number."
                                    isDisabled={diableAllStatus === recordStatus}
                                />
                            </Col>
                            <Col md={6}>
                                {/* Disposition */}
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_PERIOD" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isSearchable={true}
                                    isClearable={true}
                                    name={"nperiodconfigcode"}
                                    isDisabled={diableAllStatus === recordStatus}
                                    isMandatory={false}
                                    options={Period}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nperiodconfigcode"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nperiodconfigcode"] : ""}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'nperiodconfigcode')}>
                                </FormSelectSearch>
                            </Col>
                            <Col md={12}>
                                {/* Remarks */}
                                <FormTextarea
                                    label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                    name="sremarks"
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sremarks"] : ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={255}
                                    row={2}
                                />
                                {/* Report Remarks */}
                                <FormTextarea
                                    label={this.props.intl.formatMessage({ id: "IDS_REPORTREMARKS" })}
                                    name="sreportremarks"
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_REPORTREMARKS" })}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sreportremarks"] : ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={255}
                                    row={2}
                                />
                                {/* Deviation Comments */}
                                <FormTextarea
                                    label={this.props.intl.formatMessage({ id: "IDS_DEVIATIONCOMMENTS" })}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_DEVIATIONCOMMENTS" })}
                                    name="sdeviationcomments"
                                    type="text"
                                    onChange={(event) => this.props.onInputOnChange(event)}
                                    value={this.props.selectedRecord ? this.props.selectedRecord["sdeviationcomments"] : ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={255}
                                    row={2}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {this.props.operation === 'create' ? 
                <Row>
                    <Col md={12} className="p-0">
                        <div className="actions-stripe">
                            <div className="d-flex justify-content-end">
                                <HeaderSpan> <FormattedMessage id='IDS_TEST' defaultMessage='Test' /></HeaderSpan>
                                <Nav.Link className="add-txt-btn text-right" onClick={() => this.props.addComponentTest(this.props.selectedComponent)} >
                                    <FontAwesomeIcon icon={faPlus} /> { }
                                    <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                                </Nav.Link>
                            </div>
                        </div>

                        <DataGrid
                            key="ntestgrouptestcode"
                            primaryKeyField="ntestgrouptestcode"
                            selectedId={this.state.selectedTestItem.ntestgrouptestcode}
                            // data={selectedTest}
                            dataResult={process(selectedTest || [], this.props.popUptestDataState||{skip:0,take:10})}
                            dataState={this.props.popUptestDataState||{skip:0,take:10}}
                            dataStateChange={this.props.testdataStateChange}
                            extractedColumnList={testColumnList}
                            controlMap={new Map()}
                            userRoleControlRights={this.props.userRoleControlRights}
                            hasControlWithOutRights={true}
                            inputParam={this.props.inputParam}
                            userInfo={this.props.userInfo}
                            pageable={true}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            // handleRowClick={this.handleRowClick}
                            methodUrl="PopUp"
                            gridHeight={"400px"}
                            deleteRecordWORights={this.props.deleteTest}
                            showdeleteRecordWORights={true}
                            showeditRecordWORights={false}
                        >
                        </DataGrid>
                    </Col>
                </Row>
                :""}
            </>
        );
    }
}
export default injectIntl(PreRegisterRoutine);