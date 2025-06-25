import React, { Component } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import { TreeDesign, HeaderSpan } from './registration.styled';
import './registration.css'
import { ProductList } from '../product/product.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faFileImport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
//import { Tooltip } from '@progress/kendo-react-tooltip';
// import ReactTooltip from 'react-tooltip';
import { process } from '@progress/kendo-data-query';
import MultiColumnComboSearch from '../../components/multi-column-combo-search/multi-column-combo-search';


import CustomSwitch from '../../components/custom-switch/custom-switch.component';

import { toast } from 'react-toastify';

import FormTreeMenu from '../../components/form-tree-menu/form-tree-menu.component';
import DataGrid from '../../components/data-grid/data-grid.component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { RegistrationSubType, RegistrationType } from '../../components/Enumeration';
//import { Label } from 'reactstrap';


class PreRegisterPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTestItem: [],
            selectedSourceItem: [],
            selectedTest: []
        }
    }

    render() {
        const getComponent = (event, selectedRecord) => {
            let booleanFlag = true
            if (this.props.RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL) {
                if (selectedRecord.nmanufcode === undefined) {
                    booleanFlag = false;
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTMANUFACTURER" }));
                }
            }
            if (booleanFlag) {
                if (selectedRecord.nallottedspeccode !== undefined && selectedRecord.nallottedspeccode !== "") {
                    if (this.props.Component.length > 0) {
                        this.props.ConfirmComponent(selectedRecord);
                    } else {
                        this.props.getComponentfromJava(selectedRecord) 
                    }

                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTSPECIFICATION" })); //"Select Specification"
                }
            }

        }
        // const BatchColumnList = [
        //     { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
        //     { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
        //     { "idsName": "IDS_STORAGECONDITION", "dataField": "sstorageconditionname", width: "150px" },
        //     { "idsName": "IDS_STORAGELOCATION", "dataField": "sstoragelocationname", width: "150px" },
        //     { "idsName": "IDS_NOOFCONTAINER", "dataField": "nnoofcontainer", width: "150px" },
        //     { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", width: "200px" },
        //     { "idsName": "IDS_COMMENTS", "dataField": "scomments", width: "200px" },
        // ];
        const testColumnList = [
            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", width: "200px" },
            { "idsName": "IDS_SECTION", "dataField": "ssectionname", width: "150px" },
            { "idsName": "IDS_SOURCE", "dataField": "ssourcename", width: "150px" },
            { "idsName": "IDS_METHOD", "dataField": "smethodname", width: "150px" },
            { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", width: "200px" }]
        // const plasmaColumnList = [
        //     { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
        //     { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
        //     { "idsName": "IDS_NOOFCONTAINER", "dataField": "nnoofcontainer", width: "150px" },
        //     { "idsName": "IDS_POOL/BULKVOLUME", "dataField": "spoolbulkvolume", width: "200px" },
        //     { "idsName": "IDS_PLASMAFILENUMBER", "dataField": "splasmafilenumber", width: "200px" },
        // ];
        // const externalColumnList = [
        //     { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
        //     { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
        //     { "idsName": "IDS_DATERECEIVED", "dataField": "dreceiveddate", width: "200px" },
        //     { "idsName": "IDS_COMMENTS", "dataField": "scomments", width: "200px" },
        // ];
        const countryColumnList = [
            { "idsName": "IDS_SOURCE", "dataField": "scountryname", width: "150px" }
        ];
        const { ProductCategory, Product, Goodsin, EProtocol, Manufacturer, Specification, Component,
            selectedTest, Client, RealRegTypeValue,
            RealRegSubTypeValue, SelectedSource, ProductMaholder, OpenNodes, FocusKey, ActiveKey } = this.props;

            if(this.props && this.props.AgaramTree && this.props.AgaramTree.length > 0){
                this.props.AgaramTree[0]["label"] = this.props.AgaramTree[0]["label"] === 'root' ? 
                this.props.intl.formatMessage({ id: "IDS_ROOT" }) : this.props.AgaramTree[0]["label"];
            }
        return (
            <>
                <Row>
                    <Col md={6}>
                        {(RealRegSubTypeValue.nregsubtypecode !== RegistrationSubType.PROTOCOL && RealRegSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL) &&
                            <Col md={12}>
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_RMSNO" })}
                                    isSearchable={true}
                                    name={"nrmsno"}
                                    isDisabled={false}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    options={Goodsin}
                                    alphabeticalSort="true"
                                    optionId="nrmsno"
                                    optionValue="nrmsno"
                                    value={this.props.selectedRecord ? this.props.selectedRecord["nrmsno"] : ""}
                                    defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nrmsno"] : ""}
                                    //  showOption={true}
                                    closeMenuOnSelect={true}
                                    onChange={(event) => this.props.onComboChange(event, 'nrmsno')}>
                                </FormSelectSearch>
                            </Col>
                        }
                        <Col md={12}>

                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORY" })}
                                isSearchable={true}
                                name={"nproductcatcode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={ProductCategory}
                                alphabeticalSort="true"
                                optionId="nproductcatcode"
                                optionValue="sproductcatname"
                                value={this.props.selectedRecord ? this.props.selectedRecord["nproductcatcode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nproductcatcode"] : ""}
                                //  showOption={true}
                                closeMenuOnSelect={true}
                                onChange={(event) => this.props.onproductCategoryChange(event, 'nproductcatcode')}>
                            </FormSelectSearch>
                        </Col>
                        <Col md={12}>

                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                                isSearchable={true}
                                name={"nproductcode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={Product}
                                alphabeticalSort="true"
                                optionId="nproductcode"
                                optionValue="sproductname"
                                value={this.props.selectedRecord ? this.props.selectedRecord["nproductcode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nproductcode"] : ""}
                                //  showOption={true}
                                closeMenuOnSelect={true}
                                onChange={(event) => this.props.onProductChange(event, 'nproductcode')}>
                            </FormSelectSearch>
                        </Col>
                        <Col md={12} >

                            <MultiColumnComboSearch data={Manufacturer}
                                visibility='show-all'
                                labelledBy="IDS_MANUFNAME"
                                fieldToShow={["smanufname", "smanufsitename", "seprotocolname"]}
                                selectedId={[this.props.selectedRecord["nmanufcode"]]}
                                value={this.props.selectedRecord ? [this.props.selectedRecord] : []}
                                isMandatory={true}
                                showInputkey="smanufname"
                                idslabelfield={["IDS_MANUFACTURERNAME", "IDS_SITENAME", "IDS_EPROTOCOL"]}
                                getValue={(value) => this.props.onMultiColumnValue(value, ["nproductmanufcode", "nmanufcode", "nmanufsitecode", "smanufname", "smanufsitename"], true, ["seprotocolname"], ["neprotocolcode"])}
                                singleSelection={true}
                            />

                            {/* <MultiColumnComboSearch
                                data={Manufacturer}
                                alphabeticalSort="true"
                                labelledBy="IDS_MANUFACTURERNAME"
                                fieldToShow={["smanufname", "smanufsitename", "seprotocolname"]}
                                idslabelfield={["IDS_MANUFACTURERNAME", "IDS_SITENAME", "IDS_EPROTOCOL"]}
                                showInputkey="smanufname"
                                value={this.props.selectedRecord["smanufname"] || ""}
                                onMultiColumnValue={(value) => this.props.onMultiColumnValue(value, ["nmanufcode", "nmanufsitecode", "smanufname", "smanufsitename"], true, ["seprotocolname"], ["neprotocolcode"])}
                            /> */}
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_MANUFACTURERSITE" })}
                                name="smanufsitename"
                                type="text"
                                maxLength="100"
                                isMandatory={true}
                                value={this.props.selectedRecord["smanufsitename"] || []}
                                onChange={(event) => this.props.onInputOnChange(event)}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_MANUFACTURERSITE" })}
                                isDisabled={true}
                            />
                        </Col>
                        <Col md={12}>

                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_EPROTOCOL" })}
                                isSearchable={true}
                                name={"neprotocolcode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={false}
                                options={EProtocol}
                                alphabeticalSort="true"
                                optionId="neprotocolcode"
                                optionValue="seprotocolname"
                                value={this.props.selectedRecord ? this.props.selectedRecord["neprotocolcode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["neprotocolcode"] : ""}
                                //  showOption={true}
                                closeMenuOnSelect={true}
                                onChange={(event) => this.props.onComboChange(event, 'neprotocolcode')}>
                            </FormSelectSearch>
                        </Col>

                        {RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL &&
                            <>
                                <Col md={12}>
                                    <MultiColumnComboSearch data={ProductMaholder}
                                        visibility='show-all'
                                        labelledBy="IDS_MAHOLDERNAME"
                                        fieldToShow={["smahname", "slicencenumber", "sdosagepercontainer"]}
                                        selectedId={[this.props.selectedRecord["nproductmahcode"]]}
                                        value={this.props.selectedRecord ? [this.props.selectedRecord] : []}
                                        showInputkey="smahname"
                                        idslabelfield={["IDS_MAHNAME", "IDS_LICENSENUMBER", "IDS_DOSAGEPERCONTAINER"]}
                                        getValue={(value) => this.props.onMultiColumnMAHChange(value, ["nproductmahcode", "smahname"])}
                                        singleSelection={true}
                                    />
                                </Col>
                            </>
                        }
                          {RealRegTypeValue.nregtypecode === RegistrationType.NON_BATCH &&
                            <>
                                <Col md={12}>
                                    <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_CLIENTNAME" })}
                                        isSearchable={true}
                                        name={"nclientcode"}
                                        isDisabled={false}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={false}
                                        isClearable={true}
                                        options={Client}
                                        // alphabeticalSort="true"
                                        // optionId="nclientcode"
                                        // optionValue="sclientname"
                                        value={this.props.selectedRecord ? this.props.selectedRecord["nclientcode"] : ""}
                                        //defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nclientcode"] : ""}
                                        //  showOption={true}
                                        closeMenuOnSelect={true}
                                        onChange={(event) => this.props.onClientComboChange(event)}>
                                    </FormSelectSearch>
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                                        name="sclientsitename"
                                        type="text"
                                        maxLength="100"
                                        value={this.props.selectedRecord["saddress1"] || []}
                                        onChange={(event) => this.props.onInputOnChange(event)}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                                        isDisabled={true}
                                    />
                                </Col>
                            </>
                        }
                    </Col>
                    <Col md={6}>                      

                        <Col md={12} className="r_treepadding" >
                            <TreeDesign>

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
                        <Col md={12}>

                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_TESTGROUP" })}
                                isSearchable={true}
                                name={"nallottedspeccode"}
                                isDisabled={false}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_TESTGROUP" })}
                                isMandatory={true}
                                options={Specification}
                                alphabeticalSort="true"
                                optionId="nallottedspeccode"
                                optionValue="sspecname"
                                value={this.props.selectedRecord ? this.props.selectedRecord["nallottedspeccode"] : ""}
                                defaultValue={this.props.selectedRecord ? this.props.selectedRecord["nallottedspeccode"] : ""}
                                //  showOption={true}
                                closeMenuOnSelect={true}
                                onChange={(event) => this.props.onspecChange(event, ['nallottedspeccode', 'sversionno'])}>
                            </FormSelectSearch>
                        </Col>
                        <Col md={12}>
                            <FormInput
                                label={this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                                name="sversion"
                                type="text"
                                maxLength="100"
                                value={this.props.selectedRecord["sversion"] || []}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_VERSION" })}
                                isDisabled={true}
                            />
                        </Col>


                    </Col>
                    <Col md={12} className="actioncolor">
                        {/* <ProductList className="d-inline dropdown badget_menu actionfloat hideboxshadow"> */}
                        <ProductList className="d-flex justify-content-end dropdown badget_menu hideboxshadow">
                            <CustomSwitch
                                name={"ntransactionstatus"}
                                type="switch"
                                parentClassName="customswitchcss"
                                labelClassName={"mb-0 paddingleft5"}
                                label={this.props.intl.formatMessage({ id: "IDS_ALLTEST" })}
                                placeholder={this.props.formatMessage({ id: "IDS_ALLTEST" })}
                                defaultValue={this.props.selectedRecord["ntransactionstatus"] === 3 ? true : false}
                                isMandatory={false}
                                required={false}
                                checked={this.props.selectedRecord["ntransactionstatus"] === 3 ? true : false}
                                onChange={(event) => this.props.onInputOnChange(event)}
                            />
                            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                            {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                            <Nav.Link className="btn btn-circle mr-2 mt-2 action-icons-wrap iconsize iconmargin"
                                href="#" data-tip={this.props.intl.formatMessage({ id: "IDS_GETCOMPONENTS" })}>
                                <FontAwesomeIcon icon={faCartArrowDown} className="ActionIconColor" onClick={(event) => getComponent(event, this.props.selectedRecord)} />
                            </Nav.Link>
                            <Nav.Link className="btn btn-circle mr-2 mt-2 action-icons-wrap iconsize iconmargin" href=""
                                data-tip={this.props.intl.formatMessage({ id: "IDS_IMPORTEXCEL" })} hidden={false}>
                                <input type="file" style={{ display: "none" }} />
                                <FontAwesomeIcon icon={faFileImport} className="ActionIconColor" onClick={(event) => this.props.AddFile()}>
                                </FontAwesomeIcon>

                            </Nav.Link>
                            {/* </Tooltip> */}
                        </ProductList>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="p-0">
                        <div className="actions-stripe">
                            <div className="d-flex justify-content-end">
                                <HeaderSpan>
                                    <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' /></HeaderSpan>
                                <Nav.Link className="add-txt-btn text-right"
                                    // onClick={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? (e) => this.props.addComponentTest(e) : (e) => this.props.AddComponent(e)} 
                                    onClick={(e) => this.props.AddComponent(e)}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> { }{ }
                                    <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' />
                                </Nav.Link>
                            </div>
                        </div>
                        {/* <Col md={12} className="p-0" >
                            <HeaderSpan> 
                                <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' /></HeaderSpan>
                                <Nav.Link className="add-txt-btn text-right"
                                // onClick={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? (e) => this.props.addComponentTest(e) : (e) => this.props.AddComponent(e)} 
                                    onClick={(e) => this.props.AddComponent(e)}
                                >
                                <FontAwesomeIcon icon={faPlus} /> { }{ }
                                <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' />
                            </Nav.Link>
                        </Col>
                        <Col md={12} className="p-0"> */}
                        <DataGrid
                            key="slno"
                            primaryKeyField="slno"
                            selectedId={this.props.selectedComponent.slno}
                            // data={selectedTest}
                            dataResult={process(Component || [], this.props.componentDataState)}
                            dataState={this.props.componentDataState}
                            dataStateChange={this.props.componentDataStateChange}
                            extractedColumnList={this.columnlist(RealRegTypeValue, RealRegSubTypeValue, RegistrationType, RegistrationSubType)}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            hasControlWithOutRights={true}
                            inputParam={this.props.inputParam}
                            userInfo={this.props.userInfo}
                            pageable={true}
                            scrollable={"scrollable"}
                            isActionRequired={true}
                            plasmaMasterFile={this.props.plasmaMasterFile}
                            handleRowClick={this.props.selectComponent}
                            methodUrl="PopUp"
                            gridHeight={"350px"}
                            editRecordWORights={this.props.editComponent}
                            deleteRecordWORights={this.props.deleteComponent}
                            showdeleteRecordWORights={true}
                            showeditRecordWORights={true}
                        >
                        </DataGrid>
                        {/* </Col> */}
                    </Col>

                    <Col md={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? 8 : 12} className="p-0">
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
                            dataResult={process(selectedTest || [], this.props.popUptestDataState)}
                            dataState={this.props.popUptestDataState}
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


                    {RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL &&
                        <Col md={4}  >

                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    <HeaderSpan> <FormattedMessage id='IDS_SOURCE' defaultMessage='Source' /></HeaderSpan>
                                    <Nav.Link className="add-txt-btn text-right" onClick={() => this.props.addComponentSource(this.props.selectedComponent)} >
                                        <FontAwesomeIcon icon={faPlus} /> { }
                                        <FormattedMessage id='IDS_SOURCE' defaultMessage='IDS_SOURCE' />
                                    </Nav.Link>
                                </div>
                            </div>

                            <DataGrid
                                key="ncountrycode"
                                primaryKeyField="ncountrycode"
                                selectedId={this.state.selectedSourceItem.ncountrycode}
                                // data={selectedTest}
                                dataResult={process(SelectedSource || [],this.props.popUpsourceDataState)}
                                dataState={this.props.popUpsourceDataState}
                                dataStateChange={this.props.popUpsourceDataStateChange}
                                extractedColumnList={countryColumnList}
                                controlMap={new Map()}
                                userRoleControlRights={this.props.userRoleControlRights}
                                hasControlWithOutRights={true}
                                inputParam={this.props.inputParam}
                                userInfo={this.props.userInfo}
                                pageable={false}
                                scrollable={"scrollable"}
                                isActionRequired={true}
                                handleRowClick={this.handleRowClick}
                                methodUrl="PopUp"
                                gridHeight={"400px"}
                                deleteRecordWORights={this.props.deleteSource}
                                showdeleteRecordWORights={true}
                                showeditRecordWORights={false}
                                actionColWidth={"100px"}
                            >
                            </DataGrid>
                        </Col>}
                </Row>
            </>
        );
    }

    columnlist = (RealRegTypeValue, RealRegSubTypeValue, RegistrationType, RegistrationSubType) => {
        let BatchColumnList = [];
        if (((RealRegTypeValue.nregtypecode === RegistrationType.BATCH && RealRegSubTypeValue.nregsubtypecode !== RegistrationSubType.PROTOCOL)
            || (RealRegTypeValue.nregtypecode === RegistrationType.NON_BATCH))) {
            BatchColumnList = [
                { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
                { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
                { "idsName": "IDS_STORAGECONDITION", "dataField": "sstorageconditionname", width: "150px" },
                { "idsName": "IDS_STORAGELOCATION", "dataField": "sstoragelocationname", width: "150px" },
                { "idsName": "IDS_NOOFCONTAINER", "dataField": "nnoofcontainer", width: "150px" },
                { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", width: "250px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", width: "200px" },
            ];


        } else if (RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL && RealRegSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL) {
            BatchColumnList = [
                { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
                { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
                { "idsName": "IDS_NOOFCONTAINER", "dataField": "nnoofcontainer", width: "150px" },
                { "idsName": "IDS_POOLBULKVOLUME", "dataField": "sbulkvolume", width: "200px" },
                { "idsName": "IDS_PLASMAFILENUMBER", "dataField": "splasmafilenumber", width: "200px" },
            ];

        } else if (RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.PROTOCOL || RealRegSubTypeValue.nregsubtypecode === RegistrationSubType.EXTERNAL_POOL) {
            BatchColumnList = [
                { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
                { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
                { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", width: "250px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", width: "200px" },
            ];
        } else {
            BatchColumnList = [
                { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", width: "200px" },
                { "idsName": "IDS_MANUFLOTNO", "dataField": "smanuflotno", width: "200px" },
                { "idsName": "IDS_NOOFCONTAINER", "dataField": "nnoofcontainer", width: "150px" },
                { "idsName": "IDS_POOLBULKVOLUME", "dataField": "sbulkvolume", width: "200px" },
                { "idsName": "IDS_PLASMAFILENUMBER", "dataField": "splasmafilenumber", width: "200px" },
            ];
        }

        return BatchColumnList;

    }
    // componentDidUpdate(previousProps) {
    //     if (this.state.selectedTest !== this.props.selectedTest) {
    //         this.setState({ selectedTestItem: this.props.selectedTest.length > 0 ? this.props.selectedTest[this.props.selectedTest.length - 1] : [], selectedTest: this.props.selectedTest });
    //     } else if (this.props.SelectedSource !== previousProps.SelectedSource) {
    //         this.setState({ selectedSourceItem: this.props.SelectedSource.length > 0 ? this.props.SelectedSource[this.props.SelectedSource.length - 1] : [], SelectedSource: this.props.SelectedSource });
    //     }
    // }
    // handleRowClick = (event) => {
    //     this.setState({ selectedTestItem: event.dataItem })
    // }
}

export default injectIntl(PreRegisterPopUp)
