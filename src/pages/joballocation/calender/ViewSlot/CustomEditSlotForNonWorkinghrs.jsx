
import React from "react";
import { connect } from 'react-redux';
import { parseAdjustDate } from "../NewJobAlloct";
import { SchedulerEditSlot } from "@progress/kendo-react-scheduler";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}


const CustomEditSlotForNonWorkinghrs = (props) => {
    const [formItem, setFormItem] = React.useState(null);
    const handleFormItemChange = React.useCallback(
        (event) => {
            if (!(props.Login.personalLeaveRestrict
                && props.Login.calenderUserHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                &&
                !(props.Login.holidaydateRestrict &&
                    props.Login.calenderPublicHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(props.start)))
                &&
                !(props.Login.commonHolidaydateRestrict
                    && Object.keys(props.Login.calenderCommonHolidays1).some(x =>
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
                && (!props.isWorkDay || props.isWorkHour)) {
                setFormItem(event.value);
            }
        },
        [props.isWorkDay, props.isWorkHour]
    );
    return (
        <SchedulerEditSlot
            {...props}
            formItem={formItem}
            onFormItemChange={handleFormItemChange}
        />
    );
};

export default connect(mapStateToProps, {})(CustomEditSlotForNonWorkinghrs);