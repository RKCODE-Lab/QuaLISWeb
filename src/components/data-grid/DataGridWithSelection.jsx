import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
//import { Grid, GridColumn as Column,GridNoRecords } from '@progress/kendo-react-grid';
import { Grid, GridColumn as Column, GridNoRecords, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { AtTableWrap, FontIconWrap } from '../data-grid/data-grid.styles';
import { loadMessages, LocalizationProvider } from '@progress/kendo-react-intl';
import ColumnMenu from './ColumnMenu';
import { process } from '@progress/kendo-data-query';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemoveFormat, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faClosedCaptioning } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
const mapStateToProps = state => {
        return ({ Login: state.Login })
    }
class DataGridWithSelection extends React.Component {


    columnProps(field) {
        if (this.props.dataState) {
            if (!this.props.hideColumnFilter) {
                const returntype = {
                    field: field,
                    columnMenu: ColumnMenu,
                    headerClassName: this.isColumnActive(field, this.props.dataState) ? 'active' : ''
                }
                return returntype;
            }
        }
    }

    isColumnActive(field, dataState) {
        return GridColumnMenuFilter.active(field, dataState.filter)
    }


    render() {
        const pageSizes = this.props.pageSizes ? this.props.pageSizes : 
        this.props.Login.settings && this.props.Login.settings[4].split(",").map(setting => parseInt(setting))
        return (
            <div>

                <AtTableWrap className="at-list-table">
                    <LocalizationProvider language={this.props.userInfo.slanguagetypecode}>
                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                        <Row noGutters={true}>
                            <Col md="12">
                                <Grid
                                    // data={this.props.data}
                                    sortable
                                    data={this.props.dataState ? process(this.props.data || [],
                                        this.props.dataState) : this.props.data}
                                    style={{ height: '400px' }}
                                    selectedField="selected"
                                    onSelectionChange={this.props.selectionChange}
                                    onHeaderSelectionChange={this.props.headerSelectionChange}
                                    onRowClick={this.props.rowClick}
                                    // ADDed by Neeraj-ALPD-5136
                                    //WorkList Screen -> Including filter in Data selection Kendo Grid 
                                    //Command by neeraj
                                    onDataStateChange={this.props.dataStateChange}
                                    {...this.props.dataState}
                                    scrollable={this.props.scrollable}
                                   // pageable={true}
                                    pageable={this.props.pageable && this.props.data && this.props.data.length > 0
                                         ? { buttonCount: 10, pageSizes: pageSizes, previousNext: false } : false}

                                >

                                    <GridNoRecords>
                                        {this.props.intl.formatMessage({ id: "IDS_NORECORDSAVAILABLE" })}
                                    </GridNoRecords>
                                    {!this.props.isHidemulipleselect ?
                                        <Column
                                            field="selected"
                                            width="50px"
                                            title={this.props.title}
                                            headerSelectionValue={this.props.selectAll}
                                        /> : ""}
                                    {this.props.extractedColumnList.map((item, index) =>
                                        <Column key={index}
                                            width={item.width}
                                            title={this.props.intl.formatMessage({ id: item.idsName })}
                                            {...this.columnProps(item.dataField)}
                                            cell={(row) => (
                                                <td data-tip={row["dataItem"][item.dataField]}>
                                                    {item.isIdsField ?
                                                        <FormattedMessage id={row["dataItem"][item.dataField]} defaultMessage={row["dataItem"][item.dataField]} />
                                                        : row["dataItem"][item.dataField]}
                                                </td>
                                            )} />
                                    )}
                                    {   // ADDed by Neeraj-ALPD-5136
                                        //WorkList Screen -> Including filter in Data selection Kendo Grid 
                                        //Command by neeraj
                                        //start
                                        this.props.isActionRequired ?
                                            <Column
                                                locked
                                                headerClassName="text-center"
                                                title={this.props.intl.formatMessage({ id: 'IDS_ACTION' })}
                                                sort={false}
                                                cell={(row) => (
                                                    <td className={`k-grid-content-sticky k-command-cell pl-0 selectedId === row["dataItem"][this.props.primaryKeyField] ? 'active' : ''`} style={{ left: '0', right: '0', borderRightWidth: '1px', textAlign: 'center' }}>
                                                        <FontIconWrap className="d-font-icon action-icons-wrap"
                                                            data-tip={this.props.intl.formatMessage({ id: "IDS_REMOVE" })} data-place="top"
                                                            onClick={() => this.props.handleClickDelete(row)}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </FontIconWrap>
                                                    </td>
                                                )} />
                                            : ""
                                        //--end
                                    }

                                </Grid>
                            </Col>
                        </Row>
                    </LocalizationProvider >
                </AtTableWrap>
            </div>
        );
    }
}

export default connect(mapStateToProps)(injectIntl(DataGridWithSelection));