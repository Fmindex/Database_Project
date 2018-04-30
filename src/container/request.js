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
            console.log('result: ',result)
            console.log('added request, updating requests');
            axios.get(localhost + `/student/request/?token=${this.cookies.get('token')}`).then((docs) => {
                this.setState({requests: docs.data.requests});
            })
        });
    }

  render() {
      const { selectedValue } = this.state;
    return (
        <div className="col-xs-12" style={{ overflow: 'scroll', height: '100%' }}>
            <Divider />
            <div style={{ fontSize: '32px', marginBottom: '24px', marginTop: '16px' }}>Request Form</div>
            <RadioButtonGroup name="shipSpeed" valueSelected={selectedValue} defaultSelected="not_light" style={{ paddingLeft: '16px' }}>
                <RadioButton
                    value={'transcript'}
                    label="Transcript"
                    style={styles.radioButton}
                    onClick={() => this.setState({ selectedValue: 'transcript' })}
                />
                <RadioButton
                    value={'bai'}
                    label="ใบรับรอง"
                    style={styles.radioButton}
                    onClick={() => this.setState({ selectedValue: 'bai' })}
                />
                <RadioButton
                    value={'graduation'}
                    label="Graduation"
                    style={styles.radioButton}
                    onClick={() => this.setState({ selectedValue: 'graduation' })}
                />
            </RadioButtonGroup>
            <RaisedButton label="Send Request" primary={true} style={styles.button} onClick={this.onSubmit} />
            <Divider />
            <div style={{ fontSize: '32px', marginBottom: '16px', marginTop: '64px'  }}>Request History</div>
            <div style={{ paddingRight: '64px', width: '100%', paddingLeft: '64px' }}>
                <Table>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn style={{ fontSize: titleFontSize, width: '20%' }}>No.</TableHeaderColumn>
                            <TableHeaderColumn style={{ fontSize: titleFontSize, width: '50%' }}>Request Type</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.state.requests.map((request) => {
                                if(request.type != 'null') {
                                    return (
                                        <TableRow>
                                            <TableRowColumn style={{ fontSize: contentFontSize, width: '20%' }}>{request.request_id}</TableRowColumn>
                                            <TableRowColumn style={{ fontSize: contentFontSize, width: '50%' }}>{
                                                request.type == 'bai' ? 'ใบรับรองความเป็นนิสิต' : request.type
                                            }</TableRowColumn>
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