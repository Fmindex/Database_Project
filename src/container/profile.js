import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const cookies = new Cookies();

export default class Profile extends Component {

  render = () => {
    return (
      <div className="col-xs-12" style={{ overflow: 'scroll', height: '100%' }}>
        <Table>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Student ID :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.student_id}</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Name :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.name}</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Citizen ID :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.citizen_id}</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Faculty :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.faculty_name}</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Department :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.department_name}</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Program :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.program}</TableRowColumn>
            </TableRow>

            <TableRow>
              <TableRowColumn style={{ fontSize: 16, width: 150 }} >Year :</TableRowColumn>
              <TableRowColumn style={{ fontSize: 16, }} >{this.props.userInfo.year}</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };
}