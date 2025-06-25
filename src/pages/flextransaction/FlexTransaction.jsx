import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { callService, filterTransactionList, getTransactionDetail, getFilterTransactionDetailsRecords, updateStore, ViewTransactionDetails, getexportdata,viewFlextTransactionReport } from '../../actions';
import { constructOptionList, convertDateValuetoString, getControlMap, rearrangeDateFormat, getStartOfDay, getEndOfDay } from '../../components/CommonScript';
import FlexTransactionFilter from './FlexTransactionFilter';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import SplitterLayout from 'react-splitter-layout';
import DataGrid from '../../components/data-grid/data-grid.component';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ContentPanel } from '../../components/App.styles';
import TransactionListMaster from '../../components/TransactionListMaster';
import { ReactComponent as RefreshIcon } from '../../assets/image/refresh.svg';
import { ProductList } from '../product/product.styled';
import { process } from '@progress/kendo-data-query';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { toast } from 'react-toastify';

class FlexTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.searchFieldList = ["sregisteredtransactiondate"]
        this.searchTransactionRef = React.createRef();
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
        };
        const dataStateAll = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5
        };

        this.state = {
            viewTransDetailsDataState: { skip: 0, take: 10 },
            splitChangeWidthPercentage: 30,
            dataState: dataState,
            dataStateAll: dataStateAll,
            skip: 0,
            take: this.props.Login.settings && this.props.Login.settings[3],
            kendoSkip: 0,
            kendoTake: this.props.Login.settings ? parseInt(this.props.Login.settings[16]) : 5,
            controlMap: new Map(),
            userRoleControlRights: [],
            gridHeight: 'auto',
        }
        this.searchRef = React.createRef();
    }

    dataStateChange = (event) => {
        if (this.state.selectedRecord["nauditactionfiltercode"].value === 1) {
            this.setState({
                dataResult: process(this.props.Login.masterData.TransactionDetails || [], event.dataState),
                dataStateAll: event.dataState, kendoSkip: event.dataState.skip, kendoTake: event.dataState.skip
            });
        }
        else {
            let data = [];
            if (event.dataState.filter === null && event.dataState.sort === null) {
                let auditdata = (this.props.Login.masterData.TransactionDetails &&
                    this.props.Login.masterData.TransactionDetails.slice(0,
                        event.dataState.take + event.dataState.skip)) || []
                data = process(auditdata || [], event.dataState)
            } else {

                data = process(this.props.Login.masterData.TransactionDetails || [], event.dataState)

            }
            this.setState({
                dataResult: data,
                dataState: event.dataState,
            });
        }
    }


    render() {

       // const ViewTransactionDetails = this.state.controlMap.has("ViewTansactionDetails") && this.state.controlMap.get("ViewTansactionDetails").ncontrolcode;
        const DownloadReport = this.state.controlMap.has("DownloadReport") && this.state.controlMap.get("DownloadReport").ncontrolcode;
        this.breadCrumbData = this.breadcrumbList();
        let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
            this.props.Login.masterData.ToDate,
            this.props.Login.userInfo);
        let fromDate = "";
        let toDate = "";

        if (this.props.Login.masterData && this.props.Login.masterData.FromDate) {
            fromDate = (this.state.selectedRecord && this.state.selectedRecord["fromdate"] && getStartOfDay(this.state.selectedRecord["fromdate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
            toDate = (this.state.selectedRecord && this.state.selectedRecord["todate"] && getEndOfDay(this.state.selectedRecord["todate"])) || rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        }
        let inputParam = {
            masterData: this.props.Login.masterData,
            userinfo: this.props.Login.userInfo,
            skip: this.state.skip,
            take: this.state.take,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            viewTypecode: this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.value :
                this.props.Login.masterData.viewFilterType ? this.props.Login.masterData.viewFilterType.nauditactionfiltercode : 0,
            transFilterType: this.props.Login.masterData.breadCrumbTransaDetails ? this.props.Login.masterData.breadCrumbTransaDetails.value :
                this.props.Login.masterData.transFilterType ? this.props.Login.masterData.transFilterType.ntransdetailsfiltercode : 0,
        }
        this.extractedColumnList = [

            { "idsName": "IDS_LABREGNO", "dataField": "slabregno", "width": "200px" },
            { "idsName": "IDS_LAB", "dataField": "slabname", "width": "200px" },
            { "idsName": "IDS_EXTERNALREFNO", "dataField": "sexternalrefcode", "width": "200px" },
            { "idsName": "IDS_PLANT", "dataField": "splantname", "width": "200px" },
            { "idsName": "IDS_PLANTCODE", "dataField": "nplantcode", "width": "200px" },
            { "idsName": "IDS_LABREGDATE", "dataField": "sregistereddate", "width": "200px", "componentName": "date" },
            { "idsName": "IDS_SAMPLE", "dataField": "ssamplename", "width": "200px" },
            { "idsName": "IDS_SAMPLEID", "dataField": "nsampid", "width": "200px" },
            { "idsName": "IDS_BATCHNO", "dataField": "sbatchno", "width": "200px" },
            { "idsName": "IDS_LOTNO", "dataField": "slotno", "width": "200px" },
            { "idsName": "IDS_BILLETNO", "dataField": "sbilletno", "width": "200px" },
            { "idsName": "IDS_HEATNO", "dataField": "sheatno", "width": "200px" },
            { "idsName": "IDS_INGOTNO", "dataField": "singotno", "width": "200px" },
            { "idsName": "IDS_CLIENTCODE", "dataField": "sclientcode", "width": "200px" },
            { "idsName": "IDS_SECTIONNAME", "dataField": "ssectionname", "width": "200px" },
            { "idsName": "IDS_TEST", "dataField": "stestname", "width": "200px" },
            { "idsName": "IDS_PARAMETER", "dataField": "sparametername", "width": "200px" },
            { "idsName": "IDS_RESULTVALUE", "dataField": "sfinal", "width": "200px" },
            { "idsName": "IDS_RESULTSTATUS", "dataField": "resultstatus", "width": "200px" },
            { "idsName": "IDS_REPORTNO", "dataField": "nreportno", "width": "200px" },
            { "idsName": "IDS_REPORTREGNO", "dataField": "sreportrefno", "width": "200px" },
            { "idsName": "IDS_DISPLAY", "dataField": "sdisplaystatus", "width": "200px" },
            { "idsName": "IDS_STATUS", "dataField": "sstatus", "width": "200px" },
            { "idsName": "IDS_SITENAME", "dataField": "ssitename", "width": "200px" },
        ]

        this.feildsForGrid =
            [
                { "idsName": "IDS_FIELDNAME", "dataField": "sfieldname", "width": "200px" },
                { "idsName": "IDS_VALUE", "dataField": "svalue", "width": "100px" }
            ];
        this.filterParam = {
            inputListName: "TransactionDate", selectedObject: "SelectedTransactionDate", primaryKeyField: "sregistereddate",
            fetchUrl: "flextransaction/getTrendChartDate", masterData: this.props.Login.masterData,

            fecthInputObject: {
                userinfo: this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                viewTypecode: this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.value :
                    this.props.Login.masterData.viewFilterType ? this.props.Login.masterData.viewFilterType.nauditactionfiltercode : 0,
                transFilterType: this.props.Login.masterData.breadCrumbTransaDetails ? this.props.Login.masterData.breadCrumbTransaDetails.value :
                    this.props.Login.masterData.transFilterType ? this.props.Login.masterData.transFilterType.ntransdetailsfiltercode : 0,


            },
            filteredListName: "searchedTransactionDate",
            clearFilter: "no",
            updatedListname: "SelectedTransactionDate",
            searchRef: this.searchTransactionRef,
            searchFieldList: this.searchFieldList,
            unchangeList: ["viewFilterTypeList", "transFilterTypeList"],
            changeList: ["TransactionDetails"]

        };

        this.postParamList = [
            {
                filteredListName: "searchedTransactionDate",
                clearFilter: "no",
                searchRef: this.searchRef,
                primaryKeyField: "sregistereddate",
                fetchUrl: "audittrail/getFilterTransactionDetailsRecords",
                fecthInputObject: this.filterParam,
                selectedObject: "SelectedTransactionDate",
                inputListName: "TransactionDate",
                updatedListname: "SelectedTransactionDate",
                unchangeList: ["viewFilterTypeList", "transFilterTypeList"]
            }];

        return (
            <>
                <div className="mtop-fixed-breadcrumb client-listing-wrap">
                    <BreadcrumbComponent breadCrumbItem={this.breadCrumbData} />
                    <Row noGutters>
                        <Col md={12} className="parent-port-height sticky_head_parent" >
                            <SplitterLayout borderColor="#999"
                                primaryIndex={1}
                                percentage={true}
                                secondaryInitialSize={this.state.splitChangeWidthPercentage}
                                onSecondaryPaneSizeChange={this.paneSizeChange}
                                primaryMinSize={40}
                                secondaryMinSize={20}
                            >
                                <TransactionListMaster
                                    splitChangeWidthPercentage={this.state.splitChangeWidthPercentage}
                                    masterList={this.props.Login.masterData.searchedTransactionDetails ||
                                        (this.props.Login.masterData.TransactionDate || [])}
                                    selectedMaster={[this.props.Login.masterData.SelectedTransactionDate]}
                                    primaryKeyField="sregistereddate"
                                    inputParam={inputParam}
                                    mainField="sregisteredtransactiondate"
                                    selectedListName="SelectedTransactionDate"
                                    filterColumnData={this.props.filterTransactionList}
                                    getMasterDetail={this.props.getTransactionDetail}
                                    searchListName="searchedTransactionDetails"
                                    searchRef={this.searchRef}
                                    filterParam={this.filterParam}
                                    objectName="transactionDetails"
                                    listName="IDS_TRANSACTIONDETAILS"
                                    showFilter={this.props.Login.showFilter}
                                    openFilter={this.openFilter}
                                    closeFilter={this.closeFilter}
                                    onFilterSubmit={this.onFilterSubmit}
                                    handlePageChange={this.handlePageChange}
                                    skip={this.state.skip}
                                    take={this.state.take}
                                    needFilter={true}
                                    needAccordianFilter={false}
                                    filterComponent={[
                                        {
                                            "IDS_TRANSACTIONDETAILS":
                                                <FlexTransactionFilter
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    filterViewType={this.state.viewFilterTypeList}
                                                    transfilterViewType={this.state.transFilterTypeList}
                                                    handleDateChange={this.handleDateChange}
                                                    fromDate={fromDate}
                                                    toDate={toDate}
                                                    userInfo={this.props.Login.userInfo}
                                                    onComboChange={this.onComboChange}
                                                />
                                        }
                                    ]}
                                    commonActions={
                                        <ProductList className="d-flex product-category float-right">
                                            <Button className="btn btn-circle outline-grey ml-2 p-0" variant="link"
                                                onClick={() => this.onReload()}
                                                data-tip={this.props.intl.formatMessage({ id: "IDS_REFRESH" })}>
                                                <RefreshIcon className='custom_icons' />
                                            </Button>
                                        </ProductList>
                                    }
                                />
                                <PerfectScrollbar>
                                    <div ref={this.myRef}>
                                        {/* {this.props.Login.masterData.SelectedTransactionDate && this.props.Login.masterData.SelectedTransactionDate !== undefined ? */}
                                            <ContentPanel className="panel-main-content">
                                                <Card className="border-0">
                                                    <Card.Body className='form-static-wrap padding-class'>
                                                        <DataGrid
                                                            selectedId={this.props.Login.selectedId}
                                                            gridHeight={this.state.gridHeight + 'px'}
                                                            expandField="expanded"
                                                            userRoleControlRights={this.state.userRoleControlRights && this.state.userRoleControlRights}
                                                            pageable={true}
                                                            pageSizes={this.props.Login.settings && this.props.Login.settings[17].split(",").map(setting => parseInt(setting))}
                                                            scrollable={"scrollable"}
                                                            primaryKeyField="ntransactionsampleresultno"
                                                            data={this.props.Login.masterData.TransactionDetails || []}
                                                            dataResult={this.state.dataResult}
                                                            dataState={this.state.selectedRecord && this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll
                                                                : this.state.dataState}
                                                            dataStateChange={this.dataStateChange}
                                                            extractedColumnList={this.extractedColumnList || []}
                                                            controlMap={this.state.controlMap}
                                                            //methodUrl="Report"
                                                            groupable={this.state.selectedRecord && this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? true : false : false}
                                                            //isActionRequired={false}
                                                            isToolBarRequired={true}
                                                            isAddRequired={false}
                                                            isRefreshRequired={false}
                                                            isDownloadPDFRequired={false}
                                                            isDownloadExcelRequired={true}
                                                            isExportExcelRequired={true}
                                                            isIdsField="yes"
                                                            isActionRequired={true}
                                                            actionIcons={[
                                                            {
                                                                title: this.props.intl.formatMessage({ id: "IDS_DOWNLOADFILE" }),
                                                                controlname: "faCloudDownloadAlt",
                                                                objectName: "DownloadReport",
                                                                hidden: this.state.userRoleControlRights.indexOf(DownloadReport) === -1,
                                                                onClick: (TransactionDetails) => this.viewSelectedReport(TransactionDetails,DownloadReport)
                                                            }]}
                                                            exportExcelNew={this.exportExcelNew}
                                                            onExpandChange={this.expandChange}
                                                            hideDetailBand={true}
                                                        />
                                                    </Card.Body>
                                                </Card>
                                            </ContentPanel>

                                            {/* : ""
                                        } */}
                                    </div>
                                </PerfectScrollbar>
                            </SplitterLayout>
                        </Col>
                    </Row>
                </div>
                {
                    this.props.Login.openModal &&
                    <SlideOutModal show={this.props.Login.openModal}
                        closeModal={this.closeModal}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        hideSave={true}
                        addComponent={
                            <>
                                <DataGrid
                                    primaryKeyField="ntransactionsampleresultno"
                                    detailedFieldList={this.feildsForGrid}
                                    extractedColumnList={this.feildsForGrid}
                                    dataResult={this.props.Login.masterData["ViewTransactionDetails"] && this.props.Login.masterData["ViewTransactionDetails"].length > 0
                                        && process(this.props.Login.masterData["ViewTransactionDetails"],
                                            this.props.Login.viewTransDetailsDataState ? this.props.Login.viewTransDetailsDataState : { skip: 0, take: 50 })}
                                    dataState={(this.props.Login.screenName === undefined || this.props.Login.screenName === this.props.intl.formatMessage({ id: 'IDS_TRANSACTIONVIEWDETAILS' }))
                                        ? this.props.Login.viewTransDetailsDataState ? this.props.Login.viewTransDetailsDataState : { skip: 0, take: 50 } : { skip: 0, take: 50 }}
                                    dataStateChange={(event) => this.dataStateAuditView(event)}
                                    controlMap={this.state.controlMap}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    pageable={true}
                                    pageSizes={this.props.Login.settings && this.props.Login.settings[17].split(",").map(setting => parseInt(setting))} scrollable={'scrollable'}
                                    gridHeight={'600px'}
                                    hideColumnFilter={true}
                                    selectedId={0}
                                >
                                </DataGrid>
                            </>
                        }
                    />



                }
            </>

        );
    }

    
  viewSelectedReport = (filedata,ncontrolCode) => {
    const inputParam = {
        inputData: {
          ssystemfilename:  filedata.sreportrefno + '.pdf',
            releasedcoareport: filedata.inputData,
            userinfo: this.props.Login.userInfo,
            ncontrolCode: ncontrolCode,
        },
        classUrl: "flextransaction",
        operation: "view",
        methodUrl: "FlextTransactionReport",
    }
    this.props.viewFlextTransactionReport(inputParam);
}

    componentDidMount() {
        if (this.myRef.current.offsetParent.clientHeight !== this.state.gridHeight) {
            this.setState({
                gridHeight: this.myRef.current.offsetParent.clientHeight
            })

        }
    }
    handlePageChange = e => {
        this.setState({
            skip: e.skip,
            take: e.take
        });
    };

    dataStateAuditView = (event) => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { viewTransDetailsDataState: event.dataState }
        }

        this.props.updateStore(updateInfo);
    }

    closeModal = () => {
        let openModal = this.props.Login.openModal;
        openModal = false;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, viewTransDetailsDataState: { skip: 0, take: 50 }, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    ViewTransactionDetails = (details) => {
        const screenName = this.props.intl.formatMessage({ id: 'IDS_TRANSACTIONVIEWDETAILS' });
        this.props.ViewTransactionDetails(this.props.Login.masterData, this.props.Login.userInfo, details, screenName);
    };
    onComboChange = (comboData, fieldName) => {
        if (comboData != null) {
            if (fieldName === "ntransfiltercode" || fieldName === "nauditactionfiltercode") {
                const selectedRecord = this.state.selectedRecord || {};
                selectedRecord[fieldName] = comboData;
                this.setState({ selectedRecord });
            }
        }
        else {
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
    }
    expandChange = (event) => {
        event.dataItem[event.target.props.expandField] = event.value;
        this.setState({
            dataResult: process(this.props.Login.masterData.TransactionDetails || [], this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll :
                this.state.dataState),
            dataState: this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll
                : this.state.dataState,
        });
    };

    // openFilter = () => {
    //     let showFilter = !this.props.Login.showFilter
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { showFilter }
    //     }
    //     this.props.updateStore(updateInfo);
    // }

    // closeFilter = () => {

    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: { showFilter: false }
    //     }
    //     this.props.updateStore(updateInfo);
    // }

    exportExcelNew = () => {
        if(this.props.Login.masterData && this.props.Login.masterData.TransactionDetails.length>0){

        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        let dataField = {};
        [...this.extractedColumnList].map((item) => {
            dataField[item.dataField] = this.props.intl.formatMessage({ id: item.idsName })
        })

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : 0,
            userinfo: this.props.Login.userInfo,
            sregistereddate: this.props.Login.masterData.SelectedTransactionDate && this.props.Login.masterData.SelectedTransactionDate.sregistereddate,
            nformcode: this.props.Login.userInfo.nformcode,
            dataField

        }

        let inputParam = { inputData }
        this.props.getexportdata(inputParam);
    }else{
        toast.info(this.props.intl.formatMessage({ id: "IDS_NODATATOEXPORT" }));
    }
    }
    onFilterSubmit = () => {

        let breadCrumbFrom = this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        let breadCrumbTo = this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let validateFromDate = this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        let validateToDate = this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let breadCrumbTransaDetails = this.state.selectedRecord['ntransfiltercode']
        let breadCrumbViewType = this.state.selectedRecord['nauditactionfiltercode']

        const diffInMilliseconds = Math.abs(validateToDate - validateFromDate);
        const days = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

        const diffYear = validateToDate.getFullYear() - validateFromDate.getFullYear();
        const diffMonth = validateToDate.getMonth() - validateFromDate.getMonth();
        const monthss = diffYear * 12 + diffMonth;

        if (this.state.selectedRecord["nauditactionfiltercode"].value !== 1 || (this.state.selectedRecord["nauditactionfiltercode"].value === 1 && (monthss <= 12 && (days <= 365 || days <= 366)))) {
            let masterData = {
                ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbTransaDetails, breadCrumbViewType
            }
            let fromDate = this.state.selectedRecord["fromdate"] ? this.state.selectedRecord["fromdate"] : this.props.Login.masterData.FromDate;
            let toDate = this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"] : this.props.Login.masterData.ToDate;

            let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
            let inputData = {
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                transFilterType: this.state.selectedRecord["ntransfiltercode"] ? this.state.selectedRecord["ntransfiltercode"].value : 0,
                viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : -1,
                userinfo: this.props.Login.userInfo,
                postParamList: this.filterParam,
            }

            let inputParam = {
                masterData, inputData, searchRef: this.searchRef,
                detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip
            }
            this.props.getFilterTransactionDetailsRecords(inputParam)
        } else {
            let selectedRecord = this.state.selectedRecord;
            selectedRecord['fromdate'] = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate)
            selectedRecord['toDate'] = rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate)
            selectedRecord['nauditactionfiltercode'] = this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType :
                {
                    item: this.props.Login.masterData.viewFilterType,
                    label: this.props.Login.masterData.viewFilterType.sauditactionfiltername, value: this.props.Login.masterData.viewFilterType.nauditactionfiltercode
                }
            selectedRecord['ntransfiltercode'] = this.props.Login.masterData.breadCrumbTransaDetails ? this.props.Login.masterData.breadCrumbTransaDetails :
                {
                    item: this.props.Login.masterData.transFilterType,
                    label: this.props.Login.masterData.transFilterType.sdisplayname, value: this.props.Login.masterData.transFilterType.ntransfiltertypecode
                }
            this.setState({ selectedRecord });
            toast.warn(this.props.intl.formatMessage({ id: "IDS_DATERANGESHOULDEMAXONEYEAR" }));
        }
    }

    onReload = () => {
        let breadCrumbFrom = this.state.selectedRecord["fromdate"] ? getStartOfDay(this.state.selectedRecord["fromdate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.FromDate);
        let breadCrumbTo = this.state.selectedRecord["todate"] ? getEndOfDay(this.state.selectedRecord["todate"]) : rearrangeDateFormat(this.props.Login.userInfo, this.props.Login.masterData.ToDate);
        let breadCrumbTransaDetails = this.state.selectedRecord['ntransfiltercode']
        let breadCrumbViewType = this.state.selectedRecord['nauditactionfiltercode'];

        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        let inputData = {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            transFilterType: this.state.selectedRecord["ntransfiltercode"] ? this.state.selectedRecord["ntransfiltercode"].value : 0,
            viewtypecode: this.state.selectedRecord["nauditactionfiltercode"] ? this.state.selectedRecord["nauditactionfiltercode"].value : -1,
            userinfo: this.props.Login.userInfo,
            postParamList: this.filterParam,
        }

        let masterData = {
            ...this.props.Login.masterData, breadCrumbFrom, breadCrumbTo, breadCrumbTransaDetails, breadCrumbViewType
        }

        let inputParam = { masterData, inputData, searchRef: this.searchRef, detailSkip: this.state.selectedRecord["nauditactionfiltercode"].value === 1 ? this.state.dataStateAll.skip : this.state.dataState.skip }
        this.props.getFilterTransactionDetailsRecords(inputParam)
    }
    handleDateChange = (dateName, dateValue) => {
        let selectedRecord = this.state.selectedRecord;
        selectedRecord[dateName] = dateValue;

        this.setState({ selectedRecord });
    }
    paneSizeChange = (eve) => {
        this.setState({
            splitChangeWidthPercentage: eve
        })
    }

    breadcrumbList = () => {
        let breadCrumbArray = [];
        let fromDate = this.props.Login.masterData.FromDate ? this.props.Login.masterData.FromDate : this.props.Login.masterData.breadCrumbFrom;
        let toDate = this.props.Login.masterData.ToDate ? this.props.Login.masterData.ToDate : this.props.Login.masterData.breadCrumbTo;

        let obj = convertDateValuetoString(fromDate,
            toDate,
            this.props.Login.userInfo);
        breadCrumbArray.push({
            "label": "IDS_FROM",
            "value": obj.breadCrumbFrom
        }, {
            "label": "IDS_TO",
            "value": obj.breadCrumbto
        });

        // breadCrumbArray.push(
        //     {
        //         "label": "IDS_RECORDTODISPLAY",
        //         "value": this.props.Login.masterData.breadCrumbTransaDetails ? this.props.Login.masterData.breadCrumbTransaDetails.label :
        //             this.props.Login.masterData.transFilterType ? this.props.Login.masterData.transFilterType.sdisplayname : ""
        //     });

        breadCrumbArray.push(
            {
                "label": "IDS_VIEWPERIOD",
                "value": this.props.Login.masterData.breadCrumbViewType ? this.props.Login.masterData.breadCrumbViewType.label :
                    this.props.Login.masterData.viewFilterType ? this.props.Login.masterData.viewFilterType.sauditactionfiltername : ""
            });


        return breadCrumbArray;
    };

    componentDidUpdate(previousProps) {

        let updateState = false;
        let { selectedRecord, viewFilterTypeList, dataStateAll, dataState, dataResult, skip, take, transFilterTypeList } = this.state
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            updateState = true;
            selectedRecord = this.props.Login.selectedRecord;
        }
        if (this.props.Login.masterData.viewFilterType !== previousProps.Login.masterData.viewFilterType) {
            updateState = true;
            const viewTypeAMap = constructOptionList(this.props.Login.masterData.viewFilterTypeList || [], "nauditactionfiltercode",
                "sauditactionfiltername", "nsorter", "ascending", false);
            const viewFilterTypeLists = viewTypeAMap.get("OptionList");
            viewFilterTypeList = viewFilterTypeLists
            selectedRecord = {
                nauditactionfiltercode: viewFilterTypeLists.length > 0 ? {
                    "value": viewFilterTypeLists[0].item.nauditactionfiltercode,
                    "label": viewFilterTypeLists[0].item.sauditactionfiltername
                } : this.state.selectedRecord["nauditactionfiltercode"]
            }

        }
        if (this.props.Login.masterData.transFilterTypeList !== previousProps.Login.masterData.transFilterTypeList) {
            updateState = true;
            const transTypeAMap = constructOptionList(this.props.Login.masterData.transFilterTypeList || [], "ntransdetailsfiltercode",
                "sdisplayname", "nsorter", "ascending", false);
            const transFilterTypeLists = transTypeAMap.get("OptionList");
            transFilterTypeList = transFilterTypeLists
            selectedRecord = {
                ...selectedRecord,
                ntransfiltercode: transFilterTypeLists.length > 0 ? {
                    "value": transFilterTypeLists[0].item.ntransdetailsfiltercode,
                    "label": transFilterTypeLists[0].item.sdisplayname
                } : this.state.selectedRecord["ntransfiltercode"],
            }
        }

        if (this.props.Login.resetDataGridPage && this.props.Login.resetDataGridPage !== previousProps.Login.resetDataGridPage) {
            if (this.state.selectedRecord["nauditactionfiltercode"].value === 1) {

                dataStateAll.skip = 0
                updateState = true;
            }
            else {

                dataState.skip = 0
                updateState = true;
            }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            updateState = true;
            if (this.state.selectedRecord && this.state.selectedRecord["nauditactionfiltercode"] && this.state.selectedRecord["nauditactionfiltercode"].value === 1) {

                dataStateAll = { skip: 0, take: dataStateAll.take }
                updateState = true;
            }
            else {

                dataState = { skip: 0, take: dataState.take }
                updateState = true;
            }
            const transactionDetailsDate = (this.props.Login.masterData.TransactionDetails && this.props.Login.masterData.TransactionDetails.slice(dataState.skip, this.props.Login.masterData.TransactionDetails.length)) || []
            dataResult = process(transactionDetailsDate || [], dataState)

            skip = this.props.Login.skip === undefined ? skip : this.props.Login.skip
            take = this.props.Login.take || take

        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            updateState = true;
            const userRoleControlRights = [];
            if (this.props.Login.userRoleControlRights) {
                this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                    userRoleControlRights.push(item.ncontrolcode))
            }

            const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
            this.setState({
                userRoleControlRights, controlMap, data: this.props.Login.masterData.ControlRights
            });
        }
        if (updateState) {
            this.setState({
                selectedRecord, viewFilterTypeList, dataStateAll, dataState, dataResult, skip, take, transFilterTypeList
            })
        }

    }
}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {
    callService, filterTransactionList, getTransactionDetail, getFilterTransactionDetailsRecords, updateStore, ViewTransactionDetails, getexportdata,viewFlextTransactionReport
})(injectIntl(FlexTransaction));