import React from "react";
import { Scheduler, TimelineView, DayView, WeekView, MonthView, AgendaView, SchedulerHeader } from '@progress/kendo-react-scheduler';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row } from "react-bootstrap";
import { injectIntl } from "react-intl";
import { guid } from '@progress/kendo-react-common';
import './Calender.css'
import CustomEditItem, {
    CustomEditSlotForMonth,
    CustomSlot,
    CustomSlotForDayAndWeek,
    CustomTask, CustomViewItem, CustomViewSlotForMonth, CustomEditSlot,
    CustomEditSlotForNonWorkinghrs, CustomEditSlotForNonWorkingday,
    CustomViewSlotForSchwithoutCursor, CustomViewSlotForSchCursorOnBothnonHrs,
    CustomViewSlotForSchCursorOnBothnonWorkend, CustomEditSlotForNonWorkinghrsandday,
    CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend
} from "./EditItem";
import CustomItem, { getRandomColor } from './NewCustomItem'
import { FormWithCustomEditor } from "./custom-form";
import { toast } from "react-toastify";
import rsapi from "../../rsapi";
import { constructOptionList, convertDateTimetoStringDBFormat } from "../../components/CommonScript";
import Preloader from '../../components/preloader/preloader.component'
import { Day } from "@progress/kendo-date-math";
import CustomFooter from "./CustomFooter";
import { Switch } from "@progress/kendo-react-inputs";
import { LocalizationProvider } from "@progress/kendo-react-intl";


class NewJobAlloct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            view: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 11).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 11)[0]["scalendersettingvalue"] : 'month',
            startDate: this.props.currentTime,
            selectedRecord: {},
            Users: this.props.Users,
            needUpdate: false,
            loading: false,
            slotDivisions: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 9).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 9)[0]["scalendersettingvalue"]) : 2,
            slotDuration: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 8).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 8)[0]["scalendersettingvalue"]) : 30,

            showHeader: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 13).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 13)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showFooter: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 14).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 14)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showHeaderOnOff: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 12).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 12)[0]["scalendersettingvalue"] === "3" ? true : false : false,
            height: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 18).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 18)[0]["scalendersettingvalue"]) : 300,
            showWorkHours: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 7).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 7)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            currentTimeMarker: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 17).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 17)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            startTime: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 3).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 3)[0]["scalendersettingvalue"] : "00:00",
            endTime: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 4).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 4)[0]["scalendersettingvalue"] : "23:59",
            workDayStart: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 5).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 5)[0]["scalendersettingvalue"] : "10:00",
            workDayEnd: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 6).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 6)[0]["scalendersettingvalue"] : "19:00",
            workWeekStart: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 47).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 47)[0]["scalendersettingvalue"]) : Day.Monday,
            workWeekEnd: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 48).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 48)[0]["scalendersettingvalue"]) : Day.Friday,
            columnWidth: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 10).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 10)[0]["scalendersettingvalue"]) : 300,
            numberOfDays: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 2).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 2)[0]["scalendersettingvalue"]) : 1,
            itemsPerSlot: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 1).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 1)[0]["scalendersettingvalue"]) : 10,
            color: this.props.calenderColor.map(x => x.scolorhexcode),  //["#d5c5c8", "#9da3a4", "#604d53", "#db7f8e", "#ffdbda", "#3F88C5", "#A5C8E4", "#5F91A6", "#761922", "#5F91A6"],
            footerShowSlotDuration: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 16).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 16)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            footerShowSlotDivision: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 15).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 15)[0]["scalendersettingvalue"] === "3" ? true : false : true,

            restrictNonWrkHrsandDay: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 19).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 19)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            restrictNonWrkDays: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 20).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 20)[0]["scalendersettingvalue"] === "3" ? true : false : false,
            restrictNonWrkHrsonWorkingDay: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 21).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 21)[0]["scalendersettingvalue"] === "3" ? true : false : false,
            numberOfDaysForCompactView: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 22).length > 0 ?
                parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 22)[0]["scalendersettingvalue"]) : 7,

            direction: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 38).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 38)[0]["scalendersettingvalue"] === "3" ? true : false : true,


            slotDivisionList: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 39).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 39)[0]["scalendersettingvalue"].split(",").map(x => parseInt(x)) : [1, 2, 3, 4],
            slotDurivationList: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 40).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 40)[0]["scalendersettingvalue"].split(",").map(x => parseInt(x)) : [15, 30, 45, 60],

            numberOfDaysInTimeLine: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 41).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 41)[0]["scalendersettingvalue"]) : 1,
            numberOfDaysForWeek: 7,


            monthAdd: this.props.selectedTest[0].ntransactionstatus !== 23 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 23).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 23)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            monthResize: this.props.selectedTest[0].ntransactionstatus !== 24 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 24).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 24)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            monthEdit: this.props.selectedTest[0].ntransactionstatus !== 25 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 25).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 25)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            monthRemove: this.props.selectedTest[0].ntransactionstatus !== 26 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 26).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 26)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            monthDrag: this.props.selectedTest[0].ntransactionstatus !== 27 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 27).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 27)[0]["scalendersettingvalue"] === "3" ? true : false : true,

            dayAdd: this.props.selectedTest[0].ntransactionstatus !== 28 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 28).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 28)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            dayRemove: this.props.selectedTest[0].ntransactionstatus !== 29 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 29).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 29)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            dayDrag: this.props.selectedTest[0].ntransactionstatus !== 30 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 30).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 30)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            dayResize: this.props.selectedTest[0].ntransactionstatus !== 31 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 31).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 31)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            dayEdit: this.props.selectedTest[0].ntransactionstatus !== 32 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 32).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 32)[0]["scalendersettingvalue"] === "3" ? true : false : true,

            timelineAdd: this.props.selectedTest[0].ntransactionstatus !== 33 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 33).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 33)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            timelineRemove: this.props.selectedTest[0].ntransactionstatus !== 34 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 34).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 34)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            timelineDrag: this.props.selectedTest[0].ntransactionstatus !== 35 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 35).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 35)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            timelineResize: this.props.selectedTest[0].ntransactionstatus !== 36 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 36).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 36)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            timelineEdit: this.props.selectedTest[0].ntransactionstatus !== 37 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 37).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 37)[0]["scalendersettingvalue"] === "3" ? true : false : true,


            weekAdd: this.props.selectedTest[0].ntransactionstatus !== 42 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 42).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 42)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            weekResize: this.props.selectedTest[0].ntransactionstatus !== 43 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 43).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 43)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            weekEdit: this.props.selectedTest[0].ntransactionstatus !== 44 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 44).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 44)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            weekRemove: this.props.selectedTest[0].ntransactionstatus !== 45 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 45).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 45)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            weekDrag: this.props.selectedTest[0].ntransactionstatus !== 46 ? false : this.props.calenderProperties.filter(x => x.ncalendersettingcode === 46).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 46)[0]["scalendersettingvalue"] === "3" ? true : false : true,

            showDayView: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 50).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 50)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showWeekView: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 51).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 51)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showMonthView: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 52).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 52)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showTimeLineView: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 53).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 53)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showCompactView: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 54).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 54)[0]["scalendersettingvalue"] === "3" ? true : false : true,

            showColorInMonth: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 55).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 55)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showColorInAgenda: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 56).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 56)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showColorInWeek: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 57).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 57)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showColorInDay: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 58).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 58)[0]["scalendersettingvalue"] === "3" ? true : false : true,
            showColorInTimeline: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 59).length > 0 ? this.props.calenderProperties.filter(x => x.ncalendersettingcode === 59)[0]["scalendersettingvalue"] === "3" ? true : false : true,


            colorApplybtwDaysInMonth: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 60).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 60)[0]["scalendersettingvalue"]) : 5,
            colorApplybtwDaysInAgenda: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 61).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 61)[0]["scalendersettingvalue"]) : 1,
            colorApplybtwDaysInWeek: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 62).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 62)[0]["scalendersettingvalue"]) : 1,
            colorApplybtwDaysInDay: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 63).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 63)[0]["scalendersettingvalue"]) : 1,
            colorApplybtwDaysInTimeline: this.props.calenderProperties.filter(x => x.ncalendersettingcode === 64).length > 0 ? parseInt(this.props.calenderProperties.filter(x => x.ncalendersettingcode === 64)[0]["scalendersettingvalue"]) : 1,

        }
    }

    handleHeaderChange = () => {
        this.setState({ showHeader: !this.state.showHeader })
    };

    handleFooterChange = () => {
        this.setState({ showFooter: !this.state.showFooter })
    }

    render() {



        var displayDate = this.props.currentTime
        return (
            <>
                <Row>
                    <Col md={12}>
                        <Row className="mt-n4">
                            <Col md={8} className="d-flex">
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
                                    isSearchable={true}
                                    name={"ntechniquecode"}
                                    isDisabled={false}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={false}
                                    isClearable={true}
                                    options={this.props.Technique}
                                    value={this.state.selectedRecord["ntechniquecode"] || ""}
                                    defaultValue={this.props.selectedRecord["ntechniquecode"]}
                                    onChange={(event) => this.onComboChange(event, "ntechniquecode")}
                                    closeMenuOnSelect={true}
                                    formGroupClassName={"single-line-label"}
                                >
                                </FormSelectSearch>
                                <FormSelectSearch
                                    formLabel={this.props.intl.formatMessage({ id: "IDS_USERS" })}
                                    isSearchable={true}
                                    name={"nusercode"}
                                    isDisabled={false}
                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    isMandatory={true}
                                    isClearable={false}
                                    options={this.state.Users || []}
                                    value={this.state.selectedRecord["nusercode"] || ""}
                                    defaultValue={this.state.selectedRecord["nusercode"]}
                                    onChange={(event) => { this.onComboChange(event, "nusercode"); }}
                                    closeMenuOnSelect={true}
                                    formGroupClassName={"single-line-label"}
                                >
                                </FormSelectSearch>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={12}>
                        <div>
                            {this.state.showHeaderOnOff ?
                                <div className="example-config">
                                    <div className="row">
                                        <div className="col-">
                                            {this.props.intl.formatMessage({ id: "IDS_HEADER" })}:{" "}
                                            <Switch defaultChecked={true} checked={this.state.showHeader}
                                                onChange={this.handleHeaderChange} />
                                        </div>
                                        <div className="col">
                                            {this.props.intl.formatMessage({ id: "IDS_FOOTER" })}:{" "}
                                            <Switch defaultChecked={true} checked={this.state.showFooter}
                                                onChange={this.handleFooterChange} />
                                        </div>
                                    </div>
                                </div> : ""}
                            <LocalizationProvider language={this.props.userInfo.slanguagetypecode}>
                                <Scheduler data={this.state.data}
                                    onDataChange={this.handleDataChange}
                                    onDateChange={this.handleDateChange}
                                    view={this.state.view}
                                    onViewChange={this.onViewChange}
                                    height={this.state.height}
                                    editItem={CustomEditItem}
                                    form={FormWithCustomEditor}
                                    defaultDate={displayDate}
                                    rtl={this.state.direction}
                                    header={(props) =>
                                        this.state.showHeader ? <SchedulerHeader {...props} /> : <React.Fragment />
                                    }
                                    footer={(props) =>
                                        // <React.Fragment />
                                        this.state.showFooter ? <CustomFooter {...props}
                                            setSlotDivision={e => this.setState({ slotDivisions: e })}
                                            setSlotDuration={e => this.setState({ slotDuration: e })}
                                            slotDivisions={this.state.slotDivisions}
                                            slotDuration={this.state.slotDuration}

                                            slotDivisionList={this.state.slotDivisionList}
                                            slotDurivationList={this.state.slotDurivationList}

                                            footerShowSlotDuration={this.state.footerShowSlotDuration}
                                            footerShowSlotDivision={this.state.footerShowSlotDivision}
                                            view={this.state.view}
                                        ></CustomFooter> : <React.Fragment />
                                    }
                                    // editSlot={CustomEditSlotForMonth}

                                    // editable={{
                                    //     resize: true,
                                    // }}
                                    item={CustomItem}
                                >

                                    {this.state.showMonthView &&
                                        <MonthView
                                            editable={{
                                                add: this.state.monthAdd,
                                                remove: this.state.monthRemove,
                                                drag: this.state.monthDrag,
                                                resize: this.state.monthResize,
                                                select: true,
                                                edit: this.state.monthEdit
                                            }}
                                            itemsPerSlot={this.state.itemsPerSlot}
                                            editSlot={CustomEditSlotForMonth}
                                            item={CustomItem}

                                            slot={CustomSlot}
                                            viewSlot={CustomViewSlotForMonth}
                                            viewItem={CustomViewItem}
                                        />
                                    }
                                    {this.state.showCompactView &&
                                        <AgendaView
                                            title={this.props.intl.formatMessage({ id: "IDS_COMPACTVIEW" })}
                                            numberOfDays={this.state.numberOfDaysForCompactView}
                                            step={20}
                                            selectedDateFormat={`${this.props.intl.formatMessage({ id: "IDS_FROM" })} : {0:D} ${this.props.intl.formatMessage({ id: "IDS_TO" })}: {1:D}`}
                                            //selectedShortDateFormat={"From: {0:d} To: {1:d}"}
                                            task={CustomTask}
                                            editable={{
                                                add: false,
                                                remove: false,
                                                drag: false,
                                                resize: false,
                                                select: false,
                                                edit: false
                                            }}
                                            slot={CustomSlot}
                                            viewSlot={CustomViewSlotForSchwithoutCursor}
                                            viewItem={CustomViewItem}
                                        // editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}
                                        />}

                                    {this.state.showWeekView ?
                                        this.state.showWorkHours ?
                                            <WeekView
                                                title={this.props.intl.formatMessage({ id: "IDS_WEEK" })}
                                                editable={{
                                                    add: this.state.weekAdd,
                                                    remove: this.state.weekRemove,
                                                    drag: this.state.weekDrag,
                                                    resize: this.state.weekResize,
                                                    select: true,
                                                    edit: this.state.weekEdit
                                                }}
                                                currentTimeMarker={this.state.currentTimeMarker}
                                                startTime={this.state.startTime}
                                                endTime={this.state.endTime}
                                                workDayStart={this.state.workDayStart}
                                                workDayEnd={this.state.workDayEnd}
                                                workWeekStart={this.state.workWeekStart}
                                                workWeekEnd={this.state.workWeekEnd}
                                                slotDuration={this.state.slotDuration}
                                                slotDivisions={this.state.slotDivisions}
                                                slot={CustomSlot}
                                                viewSlot={this.state.restrictNonWrkHrsandDay ? CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend : this.state.restrictNonWrkDays ? CustomViewSlotForSchCursorOnBothnonWorkend : this.state.restrictNonWrkHrsonWorkingDay ? CustomViewSlotForSchCursorOnBothnonHrs : ""}
                                                viewItem={CustomViewItem}
                                                editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}
                                                item={CustomItem}

                                            /> :
                                            <WeekView
                                                title={this.props.intl.formatMessage({ id: "IDS_WEEK" })}
                                                editable={{
                                                    add: this.state.weekAdd,
                                                    remove: this.state.weekRemove,
                                                    drag: this.state.weekDrag,
                                                    resize: this.state.weekResize,
                                                    select: true,
                                                    edit: this.state.weekEdit
                                                }}
                                                showWorkHours={this.state.showWorkHours}
                                                currentTimeMarker={this.state.currentTimeMarker}
                                                startTime={this.state.startTime}
                                                endTime={this.state.endTime}
                                                workDayStart={this.state.workDayStart}
                                                workDayEnd={this.state.workDayEnd}
                                                workWeekStart={this.state.workWeekStart}
                                                workWeekEnd={this.state.workWeekEnd}
                                                slotDuration={this.state.slotDuration}
                                                slotDivisions={this.state.slotDivisions}
                                                slot={CustomSlot}
                                                viewSlot={this.state.restrictNonWrkHrsandDay ? CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend : this.state.restrictNonWrkDays ? CustomViewSlotForSchCursorOnBothnonWorkend : this.state.restrictNonWrkHrsonWorkingDay ? CustomViewSlotForSchCursorOnBothnonHrs : ""}
                                                viewItem={CustomViewItem}
                                                editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}
                                            // item={CustomItem}

                                            />
                                        : <></>}

                                    {this.state.showDayView ?
                                        this.state.showWorkHours ?

                                            <DayView

                                                numberOfDays={this.state.numberOfDays}
                                                // step={5}
                                                editable={{
                                                    add: this.state.dayAdd,
                                                    remove: this.state.dayRemove,
                                                    drag: this.state.dayDrag,
                                                    resize: this.state.dayResize,
                                                    select: true,
                                                    edit: this.state.dayEdit
                                                }}
                                                //showWorkHours={this.state.showWorkHours}
                                                currentTimeMarker={this.state.currentTimeMarker}
                                                startTime={this.state.startTime}
                                                endTime={this.state.endTime}
                                                workDayStart={this.state.workDayStart}
                                                workDayEnd={this.state.workDayEnd}

                                                workWeekStart={this.state.workWeekStart}
                                                workWeekEnd={this.state.workWeekEnd}

                                                slotDuration={this.state.slotDuration}
                                                slotDivisions={this.state.slotDivisions}
                                                // item={CustomItem}

                                                slot={CustomSlot}
                                                viewSlot={this.state.restrictNonWrkHrsandDay ? CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend : this.state.restrictNonWrkDays ? CustomViewSlotForSchCursorOnBothnonWorkend : this.state.restrictNonWrkHrsonWorkingDay ? CustomViewSlotForSchCursorOnBothnonHrs : ""}
                                                viewItem={CustomViewItem}
                                                editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}

                                            />

                                            :
                                            <DayView

                                                numberOfDays={this.state.numberOfDays}
                                                // step={5}
                                                editable={{
                                                    add: this.state.dayAdd,
                                                    remove: this.state.dayRemove,
                                                    drag: this.state.dayDrag,
                                                    resize: this.state.dayResize,
                                                    select: true,
                                                    edit: this.state.dayEdit
                                                }}

                                                showWorkHours={this.state.showWorkHours}
                                                currentTimeMarker={this.state.currentTimeMarker}
                                                startTime={this.state.startTime}
                                                endTime={this.state.endTime}
                                                workDayStart={this.state.workDayStart}
                                                workDayEnd={this.state.workDayEnd}
                                                workWeekStart={this.state.workWeekStart}
                                                workWeekEnd={this.state.workWeekEnd}
                                                slotDuration={this.state.slotDuration}
                                                slotDivisions={this.state.slotDivisions}
                                                // item={CustomItem}
                                                slot={CustomSlot}
                                                viewSlot={this.state.restrictNonWrkHrsandDay ? CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend : this.state.restrictNonWrkDays ? CustomViewSlotForSchCursorOnBothnonWorkend : this.state.restrictNonWrkHrsonWorkingDay ? CustomViewSlotForSchCursorOnBothnonHrs : ""}
                                                viewItem={CustomViewItem}
                                                editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}

                                            />

                                        : <></>
                                    }

                                    {this.state.showTimeLineView ? this.state.showWorkHours ?
                                        <TimelineView

                                            columnWidth={this.state.columnWidth}
                                            numberOfDays={this.state.numberOfDaysInTimeLine}
                                            editable={{
                                                add: this.state.timelineAdd,
                                                remove: this.state.timelineRemove,
                                                drag: this.state.timelineDrag,
                                                resize: this.state.timelineResize,
                                                select: true,
                                                edit: this.state.timelineEdit
                                            }}
                                            //showWorkHours={this.state.showWorkHours}
                                            currentTimeMarker={this.state.currentTimeMarker}
                                            startTime={this.state.startTime}
                                            workDayStart={this.state.workDayStart}
                                            workDayEnd={this.state.workDayEnd}
                                            workWeekStart={this.state.workWeekStart}
                                            workWeekEnd={this.state.workWeekEnd}
                                            slotDuration={this.state.slotDuration}
                                            slotDivisions={this.state.slotDivisions}
                                            //  item={CustomItem}
                                            slot={CustomSlot}
                                            viewSlot={this.state.restrictNonWrkHrsandDay ? CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend : this.state.restrictNonWrkDays ? CustomViewSlotForSchCursorOnBothnonWorkend : this.state.restrictNonWrkHrsonWorkingDay ? CustomViewSlotForSchCursorOnBothnonHrs : ""}
                                            viewItem={CustomViewItem}
                                            editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}



                                        />


                                        :

                                        <TimelineView

                                            columnWidth={this.state.columnWidth}
                                            numberOfDays={this.state.numberOfDaysInTimeLine}
                                            editable={{
                                                add: this.state.timelineAdd,
                                                remove: this.state.timelineRemove,
                                                drag: this.state.timelineDrag,
                                                resize: this.state.timelineResize,
                                                select: true,
                                                edit: this.state.timelineEdit
                                            }}
                                            showWorkHours={this.state.showWorkHours}
                                            currentTimeMarker={this.state.currentTimeMarker}
                                            startTime={this.state.startTime}
                                            workDayStart={this.state.workDayStart}
                                            workDayEnd={this.state.workDayEnd}
                                            workWeekStart={this.state.workWeekStart}
                                            workWeekEnd={this.state.workWeekEnd}
                                            slotDuration={this.state.slotDuration}
                                            slotDivisions={this.state.slotDivisions}
                                            //item={CustomItem}
                                            slot={CustomSlot}
                                            viewSlot={this.state.restrictNonWrkHrsandDay ? CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend : this.state.restrictNonWrkDays ? CustomViewSlotForSchCursorOnBothnonWorkend : this.state.restrictNonWrkHrsonWorkingDay ? CustomViewSlotForSchCursorOnBothnonHrs : ""}
                                            viewItem={CustomViewItem}
                                            editSlot={this.state.restrictNonWrkHrsandDay ? CustomEditSlotForNonWorkinghrsandday : this.state.restrictNonWrkDays ? CustomEditSlotForNonWorkingday : this.state.restrictNonWrkHrsonWorkingDay ? CustomEditSlotForNonWorkinghrs : ""}

                                        />
                                        : <></>
                                    }
                                </Scheduler>
                            </LocalizationProvider>
                        </div>
                    </Col>
                </Row>
                <Preloader loading={this.state.loading} />
            </>

        );
    }


    getDayCalculate = (endDate, startDate, index, view, count) => {
        let color = "";
        const day = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))
        if (view === 'month' && this.state.showColorInMonth) {
            if (day > this.state.colorApplybtwDaysInMonth) {
                if (count <= this.state.color.length) {

                    color = this.state.color[count]
                    count = count + 1;
                } else {
                    color = getRandomColor()
                }
            }
        }
        else if (view === 'agenda' && this.state.showColorInAgenda) {
            if (day > this.state.colorApplybtwDaysInAgenda) {
                if (count <= this.state.color.length) {
                    color = this.state.color[count]
                    count = count + 1;
                } else {
                    color = getRandomColor()
                }
            }
        }
        else if (view === 'week' && this.state.showColorInWeek) {
            if (day > this.state.colorApplybtwDaysInWeek) {
                if (count <= this.state.color.length) {
                    color = this.state.color[count]
                    count = count + 1;
                } else {
                    color = getRandomColor()
                }
            }
        } else if (view === 'day' && this.state.showColorInDay) {
            if (day > this.state.colorApplybtwDaysInDay) {
                if (count <= this.state.color.length) {
                    color = this.state.color[count]
                    count = count + 1;
                } else {
                    color = getRandomColor()
                }
            }
        } else if (view === 'timeline' && this.state.showColorInTimeline) {
            if (day > this.state.colorApplybtwDaysInTimeline) {
                if (count <= this.state.color.length) {
                    color = this.state.color[count]
                    count = count + 1;
                } else {
                    color = getRandomColor()
                }
            }
        }


        return { count, color };
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        this.setState({ loading: true })
        if (fieldName === "ntechniquecode") {
            selectedRecord["ntechniquecode"] = comboData;
            if (comboData != null) {
                //    this.props.getUsers(this.state.selectedRecord.ntechniquecode.value,
                //     this.props.Login.masterData, this.props.Login.userInfo, selectedRecord, this.props.Login.screenName, this.props.Login.masterData);

                return rsapi.post("joballocation/getUsersBasedTechnique", {
                    "ntechniquecode": selectedRecord["ntechniquecode"].value,
                    "ssectioncode": this.props.masterData.JASelectedSample ? this.props.masterData.JASelectedSample.map(sample => sample.nsectioncode).join(",") : "",
                    "nregtypecode": this.props.masterData.realRegTypeValue.nregtypecode,
                    "nregsubtypecode": this.props.masterData.realRegSubTypeValue.nregsubtypecode,
                    "userinfo": this.props.userInfo
                })
                    .then(response => {
                        let Users = [];
                        const UsersMap = constructOptionList(response.data.Users || [], "nusercode", "susername", undefined, undefined, false);
                        Users = UsersMap.get("OptionList");
                        selectedRecord["nusercode"] = "";

                        this.setState({ data: [], selectedRecord, Users, loading: false })
                        // this.props.parentSelectRecord(selectedRecord, [])

                    }).catch(error => {
                        if (error.response.status === 500) {
                            toast.error(error.message);
                        } else {
                            toast.warn(error.response.data);
                        }

                    })

            } else {
                delete selectedRecord["ntechniquecode"];
                delete selectedRecord["nusercode"];
                // this.setState({ selectedRecord });
                this.setState({ selectedRecord, data: [], Users: [], needUpdate: true, loading: false })
                //  this.props.parentSelectRecord(selectedRecord, [])
            }
        } else if (fieldName === "nusercode") {
            selectedRecord["nusercode"] = comboData;
            //  this.props.getAnalystCalenderBasedOnUser(comboData.value, this.props.masterData, this.props.userInfo, selectedRecord)


            return rsapi.post("joballocation/getAnalystCalendarBasedOnUser", {
                "nusercode": comboData.value,
                "userinfo": this.props.userInfo,
                view: this.state.view, startDate: convertDateTimetoStringDBFormat(this.state.startDate, this.props.userInfo),
                days: this.state.view === 'day' ? this.state.numberOfDays : this.state.view === "timeline" ?
                    this.state.numberOfDaysInTimeLine : this.state.view === 'agenda' ? this.state.numberOfDaysForCompactView : this.state.numberOfDaysForWeek
            })
                .then(response => {
                    let data = []

                    for (let i = 0; i < response.data.UserData.length; i++) {
                        data.push({ ...response.data.UserData[i] });
                    }
                    let count = 0;
                    data = data.map((dataItem, i) => {
                        const val = this.getDayCalculate(dataItem.userenddatejson, dataItem.userstartdatejson, i, this.state.view, count)
                        count = val.count
                        return {
                            startDateor: dataItem.userstartdate,
                            endDateor: dataItem.userenddate,
                            start: new Date(dataItem.userstartdatejson),
                            end: new Date(dataItem.userenddatejson),
                            title: dataItem.grouping === "3" ? dataItem.stestsynonym && `${dataItem.stestsynonym}- ${this.props.intl.formatMessage({ id: "IDS_TESTCOUNT" })}:${dataItem.ncount}` :
                                `${dataItem.sarno}- ${dataItem.stestsynonym}`,
                            // title: `ArNo:${dataItem.sarno && dataItem.sarno} - Test Name:${dataItem.stestsynonym && dataItem.stestsynonym} - Status:${dataItem.stransdisplaystatus && dataItem.stransdisplaystatus}`,
                            id: dataItem.id ? dataItem.id : i,
                            startTimezone: dataItem.startTimezone,
                            endTimezone: dataItem.endTimezone,
                            description: dataItem.Comments ? dataItem.Comments : "",
                            Instrument: dataItem.ninstrumentcode && dataItem.ninstrumentcode,
                            InstrumentCategory: dataItem.ninstrumentcatcode && dataItem.ninstrumentcatcode,
                            sarno: dataItem.sarno,
                            ssamplearno: dataItem.ssamplearno,
                            stestsynonym: dataItem.stestsynonym,
                            ntransactionstatus: dataItem.ntransactionstatus,
                            stransdisplaystatus: dataItem.stransdisplaystatus,
                            color: val.color
                            // ntransactiontestcode: dataItem.ntransactiontestcode,
                            //  npreregno: dataItem.npreregno,
                        }
                    })
                    //  this.props.parentSelectRecord(selectedRecord, data)
                    this.setState({ data: data, selectedRecord, needUpdate: true, loading: false });

                }).catch(error => {
                    if (error.response.status === 500) {
                        toast.error(error.message);
                    } else {
                        toast.warn(error.response.data);
                    }

                })
        }
    }

    handleDateChange = (e) => {
        const date = e.value
        const view = this.state.view
        this.setState({ loading: true });
        return rsapi.post("joballocation/getAnalystCalendarBasedOnUserWithDate", {
            "nusercode": this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : -1,
            view: view, startDate: convertDateTimetoStringDBFormat(date, this.props.userInfo),
            "userinfo": this.props.userInfo, days: this.state.view === 'day' ? this.state.numberOfDays : this.state.view === "timeline" ?
                this.state.numberOfDaysInTimeLine : this.state.view === 'agenda' ? this.state.numberOfDaysForCompactView : this.state.numberOfDaysForWeek
        })
            .then(response => {
                let data = [];
                for (let i = 0; i < response.data.UserData.length; i++) {
                    data.push({ ...response.data.UserData[i] });
                }
                let count = 0;
                data = data.map((dataItem, i) => {
                    const val = this.getDayCalculate(dataItem.userenddatejson, dataItem.userstartdatejson, i, this.state.view, count)
                    count = val.count
                    return {
                        start: new Date(dataItem.userstartdatejson),
                        end: new Date(dataItem.userenddatejson),
                        title: dataItem.grouping === "3" ? dataItem.stestsynonym && `${dataItem.stestsynonym}- ${this.props.intl.formatMessage({ id: "IDS_TESTCOUNT" })}:${dataItem.ncount}` :
                            `${dataItem.sarno}- ${dataItem.stestsynonym}`,
                        // title: `ArNo:${dataItem.sarno && dataItem.sarno} - Test Name:${dataItem.stestsynonym && dataItem.stestsynonym} - Status:${dataItem.stransdisplaystatus && dataItem.stransdisplaystatus}`,
                        id: dataItem.id ? dataItem.id : i,
                        startTimezone: dataItem.startTimezone,
                        endTimezone: dataItem.endTimezone,
                        description: dataItem.Comments ? dataItem.Comments : "",
                        Instrument: dataItem.ninstrumentcode && dataItem.ninstrumentcode,
                        InstrumentCategory: dataItem.ninstrumentcatcode && dataItem.ninstrumentcatcode,

                        startDateor: dataItem.userstartdate,
                        endDateor: dataItem.userenddate,
                        // sarno: dataItem.sarno,
                        // ssamplearno: dataItem.ssamplearno,
                        stestsynonym: dataItem.stestsynonym,
                        ntransactionstatus: dataItem.ntransactionstatus,
                        stransdisplaystatus: dataItem.stransdisplaystatus,
                        color: val.color
                        //ntransactiontestcode: dataItem.ntransactiontestcode,
                        //npreregno: dataItem.npreregno,
                    }
                })
                this.setState({ data: data, startDate: date, viewUpdate: true });
            }).catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }

    onViewChange = (e) => {
        this.setState({ loading: true });
        return rsapi.post("joballocation/getAnalystCalendarBasedOnUserWithDate", {
            "nusercode": this.state.selectedRecord["nusercode"] ? this.state.selectedRecord["nusercode"].value : -1, view: e.value, startDate: convertDateTimetoStringDBFormat(this.state.startDate, this.props.userInfo),
            "userinfo": this.props.userInfo,
            days: e.value === 'day' ? this.state.numberOfDays : e.value === "timeline" ?
                this.state.numberOfDaysInTimeLine : e.value === 'agenda' ? this.state.numberOfDaysForCompactView : this.state.numberOfDaysForWeek
        })
            .then(response => {
                let data = [];
                for (let i = 0; i < response.data.UserData.length; i++) {
                    data.push({ ...response.data.UserData[i] });
                }
                let count = 0;
                data = data.map((dataItem, i) => {
                    const val = this.getDayCalculate(dataItem.userenddatejson, dataItem.userstartdatejson, i, e.value, count)
                    count = val.count
                    return {
                        start: new Date(dataItem.userstartdatejson),
                        end: new Date(dataItem.userenddatejson),
                        title: dataItem.grouping === "3" ? dataItem.stestsynonym && `${dataItem.stestsynonym}- ${this.props.intl.formatMessage({ id: "IDS_TESTCOUNT" })}:${dataItem.ncount}` :
                            `${dataItem.sarno}- ${dataItem.stestsynonym}`,
                        id: dataItem.id ? dataItem.id : i,
                        startTimezone: dataItem.startTimezone,
                        endTimezone: dataItem.endTimezone,
                        description: dataItem.Comments ? dataItem.Comments : "",
                        Instrument: dataItem.ninstrumentcode && dataItem.ninstrumentcode,
                        InstrumentCategory: dataItem.ninstrumentcatcode && dataItem.ninstrumentcatcode,
                        //sarno: dataItem.sarno,
                        // ssamplearno: dataItem.ssamplearno,
                        stestsynonym: dataItem.stestsynonym,
                        ntransactionstatus: dataItem.ntransactionstatus,
                        stransdisplaystatus: dataItem.stransdisplaystatus,
                        color: val.color,
                        startDateor: dataItem.userstartdate,
                        endDateor: dataItem.userenddate,
                        // ntransactiontestcode: dataItem.ntransactiontestcode,
                        // npreregno: dataItem.npreregno,
                    }
                });
                this.setState({ data: data, view: e.value, viewUpdate: true });
            }).catch(error => {
                if (error.response.status === 500) {
                    toast.error(error.message);
                } else {
                    toast.warn(error.response.data);
                }
            })
    }


    handleDataChange = ({
        created,
        updated,
        deleted
    }) => {
        let data = this.state.data;
        const aa = created.concat(created.map(item => Object.assign({}, item, {
            id: guid()
        })));

        if (aa.length > 1) {
            if (created[0].ntransactionstatus === -1 || created[0].ntransactionstatus === undefined) {
                const dataTest = data.filter(x => x.insertRecord);
                if (dataTest.length !== this.props.selectedTest.length) {
                    data = data.filter(item => deleted.find(current => current.id === item.id) === undefined) // Find and replace the updated items
                        .map(item => updated.find(current => current.id === item.id) || item) // Add the newly created items and assign an `id`.
                        .concat(this.props.selectedTest.map((y) => {
                            if (dataTest.filter(x => x.ntransactiontestcode === y.ntransactiontestcode).length === 0) {
                                return Object.assign({}, y, {
                                    ...created.map(item => Object.assign({}, item, {
                                        id: guid(), insertRecord: true, title: `${y.sarno && y.sarno}/${y.stestsynonym && y.stestsynonym}`, ntransactionstatus: -1,
                                        startDateor: convertDateTimetoStringDBFormat(item.start, this.props.userInfo), endDateor: convertDateTimetoStringDBFormat(item.end, this.props.userInfo)
                                    }))[0]
                                })
                            }
                        }
                        ))
                    const newArray = data.filter((a) => a)
                    this.setState({ data: newArray });
                    this.props.parentScheduleState(newArray);
                } else {
                    toast.info(this.props.intl.formatMessage({ id: "IDS_TESTALREADYASSIGNEDEDITASSIGNED" }))
                }
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ALLOTTESTCANNOTDRAG" }))
            }
        }

        if (updated.length > 0) {
            if (updated[0].ntransactionstatus === -1 || updated[0].ntransactionstatus === undefined) {
                data = data     // Filter the deleted items
                    .filter(item => deleted.find(current => current.id === item.id) === undefined) // Find and replace the updated items
                    .map(item => updated.find(current => current.id === item.id) || item) // Add the newly created items and assign an `id`.
                    .concat(created.map(item => Object.assign({}, item, {
                        id: guid(), startDateor: convertDateTimetoStringDBFormat(item.start, this.props.userInfo), endDateor: convertDateTimetoStringDBFormat(item.end, this.props.userInfo)
                    })))
                this.setState({ data });
                this.props.parentScheduleState(data);
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_TESTALREADYASSIGNEDEDITASSIGNED" }))
            }
        }

        if (deleted.length > 0) {
            if (deleted[0].ntransactionstatus === -1) {
                this.setState(old => ({
                    data: old.data     // Filter the deleted items
                        .filter(item => deleted.find(current => current.id === item.id) === undefined) // Find and replace the updated items
                        .map(item => updated.find(current => current.id === item.id) || item) // Add the newly created items and assign an `id`.
                        .concat(created.map(item => Object.assign({}, item, {
                        })))
                }));
                this.props.parentScheduleState(data);
            } else {
                toast.info(this.props.intl.formatMessage({ id: "IDS_ALLOTEDCANNOTBEDELETED" }))
            }
        }

    };

    componentDidUpdate() {
        if (this.state.needUpdate) {
            this.setState({ needUpdate: false })
            this.props.parentSelectRecord(this.state.selectedRecord, this.state.data)
        }

        if (this.state.viewUpdate) {
            this.setState({ loading: false, viewUpdate: false })

        }
    }


    // componentDidUpdate(previousProps) {
    //     let data = [];
    //     if (this.props.userData !== undefined && this.state.update) {
    //         if (!(this.props.userData.length <= this.state.data.length)) {
    //             console.log("check")
    //             for (let i = 0; i < this.props.userData.length; i++) {
    //                 data.push({ ...this.props.userData[i] });
    //             }
    //             data = data.map((dataItem, i) => ({
    //                 start: new Date(dataItem.userstartdatejson),
    //                 end: new Date(dataItem.userenddatejson),
    //                 title: dataItem.stestsynonym && `${dataItem.stestsynonym}-sample Count:${dataItem.ncount}`,
    //                 // title: `ArNo:${dataItem.sarno && dataItem.sarno} - Test Name:${dataItem.stestsynonym && dataItem.stestsynonym} - Status:${dataItem.stransdisplaystatus && dataItem.stransdisplaystatus}`,
    //                 id: dataItem.id ? dataItem.id : i,
    //                 startTimezone: dataItem.startTimezone,
    //                 endTimezone: dataItem.endTimezone,
    //                 description: dataItem.Comments ? dataItem.Comments : "",
    //                 Instrument: dataItem.ninstrumentcode && dataItem.ninstrumentcode,
    //                 InstrumentCategory: dataItem.ninstrumentcatcode && dataItem.ninstrumentcatcode,
    //                 //  sarno: dataItem.sarno,
    //                 // ssamplearno: dataItem.ssamplearno,
    //                 stestsynonym: dataItem.stestsynonym,
    //                 ntransactionstatus: dataItem.ntransactionstatus,
    //                 stransdisplaystatus: dataItem.stransdisplaystatus,
    //                 // ntransactiontestcode: dataItem.ntransactiontestcode,
    //                 //  npreregno: dataItem.npreregno,
    //             }))
    //             this.setState({ data: data });
    //         }
    //     }
    // }
}

export default injectIntl(NewJobAlloct);
export const currentYear = new Date().getFullYear();
export const parseAdjust = eventDate => {
    const date = new Date(eventDate);
    date.setFullYear(currentYear);
    return date;
};

export const parseAdjustDate = eventDate => {

    return [
        padTo2Digits(eventDate.getMonth() + 1),
        eventDate.getFullYear(),
        padTo2Digits(eventDate.getDate()),
    ].join('/');
};

export const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}

