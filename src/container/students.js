import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Grade from './grade';

const cookies = new Cookies();

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

export default class ListExampleSelectable extends Component {

  state = {
    students: [],
    studentIndex: 0,
  }

  constructor(props) {
    super(props);

    axios.get('http://localhost:3000/instructor/advisees?token=' + cookies.get('token')).then(res => {

      let students = [];
      res.data.students.map(student => {
        
        student.semesters = [];
        student.courses.map(course => {
          
          let sem = student.semesters.find(sem => sem.semester === course.semester && sem.year === course.year);
          if(sem === undefined) {
            sem = {
              year: course.year,
              semester: course.semester,
              grade: 0,
              credit: 0,
              subjects: [],
              verify: true,
            }
            student.semesters.push(sem);
          }
          if (course.grade != 'W') {
            if (course.grade != '-') sem.grade += course.grade * course.credit;
            else sem.verify = false;
            sem.credit += course.credit;
          }
          sem.subjects.push(course);
        });

        student.semesters.sort((A, B) => {
          let a = '' + A.year + '' + A.semester;
          let b = '' + B.year + '' + B.semester;
          return a.localeCompare(b);
        });
        let gradeX = 0;
        let creditX = 0;
        student.semesters.map(sem => {
          gradeX += sem.grade;
          creditX += sem.credit;
          sem.gradeX = gradeX;
          sem.creditX = creditX;
        });

        students.push(student);
      });

      this.setState({students: students});
    });
  }

  render = () => {
    return (
    <div className="row" style={{ height: '100%' }}>
      <div className="col-xs-4" style={{ overflow: 'scroll', height: '100%' }}>
        <SelectableList defaultValue={0}>
          <Subheader>Student List</Subheader>
          {
            this.state.students.map((student, index) => (
              <ListItem
                onClick={() => this.setState({studentIndex: index})}
                value={index}
                primaryText={student.name}
              />
            ))
          }
        </SelectableList>
      </div>
      <div className="col-xs-8" style={{ overflow: 'scroll', height: '100%' }}>
        <div style={{ overflow: 'scroll' }}>
        {
          this.state.students.length &&
          <Grade semesters={this.state.students[this.state.studentIndex].semesters} onReduce={true} />
        }
        </div>
      </div>
    </div>
  )};
}