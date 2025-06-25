import React from "react";
import { Scheduler,DayView,WeekView, MonthView } from '@progress/kendo-react-scheduler';
import { Row,Col } from "react-bootstrap";
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

class AnalystCalendar extends React.Component{
    constructor (props){
        super(props);

        this.state = {
            data: [],
        };
    }
    

    render(){
            // let data=[];
            // let UserData=this.props.UserData;
            // if(UserData !=undefined && UserData.length>0){
            //     for(let i =0;i< this.props.UserData.length;i++){
            //         data.push(this.props.UserData[i].stransdisplaystatus);
            //     }
            //     this.setState({data:data})
            // }

        return(
           
            // if(this.props.UserData!==undefined){
            //     if (this.props.UserData !== previousProps.UserData) {
            //         for(let i =0;i< this.props.UserData.length;i++){
            //             data.push(this.props.UserData[i].stransdisplaystatus);
            //         }
            //         this.setState({data});
            //     }
            // }   
                


                <Scheduler data={this.state.data}  defaultDate={new Date()}>
                        <DayView numberOfDays={3} style={{zorder:25000}}/>
                        <WeekView />
                        <MonthView />

                </Scheduler> 


          
               
           
             
                          
        )
    }

    componentDidUpdate(previousProps){
        let data=[];
   
        if(this.props.UserData!==undefined){
            if (this.props !== previousProps.props) {
                for(let i =0;i< this.props.UserData.length;i++){
                    data.push(this.props.UserData[i].jsonuidata);
                }

                data = data.map(dataItem => ({
                    start: parseAdjust(dataItem.UserStartDate),
                    end: parseAdjust(dataItem.UserEndDate),
                    title: dataItem.Comments
                   
                }))
                this.setState({data:data});
            }
        }   
    }     

    
}

export default AnalystCalendar;
export const currentYear = new Date().getFullYear();
export const parseAdjust = eventDate => {
  const date = new Date(eventDate);
  date.setFullYear(currentYear);
  return date;
};