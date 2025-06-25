import React, { Component } from 'react';
//import react, {useState, useEffect, useRef} from "react";
import { Row, Col, Nav, FormGroup, FormLabel, Button } from 'react-bootstrap';
import { HeaderSpan } from './registration.styled';
import './registration.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import DataGrid from '../../components/data-grid/data-grid.component';
import DynamicSlideout from '../dynamicpreregdesign/DynamicSlideout';
import { ReadOnlyText } from '../../components/App.styles';
//import ReactTooltip from 'react-tooltip';
import SplitterLayout from 'react-splitter-layout';
import Site from '../basemaster/Site';
import SiteScheduler from '../Scheduler/SiteScheduler';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import SchedulerMasterCombo from '../Scheduler/SchedulerMasterCombo';
import { formCode ,SampleType ,transactionStatus ,schedulerConfigType} from '../../components/Enumeration';


class RegisterSlideOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            splitChangeWidthPercentage: 50.6,
        }
    }
    paneSizeChange = (d) => {
        this.setState({
            splitChangeWidthPercentage: d
        })
    }

    formCallback = (height) => {
        if (height !== this.state.formWrapheight) {
            this.setState({ formWrapheightDisable: true })
            // retriggering the splitter layout to get the latest height
            this.setState({
                formWrapheight: height,
                formWrapheightDisable: false
            });
        }
    }

    render() {
       // console.log("RegiterSlideoutmodal",this.props.selectedRecord);
        const testColumnList = [

            { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", width: "200px" },
            { "idsName": "IDS_SECTION", "dataField": "ssectionname", width: "150px" },
            { "idsName": "IDS_METHOD", "dataField": "smethodname", width: "150px" },
            { "idsName": "IDS_INSTRUMENTCATEGORY", "dataField": "sinstrumentcatname", width: "200px" }
        ]



        // const [height, setHeight] = useState(0)
        // const refDiv = useRef(null)

        // useEffect(() => {
        //     setHeight(refDiv.current.clientHeight)
        // })
        //console.log("this.props.sampleType:", this.props.sampleType, this.props.comboComponents);

        return (
            <>
                {this.props.loadPreregister ?
                    <>
                {
                                         this.props.userInfo.nformcode===formCode.SCHEDULERCONFIGURATION && this.props.sampleType.value===SampleType.INSTRUMENT?
                                        <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                        isSearchable={true}
                                        name={"SchedulerSite"}
                                        isDisabled={ false}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={this.props.siteList}
                                        value={this.props.selectedRecord["SchedulerSite"] || ""}
                                        defaultValue={this.props.selectedRecord["SchedulerSite"]}
                                        onChange={(event) => this.props.onComboChange(event, "SchedulerSite","SchedulerSite")}
                                        closeMenuOnSelect={true}
                                        >
                                        </FormSelectSearch>
                                        :""
                                        }
                                                {
                                        this.props.selectedSample.nschedulerconfigtypecode===schedulerConfigType.EXTERNAL?

                                        <SchedulerMasterCombo
                                        schedulerList={this.props.schedulerList}
                                        scheduleMasterDetails={this.props.scheduleMasterDetails}
                                        selectedRecord={this.props.selectedRecord}
                                        formatMessage={this.props.intl.formatMessage}
                                        onSchedulerComboChange={this.props.onSchedulerComboChange}
                                        userInfo={this.props.userInfo}

                                        />    
                                :""
                                            }

                        <DynamicSlideout
                            siteList={this.props.siteList}
                            selectedRecord={this.props.selectedRecord}
                            templateData={this.props.templateData}
                            handleChange={this.props.handleChange}
                            handleDateChange={this.props.handleDateChange}
                            onInputOnChange={this.props.onInputOnChange}
                            onNumericInputChange={this.props.onNumericInputChange}
                            comboData={this.props.comboData}
                            onComboChange={this.props.onComboChange}
                            userInfo={this.props.userInfo}
                            timeZoneList={this.props.timeZoneList}
                            defaultTimeZone={this.props.defaultTimeZone}
                            editfield={this.props.editfield}
                            enableCallback={true}
                            triggerCallback={this.formCallback}
                            selectedSample={this.props.selectedSample}
                            custombuttonclick={this.props.custombuttonclick}
                            onNumericBlur={this.props.onNumericBlur}
                            addMasterRecord={this.props.addMasterRecord}
                            editMasterRecord={this.props.editMasterRecord}
                            userRoleControlRights={this.props.userRoleControlRights1}
                            onClickView={this.props.onClickView}
                            operation={this.props.operation}
                            sampleType={this.props.sampleType}
                            comboComponents={this.props.comboComponents}
                            onDropFile={this.props.onDropFile}
                            deleteAttachment={this.props.deleteAttachment}
                        />
                        <Row>
                            <Col md={12} className="p-0">
                                <div className="actions-stripe">
                                    <div className="d-flex justify-content-end">
                                        <HeaderSpan className='pl-3'>
                                            <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' /></HeaderSpan>
                                        {this.props.operation === "create" ?
                                        // this.props.ntestgroupspecrequired === false ? <br/> :   //ALPD-4834, Vishakh, Added condition to show or hide add spec button
                                            <Nav.Link className="add-txt-btn text-right"
                                                // onClick={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? (e) => this.props.addComponentTest(e) : (e) => this.props.AddComponent(e)} 
                                                onClick={(e) => this.props.AddSpec(e)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} /> { }{ }
                                                <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' />
                                            </Nav.Link> 
                                            :
                                            // this.props.ntestgroupspecrequired === false ? <br/> :   //ALPD-4834, Vishakh, Added condition to show or hide add spec button
                                            <Nav.Link className="add-txt-btn text-right"
                                                // onClick={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? (e) => this.props.addComponentTest(e) : (e) => this.props.AddComponent(e)} 
                                                onClick={(e) => this.props.AddSpec(e)}
                                            >
                                                <div>
                                                    {" "}
                                                </div>
                                                {""}
                                            </Nav.Link>
                                            }
                                    </div>
                                </div>
                            </Col>
                            <Col md={12}>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_SPECIFICATION" message="Specification" /></FormLabel>
                                            <ReadOnlyText>{this.props.selectedSpec["nallottedspeccode"] && this.props.selectedSpec["nallottedspeccode"].label}</ReadOnlyText>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_VERSION" message="Version" /></FormLabel>
                                            <ReadOnlyText>
                                                {this.props.selectedSpec && this.props.selectedSpec["sversion"]}
                                            </ReadOnlyText>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                    :
                    !this.state.formWrapheightDisable ?
                        <SplitterLayout borderColor="#999"
                            primaryIndex={1}
                            secondaryInitialSize={this.state.formWrapheight}
                            primaryMinSize={40}
                            vertical
                            customClassName=" p-3 no-border-pane no-height -c-pd-t-1  primary-pane-top"
                        >
                            <Row>
                                {/* <Col md={12} className="p-0">
                                    <Nav.Link className="add-txt-btn text-right"
                                            onClick={this.props.addPatient}
                                        >
                                        <FontAwesomeIcon icon={faPlus} /> { }{ }
                                        <FormattedMessage id='IDS_PATIENT' defaultMessage='Patient' />
                                    </Nav.Link>
                                </Col> */}
                                {/* </Row>
                            <Row> */}
                                <Col md={12} className="p-0">

                                        {
                                            this.props.userInfo.nformcode===formCode.SCHEDULERCONFIGURATION && this.props.sampleType.value===SampleType.INSTRUMENT?
                                        <FormSelectSearch
                                        formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                                        isSearchable={true}
                                        name={"SchedulerSite"}
                                        isDisabled={ false}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={true}
                                        isClearable={false}
                                        options={this.props.siteList}
                                        value={this.props.selectedRecord["SchedulerSite"] || ""}
                                        defaultValue={this.props.selectedRecord["SchedulerSite"]}
                                        onChange={(event) => this.props.onComboChange(event, "SchedulerSite","SchedulerSite")}
                                        closeMenuOnSelect={true}
                                        >
                                        </FormSelectSearch>
                                        :""
                                        }
                                                {
                                        this.props.nschedulerconfigtypecode==schedulerConfigType.EXTERNAL?

                                        <SchedulerMasterCombo
                                        schedulerList={this.props.schedulerList}
                                        scheduleMasterDetails={this.props.scheduleMasterDetails}
                                        selectedRecord={this.props.selectedRecord}
                                        formatMessage={this.props.intl.formatMessage}
                                        onSchedulerComboChange={this.props.onSchedulerComboChange}
                                        userInfo={this.props.userInfo}

                                        />    
                                :""
                                            }
                                   
                            
                                    <DynamicSlideout
                                        // ref={refDiv}
                                        selectedRecord={this.props.selectedRecord}
                                        templateData={this.props.templateData}
                                        handleChange={this.props.handleChange}
                                        handleDateChange={this.props.handleDateChange}
                                        onInputOnChange={this.props.onInputOnChange}
                                        onNumericInputChange={this.props.onNumericInputChange}
                                        comboData={this.props.comboData}
                                        onComboChange={this.props.onComboChange}
                                        userInfo={this.props.userInfo}
                                        timeZoneList={this.props.timeZoneList}
                                        defaultTimeZone={this.props.defaultTimeZone}
                                        enableCallback={true}
                                        triggerCallback={this.formCallback}
                                        selectedSample={this.props.selectedSample}
                                        custombuttonclick={this.props.custombuttonclick}
                                        onNumericBlur={this.props.onNumericBlur}
                                        addMasterRecord={this.props.addMasterRecord}
                                        editMasterRecord={this.props.editMasterRecord}
                                        userRoleControlRights={this.props.userRoleControlRights1}
                                        onClickView={this.props.onClickView}
                                        sampleType={this.props.sampleType}
                                        comboComponents={this.props.comboComponents}
                                        onDropFile={this.props.onDropFile}
                                        deleteAttachment={this.props.deleteAttachment}
                                    />
                                </Col>
                            </Row>
                            <Row noGutters={true}>
                                {/* <Row noGutters={true}> */}

                                <Col md={12} className="p-0">
                                    <div className="actions-stripe">
                                        {/* <div className="d-flex justify-content-between"> */}
                                        <div className="d-flex justify-content-end">
                                            <HeaderSpan>
                                                <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' /></HeaderSpan>
                                            {this.props.operation === "create" ?
                                                <>
                                                {
                                                // this.props.ntestgroupspecrequired === false ? <br/>    //ALPD-4834, Vishakh, Added condition to show or hide add spec button :
                                                <Nav.Link className="add-txt-btn text-right"
                                                // onClick={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? (e) => this.props.addComponentTest(e) : (e) => this.props.AddComponent(e)} 
                                                    onClick={(e) => this.props.AddSpec(e)}
                                                >
                                                <FontAwesomeIcon icon={faPlus} /> { }{ }
                                                <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' />
                                                </Nav.Link> }
                                                    
                                                    {this.props.importData ?
                                                    <>
                                                   <Button className="btn btn-circle outline-grey" variant="link"
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_IMPORT" })}
                                                        // data-for="tooltip-grid-wrap"
                                                        onClick={(event) => this.props.AddImportFile(event)}>
                                                        <FontAwesomeIcon icon={faFileImport} />
                                                        </Button>
                                                        <Nav.Link className="btn btn-circle outline-grey" variant="link"
                                                        data-tip={this.props.intl.formatMessage({ id: "IDS_SAMPLECOUNT" })}
                                                        // data-for="tooltip-grid-wrap"
                                                        onClick={(event) => this.props.AddSampleCount(event)}>
                                                        <FontAwesomeIcon icon={faFileImport} />
                                                        </Nav.Link>
                                                    </>:""}
                                                </>
                                                : ""}
                                        </div>
                                    </div>
                                </Col>


                                {/* <Col md={12} className="actioncolor">
                        <ProductList className="d-flex justify-content-end dropdown badget_menu hideboxshadow">
                            <CustomSwitch
                                name={"ntransactionstatus"}
                                type="switch"
                                parentClassName="customswitchcss"
                                labelClassName={"mb-0 paddingleft5"}
                                label={"IDS_ALLTEST"}
                                placeholder={this.props.formatMessage({ id: "IDS_ALLTEST" })}
                                defaultValue={this.props.selectedRecord["ntransactionstatus"] === 3 ? true : false}
                                isMandatory={false}
                                required={false}
                                checked={this.props.selectedRecord["ntransactionstatus"] === 3 ? true : false}
                                onChange={(event) => this.props.onInputOnChange(event)}
                            />
                            <ReactTooltip place="bottom" globalEventOff='click' />
                            <Nav.Link className="btn btn-circle mr-2 mt-2 action-icons-wrap iconsize iconmargin"
                                href="#"
                                data-tip={this.props.intl.formatMessage({ id: "IDS_GETCOMPONENTS" })}
                            >
                                <FontAwesomeIcon icon={faCartArrowDown} className="ActionIconColor"
                                    onClick={(event) => getComponent(event, this.props.selectedRecord)}
                                />
                            </Nav.Link>
                            <Nav.Link className="btn btn-circle mr-2 mt-2 action-icons-wrap iconsize iconmargin" href=""
                                data-tip={this.props.intl.formatMessage({ id: "IDS_IMPORTEXCEL" })}
                                hidden={false}>
                                <input type="file" style={{ display: "none" }} />
                                <FontAwesomeIcon icon={faFileImport} className="ActionIconColor" onClick={(event) => this.props.AddFile()}>
                                </FontAwesomeIcon>

                            </Nav.Link>
                        </ProductList>
                    </Col> */}
                                {/* </Row> */}
                                <Col md={12}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id="IDS_SPECIFICATION" message="Specification" /></FormLabel>
                                                <ReadOnlyText>{this.props.selectedSpec["nallottedspeccode"] && this.props.selectedSpec["nallottedspeccode"].label}</ReadOnlyText>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <FormLabel><FormattedMessage id="IDS_VERSION" message="Version" /></FormLabel>
                                                <ReadOnlyText>
                                                    {this.props.selectedSpec && this.props.selectedSpec["sversion"]}
                                                </ReadOnlyText>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                {/* {this.props.nneedsubsample === 4 ?
                    <Row>
                        <Col md={12} className="p-0">
                            <div className="actions-stripe">
                                <div className="d-flex justify-content-end">
                                    <HeaderSpan>
                                        <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' /></HeaderSpan>
                                    <Nav.Link className="add-txt-btn text-right"
                                        onClick={(e) => this.props.AddComponent(e)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> { }{ }
                                        <FormattedMessage id='IDS_COMPONENT' defaultMessage='Component' />
                                    </Nav.Link>
                                </div>
                            </div>
                            <DataGrid
                                key="slno"
                                primaryKeyField="slno"
                                selectedId={this.props.selectedComponent ? this.props.selectedComponent.slno : null}
                                dataResult={process(this.props.Component || [], this.props.componentDataState)}
                                dataState={this.props.componentDataState}
                                dataStateChange={this.props.componentDataStateChange}
                                extractedColumnList={this.props.componentColumnList}
                                controlMap={this.props.controlMap}
                                userRoleControlRights={this.props.userRoleControlRights}
                                hasControlWithOutRights={true}
                                inputParam={this.props.inputParam}
                                userInfo={this.props.userInfo}
                                pageable={true}
                                scrollable={"scrollable"}
                                isActionRequired={true}
                                handleRowClick={this.props.handleComponentRowClick}
                                methodUrl="PopUp"
                                gridHeight={"350px"}
                                editRecordWORights={this.props.editComponent}
                                deleteRecordWORights={this.props.deleteComponent}
                                showdeleteRecordWORights={true}
                                showeditRecordWORights={true}
                            >
                            </DataGrid>
                        </Col>

                    </Row>
                    : ""} */}
                                <Row noGutters={true}>

                                    {this.props.nneedsubsample ?
                                        <Col md={6}>
                                            <div className="actions-stripe">
                                                {/* <div className="d-flex justify-content-between"> */}
                                                <div className="d-flex justify-content-end">
                                                    <HeaderSpan> <FormattedMessage id='IDS_SUBSAMPLE' defaultMessage='Sub Sample' /></HeaderSpan>
                                                    <Nav.Link className="add-txt-btn text-right" onClick={(e) => this.props.addsubSample(this.props.specBasedComponent, this.props.specBasedTestPackage)} >
                                                        <FontAwesomeIcon icon={faPlus} /> { }
                                                        <FormattedMessage id='IDS_SUBSAMPLE' defaultMessage='Sub Sample' />
                                                    </Nav.Link>
                                                </div>
                                            </div>
                                            <DataGrid
                                                key="slno"
                                                primaryKeyField="slno"
                                                selectedId={this.props.selectedComponent ?
                                                    this.props.selectedComponent.slno : null}
                                                data={this.props.subSampleDataGridList}
                                                dataResult={process(this.props.subSampleDataGridList || [],
                                                    this.props.subSampleDataState)}
                                                dataState={this.props.subSampleDataState}
                                                dataStateChange={this.props.subSampleDataStateChange}
                                                extractedColumnList={this.props.subSampleDataGridFields}
                                               // detailedFieldList={this.props.subSampleDataDetailGridList}
                                                controlMap={this.props.controlMap}
                                                userRoleControlRights={this.props.userRoleControlRights}
                                                hasControlWithOutRights={true}
                                                inputParam={this.props.inputParam}
                                                userInfo={this.props.userInfo}
                                                pageable={true}
                                                scrollable={"scrollable"}
                                                isActionRequired={true}
                                                handleRowClick={this.props.handleComponentRowClick}
                                                methodUrl="PopUp"
                                                gridHeight={"400px"}
                                                editRecordWORights={(inputParam) => this.props.editSubSample(inputParam, this.props.specBasedComponent)}
                                                deleteRecordWORights={this.props.deleteComponent}
                                                showdeleteRecordWORights={true}
                                                showeditRecordWORights={false}
                                                //  isActionRequired={true}
                                                jsonField={'jsondata'}
                                               //expandField="expanded"

                                            // hideColumnFilter={true}
                                            // handleRowClick={this.props.selectSubSample}
                                            />
                                        </Col> : ""}
                                    <Col md={this.props.nneedsubsample ? 6 : 12}>
                                        <div className="actions-stripe">
                                            {/* <div className="d-flex justify-content-between"> */}
                                            <div className="d-flex justify-content-end">
                                                <HeaderSpan> <FormattedMessage id='IDS_TEST' defaultMessage='Test' /></HeaderSpan>
                                                <Nav.Link className="add-txt-btn text-right" onClick={() => this.props.addTest(this.props.selectedComponent,
                                                    this.props.nneedsubsample, this.props.specBasedComponent)} >
                                                    <FontAwesomeIcon icon={faPlus} /> { }
                                                    <FormattedMessage id='IDS_TEST' defaultMessage='Test' />
                                                </Nav.Link>
                                            </div>
                                        </div>
                                        <DataGrid
                                            key="ntestgrouptestcode"
                                            primaryKeyField="ntestgrouptestcode"
                                            selectedId={null}//this.state.selectedTestItem.ntestgrouptestcode
                                            data={this.props.SelectedTest}
                                            dataResult={process(this.props.SelectedTest || [], this.props.testDataState)}
                                            dataState={this.props.testDataState}
                                            dataStateChange={this.props.testDataStateChange}
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
                                            //expandField="expanded"
                                        // hideColumnFilter={true}

                                        />
                                    </Col>

                                </Row>
                            </Row>
                        </SplitterLayout>

                        : ""
                }
            </>
        );
    }



}

export default injectIntl(RegisterSlideOut)
