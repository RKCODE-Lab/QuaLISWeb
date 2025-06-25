import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {Button,Row, Col} from 'react-bootstrap';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';
import {faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MediaHeader } from '../product/product.styled';
import { toast } from 'react-toastify';
import { process } from "@progress/kendo-data-query";

   //ALPD-5137--Vignesh R(28-01-2025)---Function component convert to Class component
   class AddSample extends Component {
        
        constructor(props) {

                super(props);
                const dataState = { skip: 0, take: 10 };
                this.state = {
                        addedSamplesListSortedList: [], dataState
                };
                this.formRef = React.createRef();
        }
        render() {
        const extractedColumnList = [];
        //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
        let count = (this.state.addedSamplesListSortedList || []).length;
        if (this.props.nneedsubsample){
                extractedColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno"},
                        {"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno" } 
                );            
        }
            else{
                extractedColumnList.push({"idsName":"IDS_ARNUMBER","dataField":"sarno", "width": "155px"});
            }
            extractedColumnList .push(      
                {"idsName":"IDS_TESTNAME","dataField":"stestname","width": "155px"},
                {"idsName":"IDS_SAMPLENAME","dataField":"ssamplename", "width": "155px"},
                {"idsName":"IDS_REGDATE","dataField":"dregdate","width": "200px" },
             );
       return (<>
       { /*ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid*/}
       <Row>                               <Col className="d-flex justify-content-end p-2" md={12}>
                                <Button className="btn-user btn-primary-blue"
                                onClick={() => this.addSaveDataGrid()}
                                >
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_ADD' defaultMessage='Add' />
                                </Button>
                        </Col>
        <Row style={{marginTop:'10px'}}>
                <Col>                     
                        <DataGridWithSelection                               
                                  primaryKeyField={"nbatchsamplecode"}                            
                                  data={this.state.samples ||[]} 
                                  //dataState={this.state.dataState}
                                  //dataResult={this.state.dataResult}
                                  selectAll={this.state.addSelectAll}
                                  userInfo={this.props.userInfo}
                                  title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                  headerSelectionChange={this.headerSelectionChange}
                                  selectionChange={this.selectionChange}
                                  dataStateChange={this.dataStateChangeBatchSample}
                                  extractedColumnList={extractedColumnList}
                                  dataState={this.state.dataState ? this.state.dataState : { skip: 0, take: 10 }}
                                  dataResult={this.state.dataResult ? this.state.dataResult :
                                  process(this.state.samples || [], this.state.dataState
                                   ? this.state.dataState : { skip: 0, take: 10 })}   
                                   scrollable={'scrollable'}
                                   pageable={true}                           
                        /> 
                </Col>
        </Row>
        </Row>
 
                        <Row style={{marginTop:'10px'}}>


                        {/*ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid*/}
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
                                                 primaryKeyField={"nbatchsamplecode"}
                                                 userInfo={this.props.userInfo}
                                                 data={this.state.addedSamplesListSortedList || []}
                                                 title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                                 extractedColumnList={extractedColumnList}                                                
                                             
                                                 hideColumnFilter={true}
                                                 isHidemulipleselect={true}
                                                 isActionRequired={true}
                                                 handleClickDelete={this.handleClickDelete}
                                        />
                                </Col>
                {/* <Col md={6}>
                        <span className="add-txt-btn">
                                <FormattedMessage id="IDS_ADDEDCOMPONENTS" defaultMessage="Added Components"/>
                                 : {props.addedComponentList && props.addedComponentList.length}
                        </span>
                </Col> */}

                {/* <Col md={12} className="d-flex justify-content-end">
                     
                        <Button variant="outline-danger" onClick={() => props.onDeleteSelectedComponent()} >
                                <FormattedMessage id='IDS_REMOVECOMPONENTS' defaultMessage='Remove Components' />
                        </Button> */}
                        {/* <Nav.Link name="addrole" className="add-txt-btn" onClick={() => props.onDeleteSelectedComponent()}>
                                <FormattedMessage id='IDS_DELETECOMPONENTS' defaultMessage='Delete Components' />
                        </Nav.Link> */}
                {/* </Col> */}
        </Row>
        {/* <Row style={{marginTop:'10px'}}> 
                 <Col>      
                        <DataGridWithSelection
                                primaryKeyField={"npreregno"}                               
                                data={props.samples }
                                // componentPopupSkip={props.componentPopupSkip}
                                // componentPopupTake={props.componentPopupTake}
                                // componentPageSizes={props.componentPageSizes}
                                selectAll={props.deleteSelectAll}
                                title={props.intl.formatMessage({id:"IDS_SELECTTODELETE"})}
                                headerSelectionChange={props.addedHeaderSelectionChange}
                                selectionChange={props.addedSelectionChange}
                                extractedColumnList={[  {idsName:"IDS_ARNO", dataField:"sarno"},
                                                        {idsName:"IDS_COMPONENTNAME", dataField:"scomponentname"},
                                                        {idsName:"IDS_BATCHLOTNO", dataField:"smanuflotno"},
                                                        {idsName:"IDS_SPECNAME", dataField:"sspecname"}]}
                              
                        /> 
                </Col>
        </Row> */}
        </>
       )
   }
     //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
 componentDidUpdate(previousProps,previousState) {
        if (this.props.samples !== previousProps.samples) {
                this.setState({ samples: this.props.samples || [] });
        }
        if(this.state.samples!==previousState.samples){
                this.setState({ dataResult: process(this.state.samples || [], this.state.dataState) });
        }
}

            //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
headerSelectionChange = (event) => {
                const checked = event.syntheticEvent.target.checked;
                const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
                let samples = //event.target.props.data 
                        this.state.samples || [];
                let addedSamplesList = this.state.addedSamplesList || [];
                if (checked) {
                        const data = samples.map(item => {
                                const matchingData = eventData.find(dataItem => dataItem.ntransactiontestcode === item.ntransactiontestcode);
                                if (matchingData) {
                                        const existingIndex = addedSamplesList.findIndex(
                                                x => x.ntransactiontestcode === item.ntransactiontestcode
                                        );

                                        if (existingIndex === -1) {
                                                const newItem = {
                                                        ...item,
                                                        selected: true,
                                                        // ALPD-5535 - commented by Gowtham in 12/03/2025 - Run Batch Creation --> While Add/Remove Samples multiple times --> Application crash.
                                                        // jsondata: { samplelist: item },
                                                        // jsonuidata: { samplelist: item },
                                                };
                                                addedSamplesList.push(newItem);
                                        } 
                                        // ALPD-5523 - commented by Gowtham in 10/03/2025 - Run batch creation -->In the sample grid filter, samples are repeated.
                                        // else {
                                        //         const oldItem = { ...addedSamplesList[existingIndex], selected: true };
                                        //         const newItem = {
                                        //                 ...oldItem,
                                        //                 selected: true,
                                        //                 jsondata: { samplelist: oldItem },
                                        //                 jsonuidata: { samplelist: oldItem },
                                        //         };
                                        //         addedSamplesList.push(newItem);
                                        // }

                                        return { ...item, selected: true };
                                } else {
                                        return { ...item, selected: item.selected ? true : false };
                                }
                        });
                        this.setState({
                                samples: data, addedSamplesList,
                                addComponentDataListCopy: this.valiateCopy(this.state.addedSamplesListSortedList || [], data || [], addedSamplesList || []),
                                addSelectAll: this.valiateCheckAll(process(data || [], this.state.dataState)),
                                addSelectAll: checked, deleteSelectAll: false
                        });
                } else {
                        let addedSamplesList = this.state.addedSamplesList || [];
                        let deletedListdData = this.state.deletedList || [];
                        const data = samples.map(x => {
                                const matchedItem = eventData.find(item => x.ntransactiontestcode === item.ntransactiontestcode);
                                if (matchedItem) {
                                        addedSamplesList = addedSamplesList.filter(item1 => item1.npreregno !== matchedItem.npreregno);
                                        deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== matchedItem.npreregno);
                                        matchedItem.selected = false;
                                        return matchedItem;
                                }
                                return x;
                        });

                        this.setState({
                                samples: data, addedSamplesList: addedSamplesList, deletedList: deletedListdData,
                                addSelectAll: this.valiateCheckAll(addedSamplesList),
                                deleteSelectAll: this.valiateCheckAll(addedSamplesList),
                                addSelectAll: checked, deleteSelectAll: false,
                                addComponentDataListCopy: this.valiateCopy(this.state.addedSamplesListSortedList || [], data || [], addedSamplesList || []),
                        });
                }
        }

    //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
  addSaveDataGrid = () => {
                let filterdata1 = this.state.dataState ? process(this.state.addComponentDataListCopy || [], { ...this.state.dataState, take: this.state.samples.length }).data : [];
                let sortListedData1 = filterdata1.filter(x =>
                        this.state.addedSamplesList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
                );
                let exists = this.state.dataState && this.state.dataState.filter !== null && this.state.dataState.filter !== undefined ?
                        sortListedData1.length > 0 ? true : false : true;
                let sortListedDataList = this.state.addedSamplesList && this.state.addedSamplesList.filter(
                        (addedItem) => process(this.state.samples || [], this.state.dataState).data.some(
                                (item) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                        )
                ) || [];
                if (sortListedDataList && sortListedDataList.length > 0 && exists) {
                        let addedSamplesListSortedList = [];
                        let updatedList = [];
                        let ListedData = [];
                        let sortListedData = [];
                        let updatedDataList = [];
                        if (this.state.dataState && this.state.dataState.filter !== null && this.state.dataState.filter !== undefined) {
                                let filterdata = process(this.state.addComponentDataListCopy || this.state.samples || [],
                                        this.state.dataState ).data || [];
                                sortListedData = filterdata.filter(x =>
                                        this.state.addedSamplesList.some(item => item.ntransactiontestcode === x.ntransactiontestcode)
                                );
                                updatedDataList = this.state.addedSamplesList.filter(
                                        (item) => !sortListedData.some(
                                                (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                                updatedList = process(this.state.addComponentDataListCopy || this.state.samples || [],{ ...this.state.dataState,skip:0, take: this.state.samples.length } ).data.filter(
                                        (item) => !sortListedData.some(
                                                (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                                updatedDataList.map(x => { if (x.selected) { ListedData.push(x) } });

                        } else {

                                ListedData = this.state.addedSamplesList.filter(
                                        (addedItem) => !process(this.state.samples || [], this.state.dataState).data.some(
                                                (item) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                ) || [];

                                sortListedData = this.state.addedSamplesList.filter(
                                        (addedItem) => process(this.state.samples || [], this.state.dataState).data.some(
                                                (item) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                                updatedList = this.state.samples.filter(
                                        (item) => !sortListedData.some(
                                                (addedItem) => addedItem.ntransactiontestcode === item.ntransactiontestcode
                                        )
                                );
                        }
                        if (this.state.addedSamplesListSortedList.length > 0) {
                                this.state.addedSamplesListSortedList.map(item => {
                                        const newItem = JSON.parse(JSON.stringify(item));
                                        newItem["jsondata"] = {}
                                        newItem["jsonuidata"] = {}
                                        newItem["selected"]=false;
                                        newItem["jsondata"]['samplelist'] =  {...item,selected:false}
                                        newItem["jsonuidata"]['samplelist'] =  {...item,selected:false}
                                        addedSamplesListSortedList.push(newItem)
                                })
                        }
                        sortListedData.map(item => {
                                const newItem = JSON.parse(JSON.stringify(item));
                                newItem["jsondata"] = {}
                                newItem["jsonuidata"] = {}
                                newItem["selected"]=false;
                                newItem["jsondata"]['samplelist'] =  {...item,selected:false}
                                newItem["jsonuidata"]['samplelist'] =  {...item,selected:false}
                                addedSamplesListSortedList.push(newItem)
                        })
                        this.props.childDataChange(addedSamplesListSortedList);
                        this.setState({
                                samples:updatedList||[],
                                addSelectAll: this.valiateCheckAll(this.state.dataState && this.state.dataState.filter !== null && this.state.dataState.filter !== undefined
                                        ? process(updatedList || [],
                                                { ...this.state.dataState,skip:0, take: updatedList.length }).data || [] : updatedList)
                                , addedSamplesListSortedList: addedSamplesListSortedList
                                , addedSamplesList: ListedData,
                                addComponentDataListCopy: this.valiateCopy(addedSamplesListSortedList || [], updatedList || [], ListedData || []),
                                dataState: this.dataStateValidation()
                        })
                } else {
                        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELCETONESAMPLE" }));
                }
        }

                        //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
        valiateCopy(sortedList, samples, addedSamplesList) {
                let addedSamplesLists = addedSamplesList || this.state.addedSamplesList || [];
                let listData = this.props.samples || [];
                let copyingList = listData.filter(item1 =>
                        !sortedList.some(item2 => item1.ntransactiontestcode === item2.ntransactiontestcode)
                ) || [];
                let copyingListData = copyingList.map(item => {
                        const existsInAddComponentDataList = addedSamplesLists.some(
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


                         //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
          handleClickDelete = (row) => {
                let updatedAddList = [];
                if (row) {
                        const ntransactiontestcode = row && row.dataItem && row.dataItem.ntransactiontestcode;
                        const updatedList = this.state.addedSamplesListSortedList && this.state.addedSamplesListSortedList.filter(
                                (item) => item.ntransactiontestcode !== ntransactiontestcode
                        );
                        const exists = this.state.samples && this.state.samples.some(
                                (item) => item.ntransactiontestcode === ntransactiontestcode
                        );
                        if (!exists) {
                                updatedAddList = this.state.samples && this.state.samples.map(item => {
                                        return item
                                })
                                // ALPD-5535 - delete json by Gowtham in 12/03/2025 - Run Batch Creation --> While Add/Remove Samples multiple times --> Application crash.
                                row.dataItem && row.dataItem.jsondata && delete row.dataItem.jsondata;
                                row.dataItem && row.dataItem.jsonuidata && delete row.dataItem.jsonuidata;
                                updatedAddList.push({ ...row.dataItem, selected: false });
                        }
                        this.props.childDataChange(updatedList);
                        this.setState({
                                samples: updatedAddList, addedSamplesListSortedList: updatedList,
                                addComponentDataListCopy: this.valiateCopy(updatedList || [], updatedAddList || []),
                                addSelectAll: this.valiateCheckAll(updatedAddList)
                        })
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

//ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
selectionChange = (event) => {
                let addedSamplesList = this.state.addedSamplesList || [];
                const samples = this.state.samples.map(item => {
                        if (item.ntransactiontestcode === event.dataItem.ntransactiontestcode) {
                                item.selected = !event.dataItem.selected;
                                if (item.selected) {
                                        const newItem = JSON.parse(JSON.stringify(item));
                                        // ALPD-5535 - commented by Gowtham in 12/03/2025 - Run Batch Creation --> While Add/Remove Samples multiple times --> Application crash.
                                        // newItem["jsondata"] = {}
                                        // newItem["jsonuidata"] = {}
                                        delete newItem['selected']
                                        newItem.selected = true;
                                        // newItem["jsondata"]['samplelist'] = item
                                        // newItem["jsonuidata"]['samplelist'] = item
                                        addedSamplesList.push(newItem);
                                }
                                else {
                                        addedSamplesList = addedSamplesList.filter(item1 => item1.ntransactiontestcode !== item.ntransactiontestcode)
                                }
                        }
                        return item;
                });
                this.setState({
                        addSelectAll: this.valiateCheckAll(process(samples || [], this.state.dataState).data),
                        samples, addedSamplesList,
                        deleteSelectAll: this.valiateCheckAll(addedSamplesList),
                        addComponentDataListCopy: this.valiateCopy(this.state.addedSamplesListSortedList || [], samples || [], addedSamplesList || [])
                });
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
                //ALPD-5137--Vignesh R(28-01-2025)---Including filter in Data selection Kendo Grid
        dataStateChangeBatchSample = (event) => {
               let updatedList = [];
               if (event.dataState && event.dataState.filter === null) {
                       let addComponentDataListCopy = this.state.addComponentDataListCopy || this.state.samples || [];
                       addComponentDataListCopy.forEach(x => {
                               const exists = this.state.addedSamplesListSortedList.some(
                                       item => item.ntransactiontestcode === x.ntransactiontestcode
                               );
                               if (!exists) {
                                       updatedList.push(x);
                               }
                       });
               } else {
                       updatedList = this.state.samples || []
               }
               this.setState({
                       dataResult: process(this.state.samples || [], event.dataState),
                       dataState: event.dataState, samples: updatedList, addSelectAll: event.dataState && event.dataState.filter === null ?
                               this.valiateCheckAll(updatedList) :
                               this.valiateCheckAll(process(updatedList || [], event.dataState).data)
               });
       }
}
   export default injectIntl(AddSample);
