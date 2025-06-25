import React from "react";
import { connect } from 'react-redux';
import { parseAdjustDate } from "./NewJobAlloct";
import { SchedulerSlot } from "@progress/kendo-react-scheduler";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

const CustomSlotForMonth = (props) => {

    { console.log("checkingg", props) }
    return (

        <SchedulerSlot
            {...props}
            style={{
                ...props.style,
                minHeight: 120,
                // backgroundColor: parseAdjustDate(props.start) === parseAdjustDate(new Date())
                //     ? "#c7cdd5"
                //     : "",

                backgroundColor: (props.Login.personalLeaveRestrict && props.Login.calenderUserHolidays&&props.Login.calenderUserHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                    || (props.Login.holidaydateRestrict && props.Login.calenderPublicHolidays&&props.Login.calenderPublicHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                    || (props.Login.commonHolidaydateRestrict && props.Login.calenderCommonHolidays1&&Object.keys(props.Login.calenderCommonHolidays1).some(x =>
                        props.Login.calenderCommonHolidays1[x] === 3 ?
                            new Date(props.start).getDay() === 0 ? x === "nsunday" :
                                new Date(props.start).getDay() === 1 ? x === "nmonday" :
                                    new Date(props.start).getDay() === 2 ? x === "ntuesday" :
                                        new Date(props.start).getDay() === 3 ? x === "nwednesday" :
                                            new Date(props.start).getDay() === 4 ? x === "nthursday" :
                                                new Date(props.start).getDay() === 5 ? x === "nfriday" :
                                                    new Date(props.start).getDay() === 6 ? x === "nsaturday" : false
                            : false
                    ))
                    ? "#c7cdd5"
                    : "",

                cursor:
                    (props.Login.personalLeaveRestrict &&
                        props.Login.calenderUserHolidays&&props.Login.calenderUserHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                        ||
                        (props.Login.holidaydateRestrict && Object.keys(props.Login.calenderCommonHolidays1).some(x =>
                            props.Login.calenderCommonHolidays1[x] === 3 ?

                                new Date(props.start).getDay() === 0 ? x === "nsunday" :
                                    new Date(props.start).getDay() === 1 ? x === "nmonday" :
                                        new Date(props.start).getDay() === 2 ? x === "ntuesday" :
                                            new Date(props.start).getDay() === 3 ? x === "nwednesday" :
                                                new Date(props.start).getDay() === 4 ? x === "nthursday" :
                                                    new Date(props.start).getDay() === 5 ? x === "nfriday" :
                                                        new Date(props.start).getDay() === 6 ? x === "nsaturday" : false


                                : false
                        ))
                        ||

                        (props.Login.holidaydateRestrict &&
                            props.Login.calenderPublicHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                        ?
                        "no-drop" : undefined,
            }}
        >
            {props.children}

        </SchedulerSlot >
    );
};

export default connect(mapStateToProps, {})(CustomSlotForMonth);