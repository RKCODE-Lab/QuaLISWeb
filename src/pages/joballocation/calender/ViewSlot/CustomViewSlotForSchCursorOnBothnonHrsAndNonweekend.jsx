import React from "react";
import { connect } from 'react-redux'; 
import { parseAdjustDate } from "../NewJobAlloct";
import { SchedulerViewSlot } from "@progress/kendo-react-scheduler";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

  class CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend extends React.Component {
    constructor(props) {
        super(props);

    }


    render() { return (
        <SchedulerViewSlot
            {...this.props}
            style={{
                ...this.props.style,
                minHeight: 5,
                 backgroundColor: (
                        //this.props.Login.personalLeaveRestrict && 
                        this.props.Login.calenderUserHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(this.props.start)))
                        || (
                            //this.props.Login.holidaydateRestrict &&
                            this.props.Login.calenderPublicHolidays.some(x => parseAdjustDate(x.start) === parseAdjustDate(this.props.start)))

                        || (
                            //this.props.Login.commonHolidaydateRestrict  && 
                          
                            Object.keys(this.props.Login.calenderCommonHolidays1).some(x =>
                            this.props.Login.calenderCommonHolidays1[x] === 3 ?
                                new Date(this.props.start).getDay() === 0 ? x === "nsunday" :
                                    new Date(this.props.start).getDay() === 1 ? x === "nmonday" :
                                        new Date(this.props.start).getDay() === 2 ? x === "ntuesday" :
                                            new Date(this.props.start).getDay() === 3 ? x === "nwednesday" :
                                                new Date(this.props.start).getDay() === 4 ? x === "nthursday" :
                                                    new Date(this.props.start).getDay() === 5 ? x === "nfriday" :
                                                        new Date(this.props.start).getDay() === 6 ? x === "nsaturday" : false
                                : false
                        ))
                        ? "#c7cdd5"
                        : "",
                // cursor:
                // ((this.props.Login.personalLeaveRestrict 
                //     && this.props.Login.calenderUserHolidays.some(x=>parseAdjustDate(x.start)===parseAdjustDate(this.props.start) )  )
                //     ||
                //     (this.props.Login.holidaydateRestrict 
                //         && this.props.Login.calenderPublicHolidays.some(x=>parseAdjustDate(x.start)===parseAdjustDate(this.props.start) )  ) 
                    
                //         ||
                //         (this.props.Login.commonHolidaydateRestrict
                //             && Object.keys(this.props.Login.calenderCommonHolidays1).some(x =>
                //                 this.props.Login.calenderCommonHolidays1[x] === 3 ?
                //                     new Date(this.props.start).getDay() === 0 ? x === "nsunday" :
                //                         new Date(this.props.start).getDay() === 1 ? x === "nmonday" :
                //                             new Date(this.props.start).getDay() === 2 ? x === "ntuesday" :
                //                                 new Date(this.props.start).getDay() === 3 ? x === "nwednesday" :
                //                                     new Date(this.props.start).getDay() === 4 ? x === "nthursday" :
                //                                         new Date(this.props.start).getDay() === 5 ? x === "nfriday" :
                //                                             new Date(this.props.start).getDay() === 6 ? x === "nsaturday" : false
                //                     : false
                //             )) 
                //     || 
                //     !this.props.isWorkDay || (this.props.isWorkHour!==undefined?!this.props.isWorkHour:false))? "no-drop" : undefined,

            }}
        />
    );
        }
};

export default connect(mapStateToProps, {})(CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend);