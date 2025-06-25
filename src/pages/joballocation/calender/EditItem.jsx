import {
    SchedulerEditItem, SchedulerEditSlot,
    SchedulerSlot, SchedulerTask, SchedulerViewItem, SchedulerViewSlot
} from "@progress/kendo-react-scheduler";
import React from "react";
import { connect } from 'react-redux';
import { getInstrumentForSchedule } from '../../../actions'
//import { FormWithCustomEditor } from './custom-form';
import { toast } from "react-toastify";
import { parseAdjustDate } from "./NewJobAlloct";
import { intl } from "../../../components/App"
import { Button } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { CustomItemTask } from "./NewCustomItem";
import { useAsyncFocusBlur } from "@progress/kendo-react-common";


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

const CustomEditItem = (props) => {
    const ref = React.useRef(null);
    //  const [show, setShow] = React.useState(false);
    const [formItem, setFormItem] = React.useState(null);
    const [focused, setFocused] = React.useState(false);
    // const intl = useInternationalization();
    //const { onFocus, onBlur } = props;


    // const handleFocus = React.useCallback(
    //     (event) => {
    //         setShow(true);
    //         if (props.onFocus) {
    //             props.onFocus(event);
    //         }
    //     },
    //     [props]
    // );

    // const handleBlur = React.useCallback(
    //     (event) => {
    //       setShow(false);

    //       // Call the default `onBlur` handler
    //       if (onBlur) {
    //         onBlur(event);
    //       }
    //     },
    //     [onBlur]
    //   );

    // const handleCloseClick = React.useCallback(() => {
    //     setShow(false);
    // }, []);
    // const handleEditClick = React.useCallback(() => {
    //     console.log("hello1", props.dataItem);
    //     if (props.dataItem &&
    //         props.dataItem.InstrumentCategory) {
    //         if (props.dataItem.ntransactionstatus) {
    //             if (props.dataItem.ntransactionstatus !== 20) {
    //                 props.getInstrumentForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo);
    //                 setFormItem(props.dataItem);
    //                 setShow(false);
    //             } else {
    //                 toast.info("Already allocted")
    //             }

    //         } else {
    //             props.getInstrumentForSchedule(props.dataItem.InstrumentCategory, props.Login.userInfo);
    //             setFormItem(props.dataItem);
    //             setShow(false);
    //         }

    //     }

    // }, [props.dataItem]);
    const handleFormItemChange = React.useCallback((event) => {

        if (event.value) {
            if (event.value.ntransactionstatus) {
                if (event.value.ntransactionstatus !== 20) {
                    setFormItem(event.value);
                }
            } else {
                setFormItem(event.value);
            }

        } else {
            setFormItem(event.value);
        }

    }, []);


    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };
    const { onFocus, onBlur } = useAsyncFocusBlur({
        onFocus: handleFocus,
        onBlur: handleBlur,
    });

    return (
        <React.Fragment>
            <SchedulerEditItem
                ref={ref}
                {...props}
                // style={{
                //     ...props.style,
                //     // backgroundColor:  "yellow",
                //     // color:"black"
                //     //  height: '100px'
                //     //background: `url(${props.dataItem.image})`,
                // }}

                style={{
                    ...props.style,
                    boxShadow: focused ? "rgb(4 20 43 / 75%) 0px 5px 20px" : undefined,
                }}
                // onFocus={handleFocus}
                onFocus={onFocus}
                onBlur={onBlur}
                formItem={formItem}
                onFormItemChange={handleFormItemChange}
                //form={FormWithCustomEditor}
                // onDoubleClick={handleFormItemChange1
                // }
                onDoubleClickAction={null}
            />

        </React.Fragment>
    );
};
export default connect(mapStateToProps, { getInstrumentForSchedule })(CustomEditItem);

export const CustomTask = (props) => {
    return (
        <React.Fragment>
            <SchedulerTask
                {...props}

                style={{
                    ...props.style,
                    backgroundColor: props.dataItem.ntransactionstatus !== -1 ? props.dataItem.color : "#175a8d",
                    //  borderRadius: "8px",
                    // height: 32,
                }}

            >  </SchedulerTask>

        </React.Fragment>
    );
};

// export const CustomEditSlot = (props) => {
//     const [formItem, setFormItem] = React.useState(null);
//     const handleFormItemChange = React.useCallback(
//         (event) => {
//             if (props.isWorkDay && props.isWorkHour) {
//                 setFormItem(event.value);
//             }
//         },
//         [props.isWorkDay, props.isWorkHour]
//     );
//     return (
//         <SchedulerEditSlot
//             {...props}
//             formItem={formItem}
//             onFormItemChange={handleFormItemChange}
//         />
//     );
// };


export const CustomViewSlot = (props) => {
    return (
        props.isAllDay ? null : <SchedulerViewSlot
            {...props}
            style={{
                ...props.style,
                //  cursor: !props.isWorkDay || !props.isWorkHour ? "no-drop" : undefined,
            }}
        />
    );
};

export const CustomEditSlotForMonth = (props) => {
    const [formItem, setFormItem] = React.useState(null);
    const handleFormItemChange = React.useCallback(
        (event) => {
            if (event.value) {
                if (event.value.buttonClick) {
                    if (event.value.ntransactionstatus) {
                        if (event.value.ntransactionstatus !== 20) {  //  setFormItem({...event.value,Ins:[{text:"1",value:"1"}]});
                            setFormItem(event.value);
                            // setFormItem({ ...event.value, Ins: [{ text: "1", value: "1" }] });
                        } else {
                            toast.info(intl.formatMessage({ id: "IDS_ALREADYALLOTED" }))
                        }

                    } else {
                        //  setFormItem({...event.value,Ins:[{text:"1",value:"1"}]});
                        setFormItem(event.value);
                    }
                }
            } else {
                //  setFormItem({...event.value,Ins:[{text:"1",value:"1"}]});
                setFormItem(event.value);
            }
        },
        []
    );
    return (
        <SchedulerEditSlot
            {...props}
            //  onDoubleClick={ondoubleClick}
            formItem={formItem}
            onFormItemChange={handleFormItemChange}
        > {props.children}
            {/* <Button onClick={(e) => handleFormItemChange({
                value: {
                    start: props.start,
                    end: props.end, isAllDay: true
                }
            })} >{"to"}</Button> */}
            {props.editable.add &&
                <Button className="btn btn-circle outline-grey nav-link bg-transparent" role="button"
                    // hidden={this.props.userRoleControlRights.indexOf(this.props.addId) === -1}
                    // data-tip={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                    onClick={(e) => handleFormItemChange({
                        value: {
                            start: props.start,
                            end: props.end, isAllDay: true, buttonClick: true
                        }
                    })}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
            }
        </SchedulerEditSlot>
    );
};

export const CustomSlot = (props) => {

    { console.log("checkingg", props) }
    return (

        <SchedulerSlot
            // isWorkDay={true}
            // workWeekStart={3}
            // workWeekEnd={5}
            {...props}
            style={{
                ...props.style,
                backgroundColor: parseAdjustDate(props.start) === parseAdjustDate(new Date())
                    ? "#c7cdd5"
                    : "",
                cursor: props.isWorkDay ? undefined : "no-drop",
                // backgroundColor: (!props.isWorkHour || !props.isWorkDay)
                //     ? "#c7cdd5"
                //     : "",


                //content:"Today"
            }}
        >
            {props.children}
            {/* {parseAdjustDate(props.start) === parseAdjustDate(new Date()) ? <div style={{
                "position": "relative",
                "bottom": "12px",
                "left": "50px"
            }}  >
                
                <Button onClick={(e) => handleButtonClick(e)}>{"today"} </Button>
                 </div>
                
                : ""} */}

        </SchedulerSlot >
    );
};


export const CustomSlotForDayAndWeek = (props) => {
    return (
        <SchedulerSlot
            {...props}
            style={{
                ...props.style,
                backgroundColor: parseAdjustDate(props.start) === parseAdjustDate(new Date())
                    ? "#c7cdd5"
                    : "",
            }}
        >
            {props.children}
        </SchedulerSlot>
    );
};


export const CustomViewItem = (props) => {
    return (
        <SchedulerViewItem
            {...props}
            style={{
                ...props.style,
                height: "auto",
            }}
        >
            {props.children}
        </SchedulerViewItem>
    );
};

export const CustomViewSlotForSchCursorOnBothnonHrsAndNonweekend = (props) => {
    return (
        <SchedulerViewSlot
            {...props}
            style={{
                ...props.style,
                minHeight: 5,
                cursor: !props.isWorkDay || !props.isWorkHour ? "no-drop" : undefined,
            }}
        />
    );
};


export const CustomViewSlotForSchCursorOnBothnonHrs = (props) => {
    return (
        <SchedulerViewSlot
            {...props}
            style={{
                ...props.style,
                minHeight: 5,
                cursor: !props.isWorkDay ? undefined : !props.isWorkHour ? "no-drop" : undefined,
            }}
        />
    );
};

export const CustomViewSlotForSchCursorOnBothnonWorkend = (props) => {
    return (
        <SchedulerViewSlot
            {...props}
            style={{
                ...props.style,
                minHeight: 5,
                cursor:"no-drop" //!props.isWorkDay ? "no-drop" : undefined,
            }}
        />
    );
};

export const CustomViewSlotForSchwithoutCursor = (props) => {
    return (
        <SchedulerViewSlot
            {...props}
            style={{
                ...props.style,
                minHeight: 5
            }}
        />
    );
};

export const CustomViewSlotForMonth = (props) => {
    return (
        <SchedulerViewSlot
            {...props}
            style={{
                ...props.style,
                minHeight: 10,
                cursor:  "no-drop" ,
            }}
        />
    );
};


export const CustomEditSlotForNonWorkinghrsandday = (props) => {
    const [formItem, setFormItem] = React.useState(null);
    const handleFormItemChange = React.useCallback(
        (event) => {
            if (props.isWorkDay && props.isWorkHour) {
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

export const CustomEditSlotForNonWorkinghrs = (props) => {
    const [formItem, setFormItem] = React.useState(null);
    const handleFormItemChange = React.useCallback(
        (event) => {
            if (!props.isWorkDay || props.isWorkHour) {
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

export const CustomEditSlotForNonWorkingday = (props) => {
    const [formItem, setFormItem] = React.useState(null);
    const handleFormItemChange = React.useCallback(
        (event) => {
            if (props.isWorkDay) {
                setFormItem(event.value);
            }
        },
        [props.isWorkDay]
    );
    return (
        <SchedulerEditSlot
            {...props}
            formItem={formItem}
            onFormItemChange={handleFormItemChange}
        />
    );
};