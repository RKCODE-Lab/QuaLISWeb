import { SchedulerEditTask, SchedulerItem, useSchedulerEditItemFormItemContext, useSchedulerEditItemRemoveItemContext, useSchedulerEditItemShowOccurrenceDialogContext, useSchedulerEditItemShowRemoveDialogContext } from "@progress/kendo-react-scheduler";
import React from "react";
import { Popup } from "@progress/kendo-react-popup";
import { connect } from 'react-redux';
import { getInstrumentNameForSchedule,clearInstrumentLoginData } from '../../actions'
import { FormWithCustomEditor } from './custom-form';
import { toast } from "react-toastify";
import { Card,CardBody, CardHeader,CardTitle } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { useAsyncFocusBlur } from "@progress/kendo-react-common"; 
import { intl } from '../../components/App';
import { CustomTask } from "./EditItem";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}


 const CustomItem = (props) => {
   // const intl = useInternationalization();
    const item = React.useRef(null);
    const [show, setShow] = React.useState(false);
    const resourceWithColor = props.group.resources.find(
      (resource) =>
        resource.colorField && resource[resource.colorField] !== undefined
    );
    const color =
      resourceWithColor &&
      resourceWithColor.colorField &&
      resourceWithColor[resourceWithColor.colorField];
    const [formItem, setFormItem] = useSchedulerEditItemFormItemContext();
    const [, setRemoveItem] = useSchedulerEditItemRemoveItemContext();
    const [, setShowOccurrenceDialog] =
      useSchedulerEditItemShowOccurrenceDialogContext();
    const [, setShowRemoveDialog] = useSchedulerEditItemShowRemoveDialogContext();
    const handleClick = React.useCallback(
      (event) => {
        setShow(true);
        if (props.onClick) {
          props.onClick(event);
        }
      },
      [props]
    );
    const handleBlur = React.useCallback(
      (event) => {
        setShow(false);
        if (props.onBlur) {
          props.onBlur(event);
        }
      },
      [props]
    );
    const handleCloseClick = React.useCallback(() => {
      setShow(false);
    }, [setShow]);


    const handleEditClick = React.useCallback(() => {


        if (props.dataItem &&
            props.dataItem.InstrumentCategory) {
            if (props.dataItem.ntransactionstatus) {
                if (props.dataItem.ntransactionstatus === -1) {
                    props.getInstrumentNameForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo ,true,props.dataItem.InstrumentName);
                    setFormItem(props.dataItem);
                    setShow(false);
                    setFormItem(props.dataItem);
                } else {
                    toast.info("Already allocted")
                }

            } else {
                props.getInstrumentNameForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo,true,props.dataItem.InstrumentName);
                setFormItem(props.dataItem);
                setShow(false);
                setFormItem(props.dataItem);
            }

        }else{
          if (props.dataItem.ntransactionstatus) {
            if (props.dataItem.ntransactionstatus === -1) {
              setFormItem(props.dataItem);
              setShow(false);
              setFormItem(props.dataItem);
            } else {
              toast.info("Already allocted")
          }
          }else{
           // props.getInstrumentForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo);
            setFormItem(props.dataItem);
            setShow(false);
            setFormItem(props.dataItem);
          }
        }

      //setShow(false);
      
    //   if (props.isRecurring) {
    //     setShowOccurrenceDialog(true);
    //   }
    }, [setFormItem, props.dataItem, props.isRecurring, setShowOccurrenceDialog]);
    const handleDeleteClick = React.useCallback(() => {
      props.clearInstrumentLoginData();
      setShow(false);
      setRemoveItem(props.dataItem);
      if (props.isRecurring) {
        setShowOccurrenceDialog(true);
      } else {
        setShowRemoveDialog(true);
      }
    }, [
      setRemoveItem,
      props.dataItem,
      props.isRecurring,
      setShowOccurrenceDialog,
      setShowRemoveDialog,
    ]);
    const handleFormItemChange = React.useCallback((event) => {

        if(event.value){
            if(event.value.ntransactionstatus){
                if(event.value.ntransactionstatus!==20){
                    setFormItem(event.value);
                }else{
                    toast.info("Already Allocted")
                }

            }else{
                setFormItem(event.value);
            }

        }else{
            setFormItem(event.value);
        }

    }, []);
    const { onFocus, onBlur } = useAsyncFocusBlur({
      onFocus: props.onFocus,
      onBlur: handleBlur,
    });
    return (
   //   {intl.formatDate(props.zonedStart, "t")}
  // {intl.formatDate(props.zonedEnd, "t")}
      <React.Fragment>
        <SchedulerItem
          ref={item}
          {...props}
          onClick={handleClick}
          onFocus={onFocus}
          onBlur={onBlur}
          formItem={formItem}
          onFormItemChange={handleFormItemChange}
          form={FormWithCustomEditor}
          style={{
            ...props.style,
            backgroundColor: props.dataItem.ntransactionstatus!==-1 ? props.dataItem.color : "#175a8d",
          }}
        >
        </SchedulerItem>
        
        <Popup
          anchor={item.current && item.current.element}
          show={show}
          style={{
            width: 300,
          }}
          anchorAlign={{
            horizontal: "right",
            vertical: "center",
          }}
          popupAlign={{
            horizontal: "left",
            vertical: "center",
          }}
        >
          <div tabIndex={-1} onFocus={onFocus} onBlur={onBlur}>
            <Card>
              <CardHeader className="ml-auto pb-0">
               {props.editable&&props.editable.edit&&  props.dataItem.ntransactionstatus!==20&&
                <Button
                  iconClass="k-icon k-i-edit"
                  fillMode="flat"
                  onClick={handleEditClick}
                />}
                 {props.editable&&props.editable.remove&& props.dataItem.ntransactionstatus!==20&&
                <Button
                  iconClass="k-icon k-i-delete"
                  fillMode="flat"
                  onClick={handleDeleteClick}
                />
                 }
                <Button
                  iconClass="k-icon k-i-close"
                  fillMode="flat"
                  onClick={handleCloseClick}
                />
              </CardHeader>
              <CardBody>
                <CardTitle>
                  <div className="row">
                    <div className="col-1">
                      <div
                        style={{
                          backgroundColor: color,
                          width: 16,
                          height: 16,
                          position: "relative",
                          top: "50%",
                          borderRadius: 4,
                          transform: "translateY(-50%)",
                        }}
                      />
                    </div>
                    <div className="col">
                      <div>{props.title}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-1" />
                    <div className="col">
                      {/* <small>
                        {intl.formatDate(props.zonedStart, "EEEE, d MMMM")}
                      </small> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-1">
                      <span className="k-icon k-i-clock" />
                    </div>
                    <div className="col">
                      <div>{intl.formatMessage({ id: "IDS_FROM" })}{": "}  {props.dataItem.startDateor}</div> 
                      <div>{intl.formatMessage({ id: "IDS_TO" })}{": "}  {props.dataItem.endDateor} </div>

                      {props.insertRecord!==true||props.gouping==="3"  &&
                      <div>{intl.formatMessage({ id: "IDS_TESTCOUNT" })}{": "} {props.count}</div>}
                    </div>
                  </div>
                </CardTitle>
              </CardBody>
            </Card>
          </div>
        </Popup>
      </React.Fragment>
    );
  };
  export default connect(mapStateToProps, { getInstrumentNameForSchedule,clearInstrumentLoginData })(CustomItem);



  export const CustomItemTask = (props) => {
    // const intl = useInternationalization();
     const item = React.useRef(null);
     const [show, setShow] = React.useState(false);
     const resourceWithColor = props.group.resources.find(
       (resource) =>
         resource.colorField && resource[resource.colorField] !== undefined
     );
     const color =
       resourceWithColor &&
       resourceWithColor.colorField &&
       resourceWithColor[resourceWithColor.colorField];
     const [formItem, setFormItem] = useSchedulerEditItemFormItemContext();
     const [, setRemoveItem] = useSchedulerEditItemRemoveItemContext();
     const [, setShowOccurrenceDialog] =
       useSchedulerEditItemShowOccurrenceDialogContext();
     const [, setShowRemoveDialog] = useSchedulerEditItemShowRemoveDialogContext();
     const handleClick = React.useCallback(
       (event) => {
         setShow(true);
         if (props.onClick) {
           props.onClick(event);
         }
       },
       [props]
     );
     const handleBlur = React.useCallback(
       (event) => {
         setShow(false);
         if (props.onBlur) {
           props.onBlur(event);
         }
       },
       [props]
     );
     const handleCloseClick = React.useCallback(() => {
       setShow(false);
     }, [setShow]);
 
 
     const handleEditClick = React.useCallback(() => {
 
 
         if (props.dataItem &&
             props.dataItem.InstrumentCategory) {
             if (props.dataItem.ntransactionstatus) {
                 if (props.dataItem.ntransactionstatus === -1) {
                     props.getInstrumentForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo);
                     setFormItem(props.dataItem);
                     setShow(false);
                     setFormItem(props.dataItem);
                 } else {
                     toast.info("Already allocted")
                 }
 
             } else {
                 props.getInstrumentForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo);
                 setFormItem(props.dataItem);
                 setShow(false);
                 setFormItem(props.dataItem);
             }
 
         }else{
           if (props.dataItem.ntransactionstatus) {
             if (props.dataItem.ntransactionstatus === -1) {
               setFormItem(props.dataItem);
               setShow(false);
               setFormItem(props.dataItem);
             } else {
               toast.info("Already allocted")
           }
           }else{
            // props.getInstrumentForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo);
             setFormItem(props.dataItem);
             setShow(false);
             setFormItem(props.dataItem);
           }
         }
 
       //setShow(false);
       
     //   if (props.isRecurring) {
     //     setShowOccurrenceDialog(true);
     //   }
     }, [setFormItem, props.dataItem, props.isRecurring, setShowOccurrenceDialog]);
     const handleDeleteClick = React.useCallback(() => {
       setShow(false);
       setRemoveItem(props.dataItem);
       if (props.isRecurring) {
         setShowOccurrenceDialog(true);
       } else {
         setShowRemoveDialog(true);
       }
     }, [
       setRemoveItem,
       props.dataItem,
       props.isRecurring,
       setShowOccurrenceDialog,
       setShowRemoveDialog,
     ]);
     const handleFormItemChange = React.useCallback((event) => {
 
         if(event.value){
             if(event.value.ntransactionstatus){
                 if(event.value.ntransactionstatus!==20){
                     setFormItem(event.value);
                 }else{
                     toast.info("Already Allocted")
                 }
 
             }else{
                 setFormItem(event.value);
             }
 
         }else{
             setFormItem(event.value);
         }
 
     }, []);
     const { onFocus, onBlur } = useAsyncFocusBlur({
       onFocus: props.onFocus,
       onBlur: handleBlur,
     });
     return (
       
       <React.Fragment>

         <SchedulerItem
           ref={item}
           {...props}
           onClick={handleClick}
           onFocus={onFocus}
           onBlur={onBlur}
           formItem={formItem}
           onFormItemChange={handleFormItemChange}
           form={FormWithCustomEditor}
           style={{
             ...props.style,
             backgroundColor: props.dataItem.ntransactionstatus!==-1 ? props.dataItem.color : "pink",
           }}
         >
         </SchedulerItem>
         
         <Popup
           anchor={item.current && item.current.element}
           show={show}
           style={{
             width: 300,
           }}
           anchorAlign={{
             horizontal: "right",
             vertical: "center",
           }}
           popupAlign={{
             horizontal: "left",
             vertical: "center",
           }}
         >
           <div tabIndex={-1} onFocus={onFocus} onBlur={onBlur}>
             <Card>
               <CardHeader className="ml-auto pb-0">
                {props.dataItem.ntransactionstatus!==20&&
                 <Button
                   iconClass="k-icon k-i-edit"
                   fillMode="flat"
                   onClick={handleEditClick}
                 />}
                  {props.dataItem.ntransactionstatus!==20&&
                 <Button
                   iconClass="k-icon k-i-delete"
                   fillMode="flat"
                   onClick={handleDeleteClick}
                 />
                  }
                 <Button
                   iconClass="k-icon k-i-close"
                   fillMode="flat"
                   onClick={handleCloseClick}
                 />
               </CardHeader>
               <CardBody>
                 <CardTitle>
                   <div className="row">
                     <div className="col-1">
                       <div
                         style={{
                           backgroundColor: color,
                           width: 16,
                           height: 16,
                           position: "relative",
                           top: "50%",
                           borderRadius: 4,
                           transform: "translateY(-50%)",
                         }}
                       />
                     </div>
                     <div className="col">
                       <div>{props.title}</div>
                     </div>
                   </div>
                   <div className="row">
                     <div className="col-1" />
                     <div className="col">
                       <small>
                         {/* {intl.formatDate(props.zonedStart, "EEEE, d MMMM")} */}
                       </small>
                     </div>
                   </div>
                   <div className="row">
                     <div className="col-1">
                       <span className="k-icon k-i-clock" />
                     </div>
                     <div className="col">
                       <div>{intl.formatMessage({ id: "IDS_FROM" })}{": "} {intl.formatDate(props.zonedStart, "t")}</div>
                       <div>{intl.formatMessage({ id: "IDS_TO" })}{": "} {intl.formatDate(props.zonedEnd, "t")}</div>
 
                       {props.insertRecord&&
                       <div>{intl.formatMessage({ id: "IDS_TESTCOUNT" })}{": "} {props.count}</div>}
                     </div>
                   </div>
                 </CardTitle>
               </CardBody>
             </Card>
           </div>
         </Popup>
       </React.Fragment>
     );
   };
   

  export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }