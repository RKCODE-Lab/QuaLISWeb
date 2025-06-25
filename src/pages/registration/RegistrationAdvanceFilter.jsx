import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Nav, Overlay, Popover } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
//import { ReactComponent as FilterIcon } from '../assets/image/filer-icon.svg';

import './registration.css'
function AdvFilter(props) {
    const [show, setShow] = React.useState(props.showFilter);
    const [target, setTarget] = React.useState(null);
    const ref = React.useRef(null);

    const handleClick = (event, flag) => {
        document.body.classList.add('no-scroll');
        setTarget(event.target);
        if (flag === 1) {
            setShow(!show)
            props.showModalBg(true)
        } else {
            document.body.classList.remove('no-scroll');
            setShow(false)
            props.showModalBg(false)
        }
    };
    const handleSubmitClick = (event) => {
        document.body.classList.remove('no-scroll');
        setShow(false)
        props.showModalBg(false)
        props.onFilterSubmit(event)
    }
    return (
        <div>
            {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
            {/* <ReactTooltip place="bottom" /> */}
            {/* <Button data-tip={props.intl.formatMessage({ id: "IDS_ADVFILTER" })}
                data-for="tooltip-common-wrap"
                className="bg-default svg_custom_big no-down-arrow custom-drop-down-arrow-top ico-fontello-psheudo"
                onClick={(event) => handleClick(event, 1)}>
                <FilterIcon className="custom_icons" width="24" height="24" />
            </Button> */}
            <Nav.Link className="add-txt-btn text-right"
                // onClick={RealRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL ? (e) => this.props.addComponentTest(e) : (e) => this.props.AddComponent(e)} 
                onClick={(e) =>handleClick(e,1)}
            >
                {/* <FontAwesomeIcon icon={faPlus} /> { }{ } */}
                <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' />
            </Nav.Link>

            <div ref={ref} className={`blured_shadow ${show ? 'active' : ''}`}>
                <Overlay show={show} target={target} placement="bottom" container={ref.current}>
                    <Popover id="popover-contained">
                        <div className="popup_btn_g">
                            <Button onClick={(event) => handleClick(event, 2)} className="theme-btn-rounded-corner ">{props.intl.formatMessage({ id: "IDS_CANCEL" })}</Button>
                            <Button onClick={(event) => handleSubmitClick(event)} className="theme-btn-rounded-corner-bg-blue mr-3">{props.intl.formatMessage({ id: "IDS_SUBMIT" })}</Button>
                        </div>
                        {props.filterComponent.map(filterComponent =>
                            <div className="popup_p_g">
                                {Object.values(filterComponent)[0]}
                            </div>
                        )}

                    </Popover>
                </Overlay>
            </div>
        </div>
    );
}

export default injectIntl(AdvFilter)

