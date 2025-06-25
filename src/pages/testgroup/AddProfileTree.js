import React from 'react';
import { Col, Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { ListNode, NodeIcon, ProfileTag } from '../../components/custom-tree/TreeStyledComponent';

const AddProfileTree = (props) => {
    return (
        <>
            <Row>
                <Col md="12">
                    <ProfileTag>
                        <ListNode className="form-label-group tree-level">
                        { props.treetempTranstestGroup && props.treetempTranstestGroup.map((item, index)=>{
                        return (
                            <>
                                <NodeIcon className="line" style={{ width: (index + 1) * 10 }}></NodeIcon>
                                <NodeIcon md={1} className="ml-1">{item.slabelname}</NodeIcon>
                                <div style={{ marginLeft: (index + 1) * 10 }}>
                                    <FormInput key={index.toString()}
                                        name={`sleveldescription_${index}`}
                                        type="text"
                                        onChange={(event) => props.onInputOnChange(event, 2, {[index]: item}, "sleveldescription")}
                                        placeholder={item.slabelname}
                                        value={props.selectedRecord?props.selectedRecord[`sleveldescription_${index}`]:""}
                                        defaultValue={item.sleveldescription}
                                        maxLength={100}
                                        readOnly={item.isreadonly}
                                    />
                                </div>
                            </>
                        )
                        })}
                        </ListNode>
                    </ProfileTag>
                </Col>
            </Row>
        </>
    );
};

export default AddProfileTree;