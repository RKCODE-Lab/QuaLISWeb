import React from "react";
import { Scheduler, DayView, WeekView, MonthView } from '@progress/kendo-react-scheduler';


class AnalystCalendarBasedOnUser extends React.Component {
    constructor(props) {
        super(props);
       // this.data1 = []
  
        this.state = {
            data:  [],
        };
    }


    render() {
        console.log('data',this.state.data)
        const displayDate = new Date(Date.UTC(currentYear, new Date().getMonth(), new Date().getDate()));
        return (
            <Scheduler data={this.state.data} editable={{
                add: true,
                remove: true,
                drag: true,
                resize: true,
                select: true,
                edit: true
            }} defaultDate={displayDate}>
                <DayView numberOfDays={3} style={{ zorder: 25000 }} />
                <WeekView />
                <MonthView />

            </Scheduler>

        )
    }

    componentDidUpdate(previousProps) {
        console.log('alaystCalender2')
        let data = [];
        if (this.props.userData !== undefined) {
            if (this.props.userData.length !== this.state.data.length) {
                for (let i = 0; i < this.props.userData.length; i++) {
                    data.push(this.props.userData[i].jsondata);
                }
               
                data = data.map((dataItem,i) => ({
                    start: parseAdjust(dataItem.UserStartDate+".000z"),
                    end: parseAdjust(dataItem.UserEndDate+".000z"),
                    title: dataItem.Comments,
                  
                    id: dataItem.id?dataItem.id:i,
                    startTimezone: dataItem.startTimezone,
                    endTimezone: dataItem.endTimezone,
                    isAllDay: dataItem.isAllDay?dataItem.isAllDay:false,
                    description: dataItem.description?dataItem.description:"",
                    recurrenceRule: dataItem.recurrenceRule,
                    recurrenceId: dataItem.recurrenceID,
                    recurrenceExceptions: dataItem.recurrenceException,
                    TaskId: dataItem.TaskId?dataItem.TaskId:i,
                }))
           

            //     data   = [{ id:  "1",
            //     start: parseAdjust("2023-05-08 03:30:00.000"),
            //     startTimezone:undefined,
            //     end: parseAdjust("2023-05-08 04:05:00.000"),
            //     endTimezone: undefined,
            //     isAllDay: false,
            //     title: "hpcl instrument-001",
            //     description: "",
            //     recurrenceRule: undefined,
            //     recurrenceId: undefined,
            //     recurrenceExceptions:undefined,
            //     // roomId: dataItem.roomID,
            //     // ownerID: dataItem.TaskId,
            //     // personId: dataItem.TaskId,
            //   // taskID: 11,
            //   //  UserID: 3
            // }]
                this.setState({ data: data });
            }
        }
    }


    componentDidMount() {
        console.log('alaystCalender1')
        this.setState({ data: [] });
    }
}

export default AnalystCalendarBasedOnUser;
export const currentYear = new Date().getFullYear();
export const parseAdjust = eventDate => {
    const date = new Date(eventDate);
    date.setFullYear(currentYear);
    return date;
};