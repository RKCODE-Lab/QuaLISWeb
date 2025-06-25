import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import { displayDate, sampleData } from './events-utc';
import { Scheduler, TimelineView, DayView,WeekView, MonthView } from '@progress/kendo-react-scheduler';
import { guid } from '@progress/kendo-react-common';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import {
  callService, crudMaster, validateEsignCredential, updateStore, getGrapicalSchedulerDetail,filterColumnData
} from '../../actions';
import './scheduler.css';
import '@progress/kendo-date-math/tz/Asia/Kolkata';
import '@progress/kendo-date-math/tz/Europe/Amsterdam';
const mapStateToProps = state => {
  return ({ Login: state.Login })
}

class GraphicalScheduler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.Login.masterData.ScheduleData!==undefined?this.props.Login.masterData.ScheduleData:""
    };
    
//     const currentYear = new Date().getFullYear();
  

//   const parseAdjust = eventDate => {
//     const date = new Date(eventDate);
//     date.setFullYear(currentYear);
//     return date;
//   };
    var displayDate = new Date(Date.UTC(currentYear, new Date().getMonth(), new Date().getDate()));

  }

  

  componentDidUpdate(previousProps) {
    let data=[];
   
    if(this.props.Login.masterData.ScheduleData!==undefined)
    {
      if (this.props.Login.masterData.ScheduleData !== previousProps.Login.masterData.ScheduleData) {
    for(let i =0;i<this.props.Login.masterData.ScheduleData.length;i++)
    {
      data.push(this.props.Login.masterData.ScheduleData[i].jsondata);
    }
    
  

   data = data.map(dataItem => ({
    id: dataItem.id,
    start: parseAdjust(dataItem.start),
    startTimezone: dataItem.startTimezone,
    end: parseAdjust(dataItem.end),
    endTimezone: dataItem.endTimezone,
    isAllDay: dataItem.isAllDay,
    title: dataItem.title,
    description: dataItem.description,
    recurrenceRule: dataItem.recurrenceRule,
    recurrenceId: dataItem.recurrenceID,
    recurrenceExceptions: dataItem.recurrenceException,
    roomId: dataItem.roomID,
    ownerID: dataItem.TaskId,
    personId: dataItem.TaskId,
    taskID:dataItem.TaskId
  }))
  this.setState({data});
    }
  }
    
  }
  
  handleDataChange = ({
    created,
    updated,
    deleted
  }) => {
    let scheduleData = {};
    let postParam = undefined;
   //this.state.data= this.props.Login.masterData.ScheduleData!==undefined?this.props.Login.masterData.ScheduleData:"";
  //   const aa= (old => (old) .concat(created.map(item => Object.assign({}, item, {
  //     id: guid()
  //   })))
  // )
   const aa= created.concat(created.map(item => Object.assign({}, item, {
     id: guid()
   })));
   let aa1=aa[0];
//let data1=this.state.data;
// if(updated.length>0)
// {
// const bb=updated.map(item => updated.find(current => current.id === item.id) || item);
// let id=bb[0].TaskID;
// }
  const cc=deleted.filter(item => deleted.find(current => current.id === item.id) ||item.id);
if(aa.length>1)
{
  //scheduleData["grapicalschedulermaster"]["jsondata"]="";
  //scheduleData["grapicalschedulermaster"]["jsondata"]=aa[1];
  scheduleData["graphicalschedulermaster"] = {
    "jsondata": aa[1] 
}
let formRef = {
  "current": "form" 
}
let stitle=aa[1].title;
let srule=aa[1].recurrenceRule;
let stype="";
if(srule!==undefined && srule!==null)
{
stype=srule.substring(5,srule.indexOf(';'));
}
else
{
  stype="NEVER";
}
let saveType=1;
  const inputParam = {
    classUrl: "graphicalscheduler",//this.props.Login.inputParam.classUrl,
    methodUrl: "GraphicalScheduler",
    inputData: {scheduleData,stitle:stitle,sscheduletype:stype, userinfo: this.props.Login.userInfo },
    //formData: formData,
    //isFileupload: true,
    operation: "create",
    saveType,formRef,postParam, searchRef: this.searchRef,
    isClearSearch: this.props.Login.isClearSearch
}
const masterData = this.props.Login.masterData;
this.props.crudMaster(inputParam, masterData, "openModal");
//this.props.crudMaster(inputParam, masterData);

}
if(updated.length>0)
{
  const bb=updated.map(item => updated.find(current => current.id === item.id) || item);
  scheduleData["graphicalschedulermaster"] = {
    "jsondata": bb[0] 
}
let formRef = {
  "current": "form" 
}
let id=bb[0].taskID;
let stitle=bb[0].title;
let srule=bb[0].recurrenceRule;
let stype="";
if(srule!==undefined && srule!==null)
{
stype=srule.substring(5,srule.indexOf(';'));
}
else
{
  stype="NEVER";
}
  let saveType=2;
  const inputParam = {
    classUrl: this.props.Login.inputParam.classUrl,
    methodUrl: "GraphicalScheduler",
    inputData: {scheduleData,stitle:stitle,sscheduletype:stype,ntaskid:id, userinfo: this.props.Login.userInfo },
    //formData: formData,
    //isFileupload: true,
    operation: "update",
    saveType,formRef,postParam, searchRef: this.searchRef,
    isClearSearch: this.props.Login.isClearSearch
}
const masterData = this.props.Login.masterData;
  const updateInfo = {
    typeName: DEFAULT_RETURN,
    data: {
        loadEsign: true, screenData: { inputParam, masterData }, saveType
    }
}
//this.props.updateStore(updateInfo);
this.props.crudMaster(inputParam, masterData, "openModal");
}

if(deleted.length>0)
{
  const cc=deleted.filter(item => deleted.find(current => current.id === item.id) ||item.id);
//   scheduleData["grapicalschedulermaster"] = {
//     "jsondata": bb[0] 
// }
let formRef = {
  "current": "form" 
}
let id=cc[0].taskID;
//let stitle=bb[0].title;
//let srule=bb[0].recurrenceRule;
//let stype="";
// if(srule!==undefined && srule!==null)
// {
// stype=srule.substring(5,srule.indexOf(';'));
// }
// else
// {
//   stype="NEVER";
// }
  let saveType=2;
  const inputParam = {
    classUrl: this.props.Login.inputParam.classUrl,
    methodUrl: "GraphicalScheduler",
    inputData: {userinfo: this.props.Login.userInfo,ntaskid:id },
    //formData: formData,
    //isFileupload: true,
    operation: "delete",
    saveType,formRef,postParam, searchRef: this.searchRef,
    isClearSearch: this.props.Login.isClearSearch
}
const masterData = this.props.Login.masterData;
  const updateInfo = {
    typeName: DEFAULT_RETURN,
    data: {
        loadEsign: true, screenData: { inputParam, masterData }, saveType
    }
}
//this.props.updateStore(updateInfo);
this.props.crudMaster(inputParam, masterData, "openModal");
}
    this.setState(old => ({
      data: old.data     // Filter the deleted items
      .filter(item => deleted.find(current => current.id === item.id) === undefined) // Find and replace the updated items
      .map(item => updated.find(current => current.id === item.id) || item) // Add the newly created items and assign an `id`.
      .concat(created.map(item => Object.assign({}, item, {
        id: guid()
      })))
    }));
   
      
    //   this.props.Login.masterData.ScheduleData=this.state.data ;
    //   let datao=this.state.data;
  };

  render() {
    var displayDate = new Date(Date.UTC(currentYear, new Date().getMonth(), new Date().getDate()));
    //return <Scheduler data={this.state.data} onDataChange={this.handleDataChange} editable={{
      return (
      
      <div className="client-listing-wrap mtop-4 mtop-fixed-breadcrumb">
      
      <Scheduler  data={this.state.data} onDataChange={this.handleDataChange} editable={{
      add: true,
      remove: true,
      drag: true,
      resize: true,
      select: true,
      edit: true
    }} defaultDate={displayDate}>
          {/* <TimelineView /> */}
          <DayView numberOfDays={3} style={{zorder:25000}}/>
          <WeekView />
          <MonthView />
        </Scheduler>;
        </div>
        
      )
  }

}
//export default (GrapicalScheduler)
export default connect(mapStateToProps, {
  callService, crudMaster, validateEsignCredential,
  updateStore, getGrapicalSchedulerDetail, filterColumnData
})(injectIntl(GraphicalScheduler));
export const currentYear = new Date().getFullYear();
export const parseAdjust = eventDate => {
  const date = new Date(eventDate);
  date.setFullYear(currentYear);
  return date;
};