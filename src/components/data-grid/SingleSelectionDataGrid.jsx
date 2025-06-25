import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Nav, Image } from 'react-bootstrap';
import { Grid, GridColumn as Column, GridToolbar, GridColumnMenuFilter, GridNoRecords, getSelectedState } from '@progress/kendo-react-grid';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import ConfirmDialog from '../confirm-alert/confirm-alert.component';
import SimpleGrid from './SimpleGrid';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { AtTableWrap, FormControlStatic, FontIconWrap } from '../data-grid/data-grid.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck, faTrashAlt, faPencilAlt, faThumbsUp,
    faCopy, faPlus, faSync, faFileExcel, faFilePdf, faCloudDownloadAlt, faRedo, faEye, faRocket
} from '@fortawesome/free-solid-svg-icons';
import ColumnMenu from './ColumnMenu';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import reject from '../../assets/image/reject.svg'
import CustomSwitch from '../custom-switch/custom-switch.component';// import '../../assets/styles/unicode-font.css';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';
import FormCheckbox from '../form-checkbox/form-checkbox.component';
import messages_en from '../../assets/translations/en.json';
import messages_ko from '../../assets/translations/ko.json';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import { connect } from 'react-redux';
import { process } from '@progress/kendo-data-query';
import ReactTooltip from 'react-tooltip';
import { getActionIcon } from '../HoverIcons';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import messages_ru from '../../assets/translations/ru.json';
import messages_tg from '../../assets/translations/tg.json';
import SimpleGridWithSelection from './SimpleGridWithSelection';

const messages = {
    'en-US': messages_en,
    'ko-KR': messages_ko,
    'ru-RU': messages_ru,
    'tg-TG': messages_tg
}

class SingleSelectionDataGrid extends React.Component {

    _pdfExport;
    _excelExport;
    constructor(props) {
        super(props);
        this.confirmMessage = new ConfirmMessage();
    }

    // columnProps(field) {
    //     if (!this.props.hideColumnFilter) {
    //         return {
    //             field: field,
    //             columnMenu: ColumnMenu,
    //             headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
    //         };
    //     }
    // }

    // isColumnActive(field, dataState) {
    //     return GridColumnMenuFilter.active(field, dataState.filter)
    // }


    render() {
        console.log("selectiontest", this.props.subChildList)
        console.log("selectiontest1",this.props)

        const methodUrl = this.props.methodUrl ? this.props.methodUrl : (this.props.inputParam && this.props.inputParam.methodUrl);


        const pageSizes = this.props.pageSizes ? this.props.pageSizes : this.props.Login.settings && this.props.Login.settings[15].split(",").map(setting => parseInt(setting))
        return (
            <>
                {/* <ReactTooltip place="bottom" id="tooltip-grid-wrap" globalEventOff='click' /> */}
                <AtTableWrap className="at-list-table" actionColWidth={this.props.actionColWidth ? this.props.actionColWidth : "150px"} >
                    <LocalizationProvider language="lang">

                        <Grid
                            data={process(this.props.subChildList, { skip: 0, take: this.props.subChildList.length })}
                            style={{ height: this.props.gridHeight, width: this.props.gridWidth }}
                            sortable
                            resizable
                            reorderable={false}
                            scrollable={this.props.scrollable}
                            pageable={this.props.pageable ? { buttonCount: 5, pageSizes: pageSizes, previousNext: false } : ""}
                            groupable={this.props.groupable ? true : false}
                            detail={this.props.hideDetailBand ? false : this.detailBand}
                            //   expandField={this.props.expandField ? this.props.expandField : false}
                            //   onExpandChange={this.expandChange}
                            //    data={this.props.subChildDataResult}
                            total={this.props.total}
                            {...this.props.dataState}
                            selectedField="selected"
                            onRowClick={this.props.handleRowClick}
                            onSelectionChange={this.props.subChildSelectionChange}
                            onHeaderSelectionChange={this.props.subChildHeaderSelectionChange}
                            onDataStateChange={this.props.dataStateChange}
                            selectable={{
                                enabled: true,
                                drag: false,
                                cell: false,
                                mode: 'multiple'
                            }}
                        >
                            <GridNoRecords>
                                {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                            </GridNoRecords>
                            
                                
                                {/* <Column
                            field="selected"
                            width="35px"

                                title={this.props.title}
                                //     headerCell={this.props.subChildHeaderSelectionChange}
                                //    headerSelectionValue={this.props.selectedsubcild!==undefined?this.props.abc===this.props.selectedsubcild?this.props.subChildSelectAll:false:false}
                                headerSelectionValue={
                                    Object.values(this.props.subChildList).every((dd) => {
                                        return dd.selected === true
                                    }) ? true : false

                                }


                            /> */}

                            {this.props.extractedColumnList.map((item, index) =>
                                <Column key={index}
                                    title={this.props.intl.formatMessage({ id: item.idsName })}
                                    //     {...this.columnProps(item.dataField)}
                                    width={item.width}
                                    cell={(row) => (
                                        <td data-tip={row["dataItem"][item.dataField]}>
                                            {item.isIdsField ?
                                                <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                : row["dataItem"][item.dataField]&&row["dataItem"][item.dataField]==='NA'?"-":
                                                row["dataItem"][item.dataField]
                                                }
                                        </td>
                                    )} />
                            )}


                        </Grid>
                    </LocalizationProvider >

                </AtTableWrap >
            </>
        );
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}



export default connect(mapStateToProps, undefined)(injectIntl(SingleSelectionDataGrid));