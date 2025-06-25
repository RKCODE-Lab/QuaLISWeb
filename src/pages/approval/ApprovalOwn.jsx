import React, { Component } from 'react';
import { faBolt, faCheck, faThumbsUp, faPlus, faTrash, faPencilAlt,  faFileInvoice, faRedo, faRecycle, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Row, Dropdown, Form, FormControl, FormGroup, FormLabel, Image, InputGroup, ListGroup, Media, Nav } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ListWrapper } from '../../components/client-group.styles';
import { ProductList } from '../testmanagement/testmaster-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tabs, { TabPane } from "rc-tabs";
import { AtTabs } from '../../components/custom-tabs/custom-tabs.styles';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import filterIcon from '../../assets/image/filer-icon.svg';
import SplitPane from "react-splitter-layout";
import { ClientList, SearchAdd, MediaHeader, MediaSubHeader, MediaLabel, ContentPanel } from '../../components/App.styles';
import './result.css';
import ColumnMenu from '../../components/data-grid/ColumnMenu';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FilterAccordion from '../../components/custom-accordion/filter-accordion.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { LocalizationProvider } from '@progress/kendo-react-intl';

class resultentrybysample extends Component {
    constructor(props) {
        super(props)

        this.paramData = [
            { paramcode: 1,username:"Syed",date:"09/10/2020 10:20AM", arno: 'RM/0040/20', samplearno: 'RM/0040/20-001', testname: 'In vivo non lethal mouse local muscular paralysis assay (Botulinum)', paramname: 'Color Test', type: 'Numeric', final: 'Cloudy/white', result: 'Cloudy/white', flag: 'OOT', enforce: 'NO', remarks: '-' },
            { paramcode: 2,username:"Syed",date:"09/10/2020 11:20AM", arno: 'RM/0040/21', samplearno: 'RM/0040/21-001', testname: 'Factor VIII Potency', paramname: '9 rabbits', type: 'Numeric', final: '700', result: '700', flag: 'FYI', enforce: 'NO', remarks: '-' },
            { paramcode: 3,username:"Syed",date:"09/10/2020 12:20AM", arno: 'RM/0040/22', samplearno: 'RM/0040/22-001', testname: 'In vivo non lethal mouse local muscular paralysis assay (Botulinum)', paramname: '% to nominal', type: 'Predefined', final: '40', result: '40', flag: 'PASS', enforce: 'NO', remarks: '-' },
            { paramcode: 4,username:"Syed",date:"09/10/2020 01:20PM", arno: 'RM/0040/22', samplearno: 'RM/0040/22-002', testname: 'Factor VIII Potency', paramname: '220 kDa antigens', type: 'Predefined', final: 'yes', result: 'yes', flag: 'PASS', enforce: 'YES', remarks: '-' },
            { paramcode: 5,username:"Syed",date:"09/10/2020 02:20PM", arno: 'RM/0040/23', samplearno: 'RM/0040/23-001', testname: 'Factor VIII Potency', paramname: '% Fragments', type: 'Numeric', final: '20', result: '20', flag: 'PASS', enforce: 'YES', remarks: '-' },
            { paramcode: 6,username:"Syed",date:"09/10/2020 03:20PM", arno: 'RM/0040/23', samplearno: 'RM/0040/23-002', testname: 'Sialic Acid Content', paramname: '961c Relative Potency', type: 'Numeric', final: 'Identity with rCTB and CTB', result: 'Identity with rCTB and CTB', flag: 'PASS', enforce: 'NO', remarks: '-' },
            { paramcode: 7,username:"Syed",date:"09/10/2020 04:20PM", arno: 'RM/0040/23', samplearno: 'RM/0040/23-003', testname: 'Identity of Hib', paramname: '% Free Hib PRP ELISA', type: 'Character', final: 'num', result: 'num', flag: 'PASS', enforce: 'NO', remarks: '-' },

        ]
        this.detailedFieldList = [
            { "idsName": "Description", "dataField": "sdescription", "width": "15%" },
            { "idsName": "Attachment Type", "dataField": "sattachmenttype", "width": "10%" },
            { "idsName": "Date", "dataField": "ddate", "width": "10%" }
        ]
        
        this.attachmentData = [
            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "sfilename": "TestFile.pdf", "susername": "Syed", "sscreenname": "Result Entry By Sample", "sdescription": "This file is added for testing purpose",
                "sattachmenttype": "File", "ddate": "10/10/2020"
            },
            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "sfilename": "Resultexport.pdf", "susername": "Syed", "sscreenname": "Result Entry By Sample", "sdescription": "Result preferences",
                "sattachmenttype": "File", "ddate": "10/10/2020"
            },
            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "sfilename": "Spec document.pdf", "susername": "Satis patil", "sscreenname": "Sample Registration", "sdescription": "Result preferences",
                "sattachmenttype": "File", "ddate": "07/10/2020"
            },

            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "sfilename": "Training Agenda.pdf", "susername": "Syed", "sscreenname": "Sample Registration", "sdescription": "Result preferences",
                "sattachmenttype": "File", "ddate": "06/10/2020"
            },
            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "sfilename": "Checklist.pdf", "susername": "Syed", "sscreenname": "Sample Registration", "sdescription": "Result preferences",
                "sattachmenttype": "File", "ddate": "06/10/2020"
            },
        ];
        const commentsData = [
            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "scomments": "The Sample belongs to NIBSC which have 5 tests", "susername": "Syed", "sscreenname": "Registration", "sdescription": "This file is added for testing purpose",
                "ddate": "10/10/2020"
            },
            {
                "sarno": "RM/0040/20","ssarno":"RM/0040/20-001","testname":"Potency Rotavirus (Pentavalent)", "scomments": "All five tests are completed", "susername": "Syed", "sscreenname": "Result Entry By Sample", "sdescription": "Result preferences",
                "ddate": "10/10/2020"
            },
        ];

        this.state = {
            sampleDataState: { skip: 0, take: 10 },
            sampleAttachDataState: { skip: 0, take: 10 },
            sampleCommentDataState: { skip: 0, take: 10 },
            subSampleAttachDataState: { skip: 0, take: 10 },
            subSampleCommentDataState: { skip: 0, take: 10 },
            testAttachDataState: { skip: 0, take: 10 },
            testCommentDataState: { skip: 0, take: 10 },
            ResultDataState: { skip: 0, take: 10 },
            matDataState: { skip: 0, take: 10 },
            instDataState: { skip: 0, take: 10 },
            commonDataState: { skip: 0, take: 10 },
            result: this.paramData,
            editID: null,
            selectedSample: { preregno: 1, arno: '20200001', specname: 'Methane spec' },
            selectedSubSample: { samplecode: 1, arno: '20200001', samplearno: '20200001-001' },
            selectedTest: { testcode: 1, testname: 'In vivo non lethal mouse local muscular paralysis assay (Botulinum)', transcode: 23, teststatus: 'Accepted', transdate: '12-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'Plasma Pools' },
            attachmentData: this.attachmentData,
            commentsData:commentsData,
            isExpanded: false,
            viewScreen: false
        }
        this.formRef = React.createRef();
    }

    handleClose = () => {

        this.setState({ viewScreen: false });
    }

    createAppState(dataState) {
        const groups = dataState.group;
        if (groups) { groups.map(group => group.aggregates = this.aggregates); }

        return {
            dataState: dataState
        };
    }

    dataStateChange = (event) => {
        let dataState = event.data;
        let result = process(this.paramData, event.data)
        result = event.data.group && event.data.group.length > 0 ? result : result.data
        this.setState({ dataState, result });
    }
    resultdataStateChange= (event) => {
        let dataState = event.data;
        let result = process(this.paramData, event.data)
        result = event.data.group && event.data.group.length > 0 ? result : result.data
        this.setState({ ResultDataState:dataState, result });
    }
    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.setState({
            result: Object.assign({}, this.state.result),
            dataState: this.state.dataState
        });
    }
    rowClick = (event) => {
        let result = Array.isArray(this.state.result) ?
            this.state.result.map((item) =>
                ({ ...item, inEdit: item.paramcode === event.dataItem.paramcode }))
            : {
                data: this.state.result.data.map((resultset) =>
                    resultset = {
                        ...resultset,
                        items: [resultset.items.map((item) =>
                            ({ ...item, inEdit: item.paramcode === event.dataItem.paramcode }))]
                    }
                )
            }
        this.setState({
            editID: event.dataItem.paramcode, result
        });
    };

    itemChange = (event) => {
        //const inEditID = event.dataItem.paramcode;
        const result =
            Array.isArray(this.state.result) ?
                this.state.result.map((item) =>
                    ({ ...item, inEdit: item.paramcode === event.dataItem.paramcode }))
                : {
                    data: this.state.result.data.map((resultset) =>
                        resultset = {
                            ...resultset,
                            items: [resultset.items.map((item) =>
                                (item.paramcode === event.dataItem.paramcode ? { ...item, [event.field]: event.value } : item))]
                        }
                    )
                }
        this.setState({ result });
    };

    closeEdit = (event) => {
        if (event.target === event.currentTarget) {
            this.setState({ editID: null });
        }
    };
    toggleBtmHeight(topPaneHeight) {
        const maxHeight = 1000;
        const padding = 225;
        const btmPaneHeight = maxHeight - topPaneHeight - padding;
        this.setState({ btmHeight: btmPaneHeight + "px" });
    }

    detailBand = (props,detailedFieldList) => {
        return (
            <Row><Col md={12}>
                <Card>
                    <Card.Body><Row>
                        {detailedFieldList.map((item) => {
                            return (

                                <Col md={6}>
                                    <FormGroup>
                                        <FormLabel>{item.idsName} </FormLabel>
                                        <span className="readonly-text font-weight-normal">
                                            {props.dataItem[item.dataField] === null || props.dataItem[item.dataField].length === 0 ? '-' :
                                                props.dataItem[item.dataField]}
                                        </span>
                                    </FormGroup>
                                </Col>
                            )
                        })}
                    </Row>
                    </Card.Body>
                </Card>
            </Col> </Row>
        )
    }
    gridExpandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ isExpanded });
    }
    sampleGridExpandChange = (event) => {
        const isExpanded =event.dataItem.expanded?true:false;
        event.dataItem.expanded = !isExpanded;
        this.setState({ isExpanded });
    }
    columnProps(field) {
        return {
            field: field,
            columnMenu: ColumnMenu,
            headerClassName: 'active'
        };
    }

    resultModule = () => {
        this.setState({ viewScreen: true });
    }

    render() {
        
        const extractedAttachmentList = [
            { "idsName": "Ar.No", "dataField": "sarno", "width": "160px" },
            { "idsName": "File Name", "dataField": "sfilename", "width": "160px" },
            { "idsName": "User Name", "dataField": "susername", "width": "160px" },
            { "idsName": "Screen Name", "dataField": "sscreenname", "width": "160px" }

        ];
        const extractedCommentList=[
            { "idsName": "Ar.No", "dataField": "sarno", "width": "160px" },
            { "idsName": "Comment", "dataField": "scomments", "width": "160px" },
            { "idsName": "User Name", "dataField": "susername", "width": "160px" },
            { "idsName": "Screen Name", "dataField": "sscreenname", "width": "160px" }
        ];
        const extractedSubAttachmentList = [
            { "idsName": "Ar.No", "dataField": "sarno", "width": "160px" },
            { "idsName": "Sample Ar.No", "dataField": "ssarno", "width": "160px" },
            { "idsName": "File Name", "dataField": "sfilename", "width": "160px" },
            { "idsName": "User Name", "dataField": "susername", "width": "160px" },
            { "idsName": "Screen Name", "dataField": "sscreenname", "width": "160px" }

        ];
        const extractedSubCommentList=[
            { "idsName": "Ar.No", "dataField": "sarno", "width": "160px" },
            { "idsName": "Sample Ar.No", "dataField": "ssarno", "width": "160px" },
            { "idsName": "Comment", "dataField": "scomments", "width": "160px" },
            { "idsName": "User Name", "dataField": "susername", "width": "160px" },
            { "idsName": "Screen Name", "dataField": "sscreenname", "width": "160px" }
        ];
        const extractedtestAttachmentList = [
            { "idsName": "Ar.No", "dataField": "sarno", "width": "160px" },
            { "idsName": "Sample Ar.No", "dataField": "ssarno", "width": "160px" },
            { "idsName": "Test Name", "dataField": "testname", "width": "200px" },
            { "idsName": "File Name", "dataField": "sfilename", "width": "160px" },
            { "idsName": "User Name", "dataField": "susername", "width": "160px" },
            { "idsName": "Screen Name", "dataField": "sscreenname", "width": "160px" }

        ];
        const extractedtestCommentList=[
            { "idsName": "Ar.No", "dataField": "sarno", "width": "160px" },
            { "idsName": "Sample Ar.No", "dataField": "ssarno", "width": "160px" },
            { "idsName": "Test Name", "dataField": "testname", "width": "200px" },
            { "idsName": "Comment", "dataField": "scomments", "width": "160px" },
            { "idsName": "User Name", "dataField": "susername", "width": "160px" },
            { "idsName": "Screen Name", "dataField": "sscreenname", "width": "160px" }
        ];

        let sampleColumnList = [
            { "idsName": "ARNO", "dataField": "ArNo", "width": "150px" },
            { "idsName": "ManuFacture Name", "dataField": "smanuf", "width": "200px" },
            { "idsName": "Generic product", "dataField": "product", "width": "200px" },
            { "idsName": "Status", "dataField": "status", "width": "150px" }
        ]
        let detailedSampleFieldList = [
            { "idsName": "Specification", "dataField": "sspec", "width": "15%" },
            { "idsName": "Component", "dataField": "scomponrnt", "width": "10%" },
            { "idsName": "Reg Date", "dataField": "ddate", "width": "10%" }
        ]
        const myItems = [
            { ArNo: 'RM/0040/20', dregdate: "06/12/2020 10:10 AM", status: "Registered",smanuf:"NIBSC Manufacturer",product:"Allergens"  },
            { ArNo: 'RM/0041/20', dregdate: "07/12/2020 10:10 AM", status: "Registered",smanuf:"DRUG Manufacturer",product:"Allergens"  },
            { ArNo: 'RM/0042/20', dregdate: "08/12/2020 10:10 AM", status: "Registered",smanuf:"DRUG Manufacturer",product:"Allergens"  },
            { ArNo: 'RM/0043/20', dregdate: "09/12/2020 10:10 AM", status: "Registered",smanuf:"DRUG Manufacturer",product:"Allergens"  },
            { ArNo: 'RM/0044/20', dregdate: "10/12/2020 10:10 AM", status: "Registered",smanuf:"ASPIRIN Manufacturer",product:"Allergens" },
            { ArNo: 'RM/0045/20', dregdate: "11/12/2020 10:10 AM", status: "Registered",smanuf:"Mercury Manufacturer",product:"Allergens"   },
            { ArNo: 'RM/0046/20', dregdate: "12/12/2020 10:10 AM", status: "Registered",smanuf:"Mercury Manufacturer",product:"Allergens"   },
            { ArNo: 'RM/0047/20', dregdate: "13/12/2020 10:10 AM", status: "Registered",smanuf:"Tin Manufacturer",product:"Allergens"   },
            { ArNo: 'RM/0048/20', dregdate: "14/12/2020 10:10 AM", status: "Registered",smanuf:"Lead Manufacturer" ,product:"Allergens"  },
            { ArNo: 'RM/0049/20', dregdate: "15/12/2020 10:10 AM", status: "Registered",smanuf:"Pottasium Manufacturer" ,product:"Allergens"  },
            { ArNo: 'RM/0050/20', dregdate: "16/12/2020 10:10 AM", status: "Registered",smanuf:"ASPIRIN Manufacturer" ,product:"Allergens"  },
            { ArNo: 'RM/0051/20', dregdate: "17/12/2020 10:10 AM", status: "Registered",smanuf:"ASPIRIN Manufacturer" ,product:"Allergens"  }
        ];



        const subsampledetails = [
            { samplearno: 'RM/0040/20-001', dregdate: "06/12/2020", status: "Registered", sqty: "10 ml" },
            { samplearno: 'RM/0040/20-002', dregdate: "06/12/2020", status: "Registered", sqty: "15 ml" },
            { samplearno: 'RM/0040/20-003', dregdate: "06/12/2020", status: "Registered", sqty: "20 ml" }
        ];

        let extractedColumnList = [
            { "idsName": "ARNO", "dataField": "arno", "width": "100px" },
            { "idsName": "Sample ARNO", "dataField": "samplearno", "width": "130px" },
            { "idsName": "Test", "dataField": "testname", "width": "200px" },
            { "idsName": "Parameter", "dataField": "paramname", "width": "200px" },
            //{ "idsName": "Result", "dataField": "result", "width": "100px", "editable": false, cell: false, "editor": "numeric" },
            { "idsName": "Final", "dataField": "final", "width": "150px" },
           // { "idsName": "Parameter type", "dataField": "type", "width": "30px" },
            { "idsName": "Pass Flag", "dataField": "flag", "width": "100px" },
            //{ "idsName": "Enforce", "dataField": "enforce", "width": "30px" },
            //{ "idsName": "Remarks", "dataField": "remarks", "width": "90px" },
        ]
        
        
        
        // let sampleList = [
        //     { preregno: 1, arno: '20200001', specname: 'Methane spec' },
        //     { preregno: 2, arno: '20200002', specname: 'plasma pool Study' },
        //     { preregno: 3, arno: '20200003', specname: 'Polio Product spec' },
        //     { preregno: 4, arno: '20200004', specname: 'enzyme spec' },
        //     { preregno: 5, arno: '20200005', specname: 'enzyme spec' },
        //     { preregno: 6, arno: '20200006', specname: 'enzyme spec' },
        //     { preregno: 7, arno: '20200007', specname: 'enzyme spec' },
        //     { preregno: 8, arno: '20200008', specname: 'enzyme spec' },
        //     { preregno: 9, arno: '20200009', specname: 'enzyme spec' },
        //     { preregno: 10, arno: '20200010', specname: 'enzyme spec' },
        //     { preregno: 11, arno: '20200011', specname: 'enzyme spec' },
        //     { preregno: 12, arno: '20200012', specname: 'enzyme spec' },
        // ]
        // let subSampleList = [
        //     { samplecode: 1, arno: '20200001', samplearno: '20200001-001' },
        //     { samplecode: 2, arno: '20200001', samplearno: '20200001-002' },
        //     { samplecode: 3, arno: '20200001', samplearno: '20200001-003' },
        //     { samplecode: 4, arno: '20200001', samplearno: '20200001-004' }
        // ]
        let testList = [
            { Method:"RP-HPLC",Source:"NIBSC",testcode: 1, testname: 'In vivo non lethal mouse local muscular paralysis assay (Botulinum)', transcode: 26, teststatus: 'Approved', transdate: '11-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'Plasma Pools' },
            { Method:"RP-HPLC",Source:"NIBSC",testcode: 2, testname: 'Potency and Thermostability of Mumps', transcode: 27, teststatus: 'Retest', transdate: '10-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'Pertussis (aP)' },
            { Method:"RP-HPLC",Source:"OMCL",testcode: 3, testname: 'Antigen Content and Specific Activity of Gardasil/Silgard Type 16', transcode: 27, teststatus: 'Retest', transdate: '10-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'Hib' },
            { Method:"Serology",Source:"NIBSC",testcode: 4, testname: 'Potency Rotavirus (Pentavalent)', transcode: 26, teststatus: 'Approved', transdate: '10-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'Fibrin sealants' },
            { Method:"Serology",Source:"OMCL",testcode: 5, testname: 'Identity Rotavirus (Pentavalent)', transcode: 26, teststatus: 'Approved', transdate: '10-10-2020', transtime: '10:10 AM', repeat: 1, retest: 0, section: 'Rotavirus - Monovalent' },
            { Method:"Serology",Source:"NIBSC",testcode: 6, testname: 'Potency and Thermostability of Measles, Mumps and Rubella', transcode: 23, teststatus: 'Completed', transdate: '09-10-2020', transtime: '01:10 PM', repeat: 1, retest: 0, section: 'Hib' },
            { Method:"Serology",Source:"NIBSC",testcode: 7, testname: 'Potency and Thermostability of Rubella', transcode: 23, teststatus: 'Completed', transdate: '09-10-2020', transtime: '01:10 PM', repeat: 1, retest: 0, section: 'MMR' },
            { Method:"HPLC-ELISA",Source:"OMCL",testcode: 8, testname: 'Factor VIII Potency', transcode: 23, teststatus: 'Completed', transdate: '08-10-2020', transtime: '01:10 PM', repeat: 1, retest: 0, section: 'Pyrogens' },
            { Method:"HPLC-ELISA",Source:"OMCL",testcode: 9, testname: 'Activated Coagulation Factors (NAPTT)', transcode: 23, teststatus: 'Completed', transdate: '08-10-2020', transtime: '07:10 PM', repeat: 1, retest: 0, section: 'Hepatitis A Vaccine' },
            { Method:"HPLC-ELISA",Source:"OMCL",testcode: 10, testname: 'Blood grouping', transcode: 23, teststatus: 'Completed', transdate: '07-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'MAPREC' },
            { Method:"Article 58 approved",Source:"OMCL",testcode: 11, testname: 'Identity of Hib', transcode: 23, teststatus: 'Completed', transdate: '07-10-2020', transtime: '06:10 PM', repeat: 1, retest: 0, section: 'Antithrombin' },
            { Method:"Article 58 approved",Source:"OMCL",testcode: 12, testname: 'Sialic Acid Content', transcode: 23, teststatus: 'Completed', transdate: '07-10-2020', transtime: '12:10 PM', repeat: 1, retest: 0, section: 'Immunoglobulins' },
        ]

        let instColumnList = [
            { "idsName": "ARNO", "dataField": "arno", "width": "100px" },
            { "idsName": "Sample ARNO", "dataField": "samplearno", "width": "130px" },
            { "idsName": "Test", "dataField": "testname", "width": "200px" },
            { "idsName": "Instrument Category", "dataField": "instcat", "width": "150px" },
            { "idsName": "Instrument ID", "dataField": "instid", "width": "150px" },
            { "idsName": "From Date", "dataField": "fromdate", "width": "100px" },
            { "idsName": "To Date", "dataField": "todate", "width": "100px" },
        ]
        let instrumentData = [
            { instcode: 1,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", instcat: 'Instrument Cat-01', instid: 'Inst/001', fromdate: '01/10/2020', todate: '02/10/2020' },
            { instcode: 2,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", instcat: 'Instrument Cat-02', instid: 'Inst/010', fromdate: '03/10/2020', todate: '04/10/2020' },
            { instcode: 3,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", instcat: 'Instrument Cat-03', instid: 'Inst/029', fromdate: '05/10/2020', todate: '07/10/2020' },
            { instcode: 4,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", instcat: 'Instrument Cat-04', instid: 'Inst/011', fromdate: '06/10/2020', todate: '09/10/2020' },
        ]
        let matColumnList = [
            { "idsName": "ARNO", "dataField": "arno", "width": "100px" },
            { "idsName": "Sample ARNO", "dataField": "samplearno", "width": "110px" },
            { "idsName": "Test", "dataField": "testname", "width": "200px" },
            { "idsName": "Material Type", "dataField": "mattype", "width": "100px" },
            { "idsName": "Material Category", "dataField": "matcat", "width": "100px30px" },
            { "idsName": "Material", "dataField": "Material", "width": "100px" },
            { "idsName": "Inventory ID", "dataField": "inventoryid", "width": "100px" },
            { "idsName": "Used Quantity", "dataField": "usedqty", "width": "100px" },
            //{ "idsName": "Mobile Phase", "dataField": "mobilephase", "width": "30px" },
            //{ "idsName": "Carrier Gas", "dataField": "carriergas", "width": "30px" },
            //{ "idsName": "Remarks", "dataField": "remarks", "width": "90px" },
        ]
        let materialData = [
            { matcode: 1,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-01', matcat: 'Material Cat-01', Material: 'Liquid Nitrogen', inventoryid: 'LN/001', usedqty: '10 g', enforce: 'NO', remarks: '-' },
            { matcode: 2,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-02', matcat: 'Material Cat-02', Material: 'Potassium', inventoryid: 'K/0303', usedqty: '15 g', enforce: 'NO', remarks: '-' },
            { matcode: 3,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-03', matcat: 'Material Cat-03', Material: 'Graphene', inventoryid: '40', usedqty: '20 g', enforce: 'NO', remarks: '-' },
            { matcode: 4,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-04', matcat: 'Material Cat-04', Material: 'Graphite', inventoryid: 'yes', usedqty: '22 ml', enforce: 'YES', remarks: '-' },
            { matcode: 5,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-05', matcat: 'Material Cat-05', Material: 'Gold', inventoryid: '20', usedqty: '10 ppm', enforce: 'YES', remarks: '-' },
            { matcode: 6,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-06', matcat: 'Material Cat-06', Material: 'silver nitrate', inventoryid: 'Identity with rCTB and CTB', usedqty: '12 ml', enforce: 'NO', remarks: '-' },
            { matcode: 7,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", mattype: 'Material Type-07', matcat: 'Material Cat-07', Material: 'Amalgum', inventoryid: 'num', usedqty: '10 ml', enforce: 'NO', remarks: '-' },

        ]

        let taskColumnList = [
            { "idsName": "ARNO", "dataField": "arno", "width": "100px" },
            { "idsName": "Sample ARNO", "dataField": "samplearno", "width": "110px" },
            { "idsName": "Test", "dataField": "testname", "width": "200px" },
            { "idsName": "User Name", "dataField": "username", "width": "70px" },
            { "idsName": "Pre-Analysis Time", "dataField": "preana", "width": "30px" },
            { "idsName": "Preparation Time", "dataField": "prep", "width": "30px" },
            { "idsName": "Analysis Time", "dataField": "analys", "width": "30px" },
            { "idsName": "Miscellaneous Time", "dataField": "misc", "width": "30px" },
            { "idsName": "Comments", "dataField": "enforce", "width": "30px" },
        ]
        let taskData = [
            { paramcode: 1,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '44', prep: '2', analys: '12', misc: '1', enforce: 'NO', remarks: '-' },
            { paramcode: 2,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '22', prep: '2', analys: '14', misc: '3', enforce: 'NO', remarks: '-' },
            { paramcode: 3,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '21', prep: '2', analys: '14', misc: '1', enforce: 'NO', remarks: '-' },
            { paramcode: 4,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '23', prep: '2', analys: '43', misc: '2', enforce: 'YES', remarks: '-' },
            { paramcode: 5,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '43', prep: '2', analys: '35', misc: '5', enforce: 'YES', remarks: '-' },
            { paramcode: 6,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '4' , prep: '2', analys: '55', misc: '2', enforce: 'NO', remarks: '-' },
            { paramcode: 7,arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", username: 'Syed', preana: '44', prep: '2', analys: '35', misc: '2', enforce: 'NO', remarks: '-' },

        ]
        let docsColumnList=[
            { "idsName": "AR NO", "dataField": "sarno", "width": "70px" },
            { "idsName": "File Name", "dataField": "sfilename", "width": "30px" },
            { "idsName": "File Name", "dataField": "sattachmenttype", "width": "30px" },
            { "idsName": "Link", "dataField": "link", "width": "30px" },
        ]
        let docsData=[
            {
                "sarno": "RM/0040/20" ,"sfilename": "TestFile.pdf", "susername": "Syed", "sscreenname": "Result Entry By Sample", "sdescription": "This file is added for testing purpose",
                "sattachmenttype": "File", "ddate": "10/10/2020"
            },
            {
                "sarno": "RM/0040/20" ,"link": "www.google.com", "susername": "Syed", "sscreenname": "Result Entry By Sample", "sdescription": "Result preferences",
                "sattachmenttype": "Link", "ddate": "10/10/2020"
            },
        ]
        let historyColumnList = [
            { "idsName": "ARNO", "dataField": "arno", "width": "100px" },
            { "idsName": "Sample ARNO", "dataField": "samplearno", "width": "110px" },
            { "idsName": "Test", "dataField": "testname", "width": "200px" },
            { "idsName": "Approval Status", "dataField": "status", "width": "100px" },
            { "idsName": "User Name", "dataField": "username", "width": "100px30px" },
            { "idsName": "User Role", "dataField": "userrole", "width": "100px" },
            { "idsName": "Approval Date", "dataField": "date", "width": "100px" },
            
        ]
        let historyData = [
            { matcode: 1,printcount:"1",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},
            { matcode: 2,printcount:"2",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},
            { matcode: 3,printcount:"3",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},
            { matcode: 4,printcount:"5",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},
            { matcode: 5,printcount:"6",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},
            { matcode: 6,printcount:"2",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},
            { matcode: 7,printcount:"4",arno:"RM/0040/20",samplearno:"RM/0040/20-001",testname:"Potency and Thermostability of Mumps", status: 'Approved', username: 'Syed', userrole: 'Head of Division', date: '10/10/2020 10:20 AM'},

        ]
        let printhistoryColumnList=[
            { "idsName": "AR NO", "dataField": "arno", "width": "70px" },
            { "idsName": "Print Count", "dataField": "printcount", "width": "30px" },
            { "idsName": "User Name", "dataField": "username", "width": "30px" },
            { "idsName": "User Role", "dataField": "userrole", "width": "30px" },
            { "idsName": "Print Date", "dataField": "date", "width": "30px" },
        ]
        let changeColumnList = [
            { "idsName": "ARNO", "dataField": "arno", "width": "100px" },
            { "idsName": "Sample ARNO", "dataField": "samplearno", "width": "130px" },
            { "idsName": "Test", "dataField": "testname", "width": "200px" },
            { "idsName": "Parameter", "dataField": "paramname", "width": "200px" },
            { "idsName": "Result", "dataField": "result", "width": "100px" },
            { "idsName": "Final", "dataField": "final", "width": "150px" },
            { "idsName": "User Name", "dataField": "username", "width": "150px" },
            { "idsName": "Date", "dataField": "date", "width": "150px" },
        ]

        const sampleTypeList = [
            { ssampletypename: 'Product', nsampletypecode: '1' },
            { ssampletypename: 'Instrument', nsampletypecode: '2' },
            { ssampletypename: 'Material', nsampletypecode: '3' },
        ]
        const sampleTypeValue = [{ ssampletypename: 'Product', nsampletypecode: '1' }]

        const registrationType = [
            { sregtypename: 'Batch', nregtypecode: '1' },
            { sregtypename: 'Non Batch', nregtypecode: '2' },
            { sregtypename: 'Plasma pools', nregtypecode: '3' },
        ]
        const registrationTypeValue = [{ sregtypename: 'Batch', nregtypecode: '1' }]
        const registrationSubType = [
            { sregsubtypename: 'EU', nregsubtypecode: '1' },
            { sregsubtypename: 'Non EU', nregsubtypecode: '2' },
            { sregsubtypename: 'Protocol', nregsubtypecode: '3' },
        ]
        const registrationSubTypeValue = [{ sregsubtypename: 'EU', nregsubtypecode: '1' }]
        const transStatus = [
            { stransstatus: 'Accepted', ntranscode: '1' },
            { stransstatus: 'Test Started', ntranscode: '2' },
            { stransstatus: 'Completed', ntranscode: '3' },
        ]
        const transStatusValue = [{ stransstatus: 'EU', ntranscode: '1' }]
        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-4">
                    <Row className="no-gutters">
                        <Col md={12} style={{ height: "200vh" }}>
                            <SplitPane
                                vertical
                                borderColor="#999"
                                percentage={true}
                                primaryIndex={1}
                                secondaryInitialSize={45} >
                                <SplitPane
                                    name="Sample Pane"
                                    borderColor="#999"
                                    percentage={true}
                                    primaryIndex={1}
                                    secondaryInitialSize={25} >
                                    <ListWrapper>
                                        <SearchAdd className="d-flex justify-content-between" >
                                            <InputGroup>
                                                <FormControl
                                                    autoComplete="off"
                                                    placeholder={"Search Sample"}
                                                    name={"search Sample"} />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>
                                                        <Image src={filterIcon} alt="filer-icon" width="24" height="24" />
                                                    </InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            <ProductList className="d-flex product-category float-right">
                                                    <Dropdown>
                                                        <Dropdown.Toggle title="Decicion" className="btn-circle solid-blue ml-4">
                                                            <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="dropdownborder" >
                                                            <Dropdown.Item>
                                                                <Nav.Link className='add-txt-btn d-flex justify-content-between blue-text ml-1' style={{ display: 'inline' }}>
                                                                    <FontAwesomeIcon icon={faThumbsUp}/>
                                                                    <span className='ml-1 text-nowrap'>Pass</span>
                                                                </Nav.Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item>
                                                                <Nav.Link className='add-txt-btn d-flex justify-content-between blue-text ml-1' style={{ display: 'inline' }}>
                                                                    <FontAwesomeIcon icon={faThumbsDown}/>
                                                                    <span className='ml-1 text-nowrap'>Fail</span>
                                                                </Nav.Link>
                                                            </Dropdown.Item>                                                           
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </ProductList>
                                        </SearchAdd>
                                        <FilterAccordion key="filter"
                                            filterComponent={[
                                                {
                                                    "IDS_FILTER":
                                                        <Row>
                                                            <Col md={6}>
                                                                <DateTimePicker
                                                                    name={"fromdate"}
                                                                    label={"From"}
                                                                    className='form-control'
                                                                    placeholderText="Select date.."
                                                                    selected={new Date()}
                                                                    dateFormat={"dd/MM/yyyy"}
                                                                    isClearable={false}
                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                                <DateTimePicker
                                                                    name={"todate"}
                                                                    label={"To"}
                                                                    className='form-control'
                                                                    placeholderText="Select date.."
                                                                    selected={new Date()}
                                                                    dateFormat={"dd/MM/yyyy"}
                                                                    isClearable={false}

                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={'SampleType'}
                                                                    placeholder={'SampleType'}
                                                                    name="nsampletypecode"
                                                                    optionId="nsampletypecode"
                                                                    optionValue="ssampletypename"
                                                                    options={sampleTypeList}
                                                                    defaultValue={sampleTypeValue}
                                                                    isMandatory={false}
                                                                    isMulti={false}
                                                                    isSearchable={false}
                                                                    isDisabled={false}
                                                                    alphabeticalSort={false}
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={'Registration Type'}
                                                                    placeholder={'Registration Type'}
                                                                    name="nregtypecode"
                                                                    optionId="nregtypecode"
                                                                    optionValue="sregtypename"
                                                                    options={registrationType}
                                                                    defaultValue={registrationTypeValue}
                                                                    isMandatory={false}
                                                                    isMulti={false}
                                                                    isSearchable={false}
                                                                    isDisabled={false}
                                                                    alphabeticalSort={false}
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={'Registration SubType'}
                                                                    placeholder={'Registration SubType'}
                                                                    name="nregsubtypecode"
                                                                    optionId="nregsubtypecode"
                                                                    optionValue="sregsubtypename"
                                                                    options={registrationSubType}
                                                                    defaultValue={registrationSubTypeValue}
                                                                    isMandatory={false}
                                                                    isMulti={false}
                                                                    isSearchable={false}
                                                                    isDisabled={false}
                                                                    alphabeticalSort={false}
                                                                />
                                                            </Col>
                                                            <Col md={12}>
                                                                <FormSelectSearch
                                                                    formLabel={'Test Status'}
                                                                    placeholder={'Test Status'}
                                                                    name="ntranscode"
                                                                    optionId="ntranscode"
                                                                    optionValue="stransstatus"
                                                                    options={transStatus}
                                                                    defaultValue={transStatusValue}
                                                                    isMandatory={false}
                                                                    isMulti={false}
                                                                    isSearchable={false}
                                                                    isDisabled={false}
                                                                    alphabeticalSort={false}
                                                                >
                                                                </FormSelectSearch>
                                                            </Col>
                                                        </Row>
                                                }]}
                                        />
                                        <ClientList className="product-list">
                                            <ListGroup as="ul">
                                                {myItems.map((item, i) => (
                                                    <ListGroup.Item className="list-bgcolor" as="li" >
                                                        <Media>
                                                            <Form.Check custom type="checkbox" id={`tm_customCheck_${i}`} className="mr-3" class="custom-control-input">
                                                                <Form.Check.Input type="checkbox" checked={i === 0 ? true : false} readOnly />
                                                                <Form.Check.Label htmlFor={`tm_customCheck_0`}></Form.Check.Label>
                                                            </Form.Check>
                                                            <Media.Body>
                                                                <MediaHeader>{item.ArNo}</MediaHeader>
                                                                <MediaSubHeader>
                                                                    <MediaLabel>{item.dregdate}</MediaLabel>
                                                                    <MediaLabel className="seperator">|</MediaLabel>
                                                                    <MediaLabel>{item.status}</MediaLabel>
                                                                </MediaSubHeader>
                                                            </Media.Body>
                                                            <Nav.Link title="Report" className='btn btn-circle outline-grey'>
                                                                <FontAwesomeIcon title="Report" icon={faFileInvoice}/>
                                                            </Nav.Link>
                                                        </Media>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </ClientList>
                                    </ListWrapper>
                                    <SplitPane
                                        name="Sub Sample Pane"
                                        borderColor="#999"
                                        percentage={true}
                                        primaryIndex={1}
                                        secondaryInitialSize={25} >
                                        <ListWrapper>
                                            <SearchAdd className="d-flex justify-content-between" >
                                                <InputGroup>
                                                    <FormControl
                                                        autoComplete="off"
                                                        placeholder={"Search SubSample"}
                                                        name={"search SubSample"} />
                                                    {/* <InputGroup.Append>
                                                        <InputGroup.Text>
                                                            <FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon>
                                                        </InputGroup.Text>
                                                    </InputGroup.Append> */}
                                                </InputGroup>
                                            </SearchAdd>
                                            <ClientList className="product-list">
                                                <ListGroup as="ul">
                                                    {subsampledetails.map((item, i) => (
                                                        <ListGroup.Item className="d-flex justify-content-between list-bgcolor" as="li" >
                                                            <Media>
                                                                <Form.Check custom type="checkbox" id={`tm_customCheck_${i}`} className="mr-3">
                                                                    <Form.Check.Input type="checkbox"
                                                                        checked={i === 0 ? true : false} readOnly />
                                                                    <Form.Check.Label htmlFor={`tm_customCheck_${i}`}></Form.Check.Label>
                                                                </Form.Check>
                                                                <Media.Body>
                                                                    <MediaHeader className="mt-0 text-wrap">
                                                                        {item['samplearno']}
                                                                    </MediaHeader>
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>{item['sqty']}</MediaLabel>
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel> {item['status']} </MediaLabel>
                                                                    </MediaSubHeader>
                                                                </Media.Body>
                                                            </Media>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </ClientList>
                                        </ListWrapper>
                                        <SplitPane
                                            name="Sample Detail Pane"
                                            borderColor="#999"
                                            percentage={true}
                                            primaryIndex={1}
                                            secondaryInitialSize={25}>
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    <Card.Body className="p-0">
                                                        <Row className="no-gutters">
                                                            <Col md={12}>
                                                                <AtTabs>
                                                                    <Tabs defaultActiveKey={0}>
                                                                    <TabPane tab="Sample Info" key={0}>
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <Grid
                                                                                        style={{ height: '560px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        detail={(props)=>this.detailBand(props,detailedSampleFieldList)}
                                                                                        expandField="expanded"
                                                                                        onExpandChange={this.sampleGridExpandChange}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        data={myItems}
                                                                                        {...this.state.sampleDataState}
                                                                                    >
                                                                                        {sampleColumnList.map(item =>
                                                                                            <GridColumn title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)}
                                                                                            />
                                                                                        )}
                                                                                    </Grid>
                                                                                </Col>
                                                                            </Row>
                                                                        </TabPane>
                                                                        <TabPane tab="Sample Attachment" key={1}>
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <Nav.Link className="add-txt-btn float-right">
                                                                                        <FontAwesomeIcon icon={faPlus} /> {}
                                                                                        Add Attachment
                                                                                    </Nav.Link>
                                                                                </Col>
                                                                                <Col md={12}>
                                                                                    <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                                                                    <Grid
                                                                                        style={{ height: '510px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        detail={(props)=>this.detailBand(props,this.detailedFieldList)}
                                                                                        expandField="expanded"
                                                                                        onExpandChange={this.gridExpandChange}
                                                                                        data={this.state.attachmentData}
                                                                                    >
                                                                                        {extractedAttachmentList.map(item =>
                                                                                            <GridColumn title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)}
                                                                                            />
                                                                                        )}
                                                                                        <GridColumn title="Actions" width="180px" sort={false}
                                                                                            cell={(row) => (
                                                                                                <td>
                                                                                                    <Nav.Link className="action-icons-wrap">
                                                                                                        <FontAwesomeIcon icon={faPencilAlt} className="mr-3" />
                                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                                    </Nav.Link>
                                                                                                </td>
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                                    </LocalizationProvider>
                                                                                </Col>
                                                                            </Row>
                                                                        </TabPane>
                                                                        <TabPane tab="Sample Comments" key={2}>
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <Nav.Link className="add-txt-btn float-right">
                                                                                        <FontAwesomeIcon icon={faPlus} /> {}
                                                                                        Add Comments
                                                                                    </Nav.Link>
                                                                                </Col>
                                                                                <Col md={12}>
                                                                                <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                                                                    <Grid
                                                                                        style={{ height: '510px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        onExpandChange={this.gridExpandChange}
                                                                                        data={this.state.commentsData}
                                                                                    >
                                                                                        {extractedCommentList.map(item =>
                                                                                            <GridColumn title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)}
                                                                                            />
                                                                                        )}
                                                                                        <GridColumn title="Actions" width="150px" sort={false}
                                                                                            cell={(row) => (
                                                                                                <td>
                                                                                                    <Nav.Link className="action-icons-wrap">
                                                                                                        <FontAwesomeIcon icon={faPencilAlt} className="mr-3" />
                                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                                    </Nav.Link>
                                                                                                </td>
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                                    </LocalizationProvider>
                                                                                </Col>
                                                                            </Row>
                                                                        </TabPane>
                                                                        <TabPane tab="SubSample Attachment" key={3}>
                                                                        <Row>
                                                                                <Col md={12}>
                                                                                    <Nav.Link className="add-txt-btn float-right">
                                                                                        <FontAwesomeIcon icon={faPlus} /> {}
                                                                                        Add Attachment
                                                                                    </Nav.Link>
                                                                                </Col>
                                                                                <Col md={12}>
                                                                                <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                                                                    <Grid
                                                                                        style={{ height: '510px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        detail={(props)=>this.detailBand(props,this.detailedFieldList)}
                                                                                        expandField="expanded"
                                                                                        onExpandChange={this.gridExpandChange}
                                                                                        data={this.state.attachmentData}
                                                                                    >
                                                                                        {extractedSubAttachmentList.map(item =>
                                                                                            <GridColumn title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)}
                                                                                            />
                                                                                        )}
                                                                                        <GridColumn title="Actions" width="150px" sort={false}
                                                                                            cell={(row) => (
                                                                                                <td>
                                                                                                    <Nav.Link className="action-icons-wrap">
                                                                                                        <FontAwesomeIcon icon={faPencilAlt} className="mr-3" />
                                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                                    </Nav.Link>
                                                                                                </td>
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                                    </LocalizationProvider>
                                                                                </Col>
                                                                            </Row>
                                                                        </TabPane>
                                                                        <TabPane tab="SubSample Comments" key={4}>
                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <Nav.Link className="add-txt-btn float-right">
                                                                                        <FontAwesomeIcon icon={faPlus} /> {}
                                                                                        Add Comments
                                                                                    </Nav.Link>
                                                                                </Col>
                                                                                <Col md={12}>
                                                                                <LocalizationProvider language={this.props.Login.userInfo.slanguagetypecode}>
                                                                                    <Grid
                                                                                        style={{ height: '510px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        onExpandChange={this.gridExpandChange}
                                                                                        data={this.state.commentsData}
                                                                                    >
                                                                                        {extractedSubCommentList.map(item =>
                                                                                            <GridColumn 
                                                                                                title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)
                                                                                                }
                                                                                            />
                                                                                        )}
                                                                                        <GridColumn title="Actions" width="150px" sort={false}
                                                                                            cell={(row) => (
                                                                                                <td>
                                                                                                    <Nav.Link className="action-icons-wrap">
                                                                                                        <FontAwesomeIcon icon={faPencilAlt} className="mr-3" />
                                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                                    </Nav.Link>
                                                                                                </td>
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                                    </LocalizationProvider>
                                                                                </Col>
                                                                            </Row>
                                                                        </TabPane>
                                                                    </Tabs>
                                                                </AtTabs>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </ContentPanel>
                                        </SplitPane>
                                    </SplitPane>
                                </SplitPane>
                                <SplitPane
                                    name="Test Pane"
                                    vertical
                                    borderColor="#999"
                                    percentage={true}
                                    primaryIndex={0}
                                    secondaryInitialSize={0}>
                                    <SplitPane
                                        name="Test List Pane"
                                        borderColor="#999"
                                        percentage={true}
                                        primaryIndex={1}
                                        secondaryInitialSize={44} >
                                        <ListWrapper>
                                            <SearchAdd className="d-flex justify-content-between" >
                                                <InputGroup>
                                                    <FormControl
                                                        autoComplete="off"
                                                        placeholder={"Search Test"}
                                                        name={"search Test"}
                                                    />
                                                    <InputGroup.Append>
                                                        <InputGroup.Text className={"pt-2"} style={{width:"24px",height:"24px"}}>
                                                            <Dropdown className="btn btn-grey">
                                                                <Dropdown.Toggle className={"p-0"}>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdownborder" >
                                                                    <Dropdown.Item>
                                                                        <Nav.Link className='ml-1' style={{ display: 'inline',color:"black" }}>
                                                                           Select All
                                                                        </Nav.Link>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item>
                                                                        <Nav.Link className='ml-1' style={{ display: 'inline',color:"black" }}>
                                                                            Select Completed
                                                                        </Nav.Link>
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </InputGroup.Text>
                                                    </InputGroup.Append>
                                                </InputGroup>
                                                <ProductList className="d-flex product-category float-right">
                                                    <Dropdown>
                                                        <Dropdown.Toggle className="btn-circle solid-blue ml-4">
                                                            <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="dropdownborder" >
                                                            <Dropdown.Item>
                                                                <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline' }}>
                                                                    <FontAwesomeIcon icon={faThumbsUp}/>
                                                                    <span className='ml-1 text-nowrap'>Approve</span>
                                                                </Nav.Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item>
                                                                <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline' }}>
                                                                    <FontAwesomeIcon icon={faRedo}/>
                                                                    <span className='ml-1 text-nowrap'>Retest</span>
                                                                </Nav.Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item>
                                                                <Nav.Link className='add-txt-btn blue-text ml-1' style={{ display: 'inline' }}>
                                                                    <FontAwesomeIcon icon={faRecycle}/>
                                                                    <span className='ml-1 text-nowrap'>Recalc</span>
                                                                </Nav.Link>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </ProductList>
                                            </SearchAdd>
                                            <ClientList className="product-list">
                                                <ListGroup as="ul">
                                                    {testList.map((test, i) => (
                                                        <ListGroup.Item className="list-bgcolor" as="li" >
                                                            <Media>
                                                                <Form.Check custom type="checkbox" id={`tm_customCheck_${i}`} className="mr-3" class="custom-control-input">
                                                                    <Form.Check.Input type="checkbox"
                                                                        checked={i === 0 ? true : false} readOnly />
                                                                    <Form.Check.Label htmlFor={`tm_customCheck_0`}></Form.Check.Label>
                                                                </Form.Check>
                                                                <Media.Body>
                                                                    <MediaHeader className="mt-0 text-wrap">
                                                                        {test['testname']}<br/>
                                                                        <Nav.Link className='add-txt-btn blue-text ml-1 p-0' style={{ display: 'inline' }}>
                                                                            <FontAwesomeIcon icon={test['transcode'] === 26 ? faThumbsUp : test['transcode'] === 23 ? faCheck : test['transcode'] === 27 ?faRedo   : ''} />
                                                                            <span className='ml-1 text-nowrap'>{test['teststatus']}</span>
                                                                        </Nav.Link>
                                                                    </MediaHeader>
                                                                    <MediaSubHeader>
                                                                        <MediaLabel>Repeat:{test['repeat']}</MediaLabel>
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>Retest:{test['retest']}</MediaLabel><br/>
                                                                        <MediaLabel>Source:{test['Source']}</MediaLabel>
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>Method:{test['Method']}</MediaLabel><br/>
                                                                        <MediaLabel>{test['section']}</MediaLabel>
                                                                        <MediaLabel className="seperator">|</MediaLabel>
                                                                        <MediaLabel>{test['transdate']} {} {test['transtime']}</MediaLabel>
                                                                    </MediaSubHeader>
                                                                </Media.Body>
                                                            </Media>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </ClientList>
                                        </ListWrapper>
                                        <ContentPanel className="panel-main-content">
                                            <Card className="border-0">
                                                <Card.Body className='p-0'>
                                                    <Row className='no-gutters'>
                                                        <Col md={12}>
                                                            <AtTabs>
                                                                <Tabs defaultActiveKey="Result" moreIcon="...">
                                                                    <TabPane tab="Result" key="Result">
                                                                        <Grid
                                                                            className="p-3"
                                                                            data={this.state.result}
                                                                            onDataStateChange={(event) => this.resultdataStateChange(event)}
                                                                            {...this.state.ResultDataState}
                                                                            resizable={true}
                                                                            scrollable
                                                                            pageable={{ buttonCount: 4, pageSizes: true }}
                                                                            onExpandChange={this.expandChange}
                                                                            expandField="expanded"
                                                                            groupable={true}
                                                                            editField="inEdit"
                                                                            onRowClick={this.rowClick}
                                                                            onItemChange={this.itemChange}
                                                                        >
                                                                            {extractedColumnList.map((item, key) =>
                                                                                <GridColumn
                                                                                    key={key}
                                                                                    width={item.width}
                                                                                    title={item.idsName}
                                                                                    field={item.dataField}
                                                                                />
                                                                            )}
                                                                            <GridColumn title="Actions" width="50px" sort={false}
                                                                                cell={(row) => (
                                                                                    <td>
                                                                                        <Nav.Link className="action-icons-wrap">
                                                                                            <FontAwesomeIcon title="Enforce Status" icon={faPencilAlt} className="mr-3" />
                                                                                        </Nav.Link>
                                                                                    </td>
                                                                                )}
                                                                            />
                                                                        </Grid>
                                                                    </TabPane>
                                                                    <TabPane tab="Attachment" key={'Attachment'}>
                                                                        <Row>
                                                                            <Col md={12}>
                                                                                <Nav.Link className="add-txt-btn float-right">
                                                                                    <FontAwesomeIcon icon={faPlus} /> {}
                                                                                      Add Attachment
                                                                                    </Nav.Link>
                                                                            </Col>
                                                                            <Col md={12}>
                                                                                    <Grid
                                                                                        style={{ height: '510px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        detail={(props)=>this.detailBand(props,this.detailedFieldList)}
                                                                                        expandField="expanded"
                                                                                        onExpandChange={this.gridExpandChange}
                                                                                        data={this.state.attachmentData}
                                                                                    >
                                                                                        {extractedtestAttachmentList.map(item =>
                                                                                            <GridColumn title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)}
                                                                                            />
                                                                                        )}
                                                                                        <GridColumn title="Actions" width="150px" sort={false}
                                                                                            cell={(row) => (
                                                                                                <td>
                                                                                                    <Nav.Link className="action-icons-wrap">
                                                                                                        <FontAwesomeIcon icon={faPencilAlt} className="mr-3" />
                                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                                    </Nav.Link>
                                                                                                </td>
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                            </Col>
                                                                        </Row>
                                                                    </TabPane>
                                                                    <TabPane tab="Comments" key={"Comments"}>
                                                                        <Row>
                                                                            <Col md={12}>
                                                                                <Nav.Link className="add-txt-btn float-right">
                                                                                    <FontAwesomeIcon icon={faPlus} /> {}
                                                                                      Add Comment
                                                                                </Nav.Link>
                                                                            </Col>
                                                                            <Col md={12}>
                                                                                    <Grid
                                                                                        style={{ height: '510px' }}
                                                                                        sortable
                                                                                        resizable={true}
                                                                                        reorderable
                                                                                        scrollable={true}
                                                                                        pageable={{ buttonCount: 4, pageSizes: true }}
                                                                                        onExpandChange={this.gridExpandChange}
                                                                                        data={this.state.commentsData}
                                                                                    >
                                                                                        {extractedtestCommentList.map(item =>
                                                                                            <GridColumn title={item.idsName}
                                                                                                width={item.width}
                                                                                                cell={(row) => (
                                                                                                    <td>
                                                                                                        {
                                                                                                            row["dataItem"][item.dataField]}
                                                                                                    </td>)
                                                                                                }
                                                                                            />
                                                                                        )}
                                                                                        <GridColumn title="Actions" width="150px" sort={false}
                                                                                            cell={(row) => (
                                                                                                <td>
                                                                                                    <Nav.Link className="action-icons-wrap">
                                                                                                        <FontAwesomeIcon icon={faPencilAlt} className="mr-3" />
                                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                                    </Nav.Link>
                                                                                                </td>
                                                                                            )}
                                                                                        />
                                                                                    </Grid>
                                                                                </Col>
                                                                        </Row>
                                                                    </TabPane>
                                                                    <TabPane tab={"Instrument"} key="Instrument">
                                                                        <Grid
                                                                            className="p-3"
                                                                            data={process(instrumentData, { skip: 0, take: 10 })}
                                                                            style={{ maxHeight: '30em' }}
                                                                            resizable={true}
                                                                            reorderable
                                                                            pageable={{ buttonCount: 4, pageSizes: true }}
                                                                            scrollable={"scrollable"}
                                                                            sortable
                                                                        >
                                                                            {instColumnList.map((item, key) =>
                                                                                <GridColumn 
                                                                                    key={key} 
                                                                                    title={item.idsName}
                                                                                    field={item.dataField}
                                                                                    width={item.width}
                                                                                />
                                                                            )}
                                                                        </Grid>
                                                                    </TabPane>
                                                                    <TabPane tab={"Material"} key="Material">
                                                                            <Grid
                                                                                className="p-3"
                                                                                data={process(materialData, { skip: 0, take: 10 })}
                                                                                style={{ maxHeight: '30em' }}
                                                                                resizable={true}
                                                                                reorderable
                                                                                scrollable={"scrollable"}
                                                                                sortable
                                                                                pageable={{ buttonCount: 4, pageSizes: true }}
                                                                            >
                                                                                {matColumnList.map((item, key) =>
                                                                                    <GridColumn 
                                                                                        key={key} 
                                                                                        title={item.idsName}
                                                                                        field={item.dataField}
                                                                                        width={item.width}
                                                                                    />
                                                                                )}
                                                                            </Grid>
                                                                    </TabPane>
                                                                    <TabPane tab={"Task"} key="Task">
                                                                        <Row>
                                                                            <Grid
                                                                                className="p-3"
                                                                                data={process(taskData, { skip: 0, take: 10 })}
                                                                                style={{ maxHeight: '30em' }}
                                                                                resizable={true}
                                                                                reorderable
                                                                                scrollable
                                                                                sortable
                                                                                editField="inEdit"
                                                                                pageable={{ buttonCount: 4, pageSizes: true }}
                                                                            >
                                                                                {taskColumnList.map((item, key) =>
                                                                                    <GridColumn key={key} title={item.idsName}
                                                                                        field={item.dataField}
                                                                                        cell={(row) => (
                                                                                            <td>
                                                                                                {row["dataItem"][item.dataField]}
                                                                                            </td>)}
                                                                                    />
                                                                                )}
                                                                            </Grid>
                                                                        </Row>
                                                                    </TabPane>
                                                                    <TabPane tab={"Documents"} key="Documents">
                                                                        <Grid
                                                                            className="p-3"
                                                                            data={process(docsData, { skip: 0, take: 10 })}
                                                                            style={{ maxHeight: '30em' }}
                                                                            resizable={true}
                                                                            reorderable
                                                                            scrollable
                                                                            sortable
                                                                            editField="inEdit"
                                                                            pageable={{ buttonCount: 4, pageSizes: true }}
                                                                        >
                                                                            {docsColumnList.map((item, key) =>
                                                                                <GridColumn key={key} title={item.idsName}
                                                                                    field={item.dataField}
                                                                                    cell={(row) => (
                                                                                        <td>
                                                                                            {row["dataItem"][item.dataField]}
                                                                                        </td>)}
                                                                                />
                                                                            )}
                                                                        </Grid>
                                                                    </TabPane>
                                                                    <TabPane tab="Result Change History" key="Result Change History">
                                                                    <Grid
                                                                            className="p-3"
                                                                            data={process(this.paramData, { skip: 0, take: 10 })}
                                                                            style={{ maxHeight: '30em' }}
                                                                            resizable={true}
                                                                            reorderable
                                                                            scrollable
                                                                            sortable
                                                                            editField="inEdit"
                                                                            pageable={{ buttonCount: 4, pageSizes: true }}
                                                                        >
                                                                            {changeColumnList.map((item, key) =>
                                                                                <GridColumn key={key} title={item.idsName}
                                                                                    field={item.dataField}
                                                                                    cell={(row) => (
                                                                                        <td>
                                                                                            {row["dataItem"][item.dataField]}
                                                                                        </td>)}
                                                                                />
                                                                            )}
                                                                        </Grid>
                                                                    </TabPane>
                                                                    <TabPane tab="Approval History" key="Approval History">
                                                                        <Grid
                                                                            className="p-3"
                                                                            data={process(historyData, { skip: 0, take: 10 })}
                                                                            style={{ maxHeight: '30em' }}
                                                                            resizable={true}
                                                                            reorderable
                                                                            scrollable
                                                                            sortable
                                                                            editField="inEdit"
                                                                            pageable={{ buttonCount: 4, pageSizes: true }}
                                                                        >
                                                                            {historyColumnList.map((item, key) =>
                                                                                <GridColumn key={key} title={item.idsName}
                                                                                    field={item.dataField}
                                                                                    cell={(row) => (
                                                                                        <td>
                                                                                            {row["dataItem"][item.dataField]}
                                                                                        </td>)}
                                                                                />
                                                                            )}
                                                                        </Grid>
                                                                    </TabPane>
                                                                    <TabPane tab="Print History" key="Print History">
                                                                        <Grid
                                                                            className="p-3"
                                                                            data={process(historyData, { skip: 0, take: 10 })}
                                                                            style={{ maxHeight: '30em' }}
                                                                            resizable={true}
                                                                            reorderable
                                                                            scrollable
                                                                            sortable
                                                                            editField="inEdit"
                                                                            pageable={{ buttonCount: 4, pageSizes: true }}
                                                                        >
                                                                            {printhistoryColumnList.map((item, key) =>
                                                                                <GridColumn key={key} title={item.idsName}
                                                                                    field={item.dataField}
                                                                                    cell={(row) => (
                                                                                        <td>
                                                                                            {row["dataItem"][item.dataField]}
                                                                                        </td>)}
                                                                                />
                                                                            )}
                                                                        </Grid>
                                                                    </TabPane>
                                                                </Tabs>
                                                            </AtTabs>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </ContentPanel>
                                    </SplitPane>
                                </SplitPane>
                            </SplitPane>
                        </Col>
                    </Row>
                </ListWrapper >
            </>
        );
    }
}

const mapStatetoProps = (state) => {
    return {
        Login: state.Login
    }
}

export default connect(mapStatetoProps)(injectIntl(resultentrybysample));