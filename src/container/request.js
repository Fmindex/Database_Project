import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { print } from 'util';
import Cookies from 'universal-cookie';

const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
    button: {
        margin: 12,
        marginBottom: 32,
    },
  };
const titleFontSize = '18px';
const contentFontSize = '18px';
class Request extends Component {

    cookies = new Cookies();

    state = {
        selectedValue: null,
        requests: []
    };

    componentDidMount() {
        axios.get('http://127.0.0.1:3000' + `/student/request/?token=${this.cookies.get('token')}`).then((docs) => {
            this.setState({requests: docs.data.requests});
        })
    }

    onSubmit = () => {
        const localhost = 'http://127.0.0.1:3000';
        axios.post(localhost + `/student/request/?token=${this.cookies.get('token')}`,{
            type: this.state.selectedValue,
        }).then( (result) =>{
            if(result.data == 'OK') {
                axios.get(localhost + `/student/request/?token=${this.cookies.get('token')}`).then((docs) => {
                    this.setState({ requests: docs.data.requests });
                });
            }
            else {
                alert('Please, Choose your request type!');
            }
        });
    }

  render() {
      const { selectedValue } = this.state;
    return (
        <div className="col-xs-12" style={{ overflow: 'scroll', height: '100%' }}>
            <Divider />
            <div style={{ fontSize: '20px', marginBottom: '24px', marginTop: '16px' }}>Request Form</div>
            <RadioButtonGroup name="shipSpeed" valueSelected={selectedValue} defaultSelected="not_light" style={{ paddingLeft: '16px' }}>
                <RadioButton
                    value={'transcript'}
                    label="Transcript"
                    style={styles.radioButton}
                    onClick={() => this.setState({ selectedValue: 'transcript' })}
                />
                <RadioButton
                    value={'bai'}
                    label="ใบรับรองความเป็นนิสิต"
                    style={styles.radioButton}
                    onClick={() => this.setState({ selectedValue: 'bai' })}
                />
                <RadioButton
                    value={'graduation'}
                    label="การขอจบการศึกษา"
                    style={styles.radioButton}
                    onClick={() => this.setState({ selectedValue: 'graduation' })}
                />
            </RadioButtonGroup>
            <RaisedButton label="Send Request" primary={true} style={styles.button} onClick={this.onSubmit} />
            <Divider />
            <div style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>Request History</div>
            <div style={{ width: '100%' }}>
                <Table>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            <TableRowColumn style={{ fontWeight: 'bold', width: 50, }}>No.</TableRowColumn>
                            <TableRowColumn style={{ fontWeight: 'bold', }}>Request Type</TableRowColumn>
                            <TableRowColumn style={{ fontWeight: 'bold', }}>Request Date</TableRowColumn>
                            <TableRowColumn style={{ fontWeight: 'bold', }}>Verification</TableRowColumn>
                        </TableRow>
                        {
                            this.state.requests.reverse().map((request, index) => {
                                if(request.type != 'null') {
                                    return (
                                        <TableRow key={index} >
                                            <TableRowColumn style={{  width: 50, }}>{request.request_id}</TableRowColumn>
                                            <TableRowColumn style={{  }}>{
                                                request.type == 'bai' ? 'ใบรับรองความเป็นนิสิต' : request.type == 'graduation' ? 'การขอจบการศึกษา' : 'Transcript'
                                            }</TableRowColumn>
                                            <TableRowColumn>{request.requested_at.substring(0, 10)}</TableRowColumn>
                                            <TableRowColumn>
                                                {request.verify === 0 && <i style={{ color: 'orange' }} className='material-icons'>find_in_page</i>}
                                                {request.verify === 1 && <i style={{ color: 'green'}} className='material-icons'>check</i>}
                                                {request.verify === 2 && <i style={{ color: 'blue' }} className='material-icons'>done_all</i>}
                                            </TableRowColumn>
                                        </TableRow>
                                    );
                                }
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
  }
}

export default Request;