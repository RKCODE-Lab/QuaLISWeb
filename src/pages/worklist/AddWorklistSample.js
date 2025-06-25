import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, Button } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MediaHeader } from '../product/product.styled';
import { process } from "@progress/kendo-data-query";
import { toast } from 'react-toastify';

// ADDed by Neeraj-ALPD-5136
//WorkList Screen -> Including filter in Data selection Kendo Grid 
//Changed functional component into class component
class AddWorklistSample extends Component {
        constructor(props) {
                super(props);
                const dataState = { skip: 0, take: 10 };
                this.state = {
                        addComponentSortedList: [], dataState
                };
                this.formRef = React.createRef();
        }

        render() {
                const extractedColumnList = [];
                let count = (this.state.addComponentSortedList || []).length;
                extractedColumnList.push({ idsName: "IDS_ARNO", dataField: "sarno", "width": "155px" });
                if (this.props.nneedsubsample) {
                        extractedColumnList.push({ idsName: "IDS_SAMPLEARNO", dataField: "ssamplearno", "width": "155px" });
                }
                extractedColumnList.push({ idsName: "IDS_TEST", dataField: "stestname", "width": "155px" },
                        { idsName: "IDS_SAMPLENAME", dataField: "ssamplename", "width": "155px" },
                        { idsName: "IDS_REGISTRATIONDATE", dataField: "sregistereddate", "width": "200px" });
                return (
                        <>
                                <Row>
                                        <Col className="d-flex justify-content-end p-2" md={12}>
                                                <Button className="btn-user btn-primary-blue"
                                                        onClick={() => this.addSaveDataGrid()}>
                                                        <FontAwesomeIcon icon={faSave} /> { }
                                                        <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                                                </Button>
                                        </Col>
                                        <Row style={{ marginTop: '10px' }}>
                                                <Col>
                                                        <DataGridWithSelection
                                                                primaryKeyField={"nworklistsamplecode"}
                                                                userInfo={this.props.userInfo}
                                                                data={this.state.addComponentDataList || []}
                                                                selectAll={this.state.addSelectAll}
                                                                title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                                                selectionChange={this.selectionChange}
                                                                headerSelectionChange={this.headerSelectionChange}
                                                                extractedColumnList={extractedColumnList}
                                                                dataState={this.state.dataState
                                                                        ? this.state.dataState : { skip: 0, take: 10 }}
                                                                dataResult={this.state.dataResult ? this.state.dataResult :
                                                                        process(this.state.addComponentDataList || [], this.state.dataState
                                                                                ? this.state.dataState : { skip: 0, take: 10 })}
                                                                dataStateChange={this.dataStateChangeWorklistSample}
                                                                scrollable={'scrollable'}
                                                                pageable={true}
                                                        />
                                                </Col>
                                        </Row>
                                        <br>
                                        </br>
                                        <Row style={{ marginTop: '10px' }}>
                                                <Col md={'12'}>
                                                        <MediaHeader className='mb-3'>
                                                                <span style={{ fontWeight: "bold", color: "black" }}>
                                                                        {this.props.intl.formatMessage({ id: "IDS_SELECTEDSAMPLES" }) + " : "}
                                                                </span>
                                                                <span style={{ fontWeight: "bold", color: "blue" }}>
                                                                        {count}
                                                                </span>
                                                        </MediaHeader>
                                                </Col>
                                                <Col>
                                                        <DataGridWithSelection
                                                                primaryKeyField={"nworklistsamplecode"}
                                                                userInfo={this.props.userInfo}
                                                                data={this.state.addComponentSortedList || []}
                                                                title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                                                extractedColumnList={extractedColumnList}
                                                                hideColumnFilter={true}
                                                                isHidemulipleselect={true}
                                                                isActionRequired={true}
                                                                handleClickDelete={this.handleClickDelete}
                                                        />
                                                </Col>
                                        </Row>
                                </Row>
                        </>
                );
        }

        componentDidUpdate(previousProps,previousState) {
                if (this.props.addComponentDataLists !== previousProps.addComponentDataLists) {
                        this.setState({ addComponentDataList: this.props.addComponentDataLists || [] });
                }
                if(this.state.addComponentDataList!==previousState.addComponentDataList){
                        this.setState({ dataResult: process(this.state.addComponentDataList || [], this.state.dataState) });
                }
        }

        addSaveDataGrid = () => {
                let filterdata1 = this.state.dataState ? process(this.state.addComponentDataListCopy || [], { ...this.state.dataState, take: this.state.addComponentDataList.length }).data : [];
                let sortListedData1 = filterdata1.filter(x =>
                        this.state.addedComponentList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
                );
                let exists = this.state.dataState && this.state.dataState.filter !== null && this.state.dataState.filter !== undefined ?
                        sortListedData1.length > 0 ? true : false : true;
                let sortListedDataList = this.state.addedComponentList && this.state.addedComponentList.filter(
                        (addedItem) => process(this.state.addComponentDataList || [], this.state.dataState).data.some(
                                (item) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                        )
                ) || [];
                if (sortListedDataList && sortListedDataList.length > 0 && exists) {
                        let addComponentSortedList = [];
                        let updatedList = [];
                        let ListedData = [];
                        let sortListedData = [];
                        let updatedDataList = [];
                        if (this.state.dataState && this.state.dataState.filter !== null && this.state.dataState.filter !== undefined) {
                                let filterdata = process(this.state.addComponentDataListCopy || this.state.addComponentDataList || [],
                                        this.state.dataState ).data || [];
                                sortListedData = filterdata.filter(x =>
                                        this.state.addedComponentList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
                                );
                                updatedDataList = this.state.addedComponentList.filter(
                                        (item) => !sortListedData.some(
                                                (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                                updatedList = process(this.state.addComponentDataListCopy || this.state.addComponentDataList || [],{ ...this.state.dataState,skip:0, take: this.state.addComponentDataList.length } ).data.filter(
                                        (item) => !sortListedData.some(
                                                (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                                updatedDataList.map(x => { if (x.selected) { ListedData.push(x) } });

                        } else {

                                ListedData = this.state.addedComponentList.filter(
                                        (addedItem) => !process(this.state.addComponentDataList || [], this.state.dataState).data.some(
                                                (item) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                ) || [];

                                sortListedData = this.state.addedComponentList.filter(
                                        (addedItem) => process(this.state.addComponentDataList || [], this.state.dataState).data.some(
                                                (item) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                                updatedList = this.state.addComponentDataList.filter(
                                        (item) => !sortListedData.some(
                                                (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                        }
                        if (this.state.addComponentSortedList.length > 0) {
                                this.state.addComponentSortedList.map(item => {
                                        const newItem = JSON.parse(JSON.stringify(item));
                                        newItem["jsondata"] = {}
                                        newItem["jsonuidata"] = {}
                                        newItem["jsondata"]['worklist'] = item
                                        newItem["jsonuidata"]['worklist'] = item
                                        addComponentSortedList.push(newItem)
                                })
                        }
                        sortListedData.map(item => {
                                const newItem = JSON.parse(JSON.stringify(item));
                                newItem["jsondata"] = {}
                                newItem["jsonuidata"] = {}
                                newItem["jsondata"]['worklist'] = item
                                newItem["jsonuidata"]['worklist'] = item
                                addComponentSortedList.push(newItem)
                        })
                        this.props.childDataChange(addComponentSortedList);
                        this.setState({
                                addComponentDataList:   updatedList||[],
                                addSelectAll: this.valiateCheckAll(this.state.dataState && this.state.dataState.filter !== null && this.state.dataState.filter !== undefined
                                        ? process(updatedList || [],
                                                { ...this.state.dataState,skip:0, take: updatedList.length }).data || [] : updatedList)
                                , addComponentSortedList: addComponentSortedList
                                , addedComponentList: ListedData,
                                addComponentDataListCopy: this.valiateCopy(addComponentSortedList || [], updatedList || [], ListedData || []),
                                dataState: this.dataStateValidation()
                        })
                } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELCETONESAMPLE" }));
                }
        }
        dataStateValidation() {
                let dataState = { ...this.state.dataState };
                let count=0;
                this.state.dataResult.data.map(x=>{if(x.selected){count++}});
                if (this.state.dataResult.data) {
                        if (parseInt(this.state.dataResult.total) ===  (parseInt(count)+parseInt(this.state.dataState.skip))) {
                                let skipcount = this.state.dataState.skip > 0 ? (this.state.dataState.skip - this.state.dataState.take) :
                                        this.state.dataState.skip
                                dataState = { ...dataState,skip: skipcount, take: this.state.dataState.take }
                        }
                }
               return dataState;
        }


        dataStateChangeWorklistSample = (event) => {
                let updatedList = [];
                if (event.dataState && event.dataState.filter === null) {
                        let addComponentDataListCopy = this.state.addComponentDataListCopy || this.state.addComponentDataList || [];
                        addComponentDataListCopy.forEach(x => {
                                const exists = this.state.addComponentSortedList.some(
                                        item => item.ntransactiontestcode === x.ntransactiontestcode
                                );
                                if (!exists) {
                                        updatedList.push(x);
                                }
                        });
                } else {
                        updatedList = this.state.addComponentDataList || []
                }
                this.setState({
                        dataResult: process(this.state.addComponentDataList || [], event.dataState),
                        dataState: event.dataState, addComponentDataList: updatedList, addSelectAll: event.dataState && event.dataState.filter === null ?
                                this.valiateCheckAll(updatedList) :
                                this.valiateCheckAll(process(updatedList || [], event.dataState).data)
                });
        }


        headerSelectionChange = (event) => {
                const checked = event.syntheticEvent.target.checked;
                const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
                let addComponentDataList = //event.target.props.data 
                        this.state.addComponentDataList || [];
                let addedComponentList = this.state.addedComponentList || [];
                if (checked) {
                        const data = addComponentDataList.map(item => {
                                const matchingData = eventData.find(dataItem => dataItem.ntransactiontestcode === item.ntransactiontestcode);
                                if (matchingData) {
                                        const existingIndex = addedComponentList.findIndex(
                                                x => x.ntransactiontestcode === item.ntransactiontestcode
                                        );

                                        if (existingIndex === -1) {
                                                const newItem = {
                                                        ...item,
                                                        selected: true,
                                                        // ALPD-5535 - commented by Gowtham in 12/03/2025 - Run Batch Creation --> While Add/Remove Samples multiple times --> Application crash.
                                                        // jsondata: { worklist: item },
                                                        // jsonuidata: { worklist: item },
                                                };
                                                addedComponentList.push(newItem);
                                        } 
                                        // ALPD-5523 - commented by Gowtham in 10/03/2025 - Run batch creation -->In the sample grid filter, samples are repeated.
                                        // else {
                                        //         const oldItem = { ...addedComponentList[existingIndex], selected: true };
                                        //         const newItem = {
                                        //                 ...oldItem,
                                        //                 selected: true,
                                        //                 jsondata: { worklist: oldItem },
                                        //                 jsonuidata: { worklist: oldItem },
                                        //         };
                                        //         addedComponentList.push(newItem);
                                        // }

                                        return { ...item, selected: true };
                                } else {
                                        return { ...item, selected: item.selected ? true : false };
                                }
                        });
                        this.setState({
                                addComponentDataList: data, addedComponentList,
                                addComponentDataListCopy: this.valiateCopy(this.state.addComponentSortedList || [], data || [], addedComponentList || []),
                                addSelectAll: this.valiateCheckAll(process(data || [], this.state.dataState)),
                                addSelectAll: checked, deleteSelectAll: false
                        });
                } else {
                        let addedComponentData = this.state.addedComponentList || [];
                        let deletedListdData = this.state.deletedList || [];
                        const data = addComponentDataList.map(x => {
                                const matchedItem = eventData.find(item => x.ntransactiontestcode === item.ntransactiontestcode);
                                if (matchedItem) {
                                        addedComponentData = addedComponentData.filter(item1 => item1.npreregno !== matchedItem.npreregno);
                                        deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== matchedItem.npreregno);
                                        matchedItem.selected = false;
                                        return matchedItem;
                                }
                                return x;
                        });

                        this.setState({
                                addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
                                addSelectAll: this.valiateCheckAll(addedComponentList),
                                deleteSelectAll: this.valiateCheckAll(addedComponentList),
                                addSelectAll: checked, deleteSelectAll: false,
                                addComponentDataListCopy: this.valiateCopy(this.state.addComponentSortedList || [], data || [], addedComponentData || []),
                        });
                }
        }

        selectionChange = (event) => {
                let addedComponentList = this.state.addedComponentList || [];
                const addComponentDataList = this.state.addComponentDataList.map(item => {
                        if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
                                item.selected = !event.dataItem.selected;
                                if (item.selected) {
                                        const newItem = JSON.parse(JSON.stringify(item));
                                        // ALPD-5535 - commented by Gowtham in 12/03/2025 - Run Batch Creation --> While Add/Remove Samples multiple times --> Application crash.
                                        // newItem["jsondata"] = {}
                                        // newItem["jsonuidata"] = {}
                                        delete newItem['selected']
                                        newItem.selected = true;
                                        // newItem["jsondata"]['worklist'] = item
                                        // newItem["jsonuidata"]['worklist'] = item
                                        addedComponentList.push(newItem);
                                }
                                else {
                                        addedComponentList = addedComponentList.filter(item1 => item1.ntransactiontestcode !== item.ntransactiontestcode)
                                }
                        }
                        return item;
                });
                this.setState({
                        addSelectAll: this.valiateCheckAll(process(addComponentDataList || [], this.state.dataState).data),
                        addComponentDataList, addedComponentList,
                        deleteSelectAll: this.valiateCheckAll(addedComponentList),
                        addComponentDataListCopy: this.valiateCopy(this.state.addComponentSortedList || [], addComponentDataList || [], addedComponentList || [])
                });
        }

        valiateCopy(sortedList, addComponentDataList, addedComponentList) {
                let addedComponentLists = addedComponentList || this.state.addedComponentList || [];
                let listData = this.props.addComponentDataLists || [];
                let copyingList = listData.filter(item1 =>
                        !sortedList.some(item2 => item1.ntransactiontestcode === item2.ntransactiontestcode)
                ) || [];
                let copyingListData = copyingList.map(item => {
                        const existsInAddComponentDataList = addedComponentLists.some(
                                item1 => item1.ntransactiontestcode === item.ntransactiontestcode
                        );
                        if (existsInAddComponentDataList) {
                                return { ...item, selected: true };
                        } else {
                                return { ...item, selected: false };
                        }
                });
                return copyingListData;
        }
        valiateCheckAll(data) {
                let selectAll = true;
                if (data && data.length > 0) {
                        data.forEach(dataItem => {
                                if (dataItem.selected) {
                                        if (dataItem.selected === false) {
                                                selectAll = false;
                                        }
                                } else {
                                        selectAll = false;
                                }
                        })
                } else {
                        selectAll = false;
                }
                return selectAll;
        }

        handleClickDelete = (row) => {
                let updatedAddList = [];
                if (row) {
                        const ntransactiontestcode = row && row.dataItem && row.dataItem.ntransactiontestcode;
                        const updatedList = this.state.addComponentSortedList && this.state.addComponentSortedList.filter(
                                (item) => item.ntransactiontestcode !== ntransactiontestcode
                        );
                        const exists = this.state.addComponentDataList && this.state.addComponentDataList.some(
                                (item) => item.ntransactiontestcode === ntransactiontestcode
                        );
                        if (!exists) {
                                updatedAddList = this.state.addComponentDataList && this.state.addComponentDataList.map(item => {
                                        return item
                                })
                                // ALPD-5535 - delete json by Gowtham in 12/03/2025 - Run Batch Creation --> While Add/Remove Samples multiple times --> Application crash.
                                row.dataItem && row.dataItem.jsondata && delete row.dataItem.jsondata;
                                row.dataItem && row.dataItem.jsonuidata && delete row.dataItem.jsonuidata;
                                updatedAddList.push({ ...row.dataItem, selected: false });
                        }
                        this.props.childDataChange(updatedList);
                        this.setState({
                                addComponentDataList: updatedAddList, addComponentSortedList: updatedList,
                                addComponentDataListCopy: this.valiateCopy(updatedList || [], updatedAddList || []),
                                addSelectAll: this.valiateCheckAll(updatedAddList)
                        })
                }
        }
}

export default (injectIntl(AddWorklistSample));