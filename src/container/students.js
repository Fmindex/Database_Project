import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, makeSelectable } from 'material-ui/List';
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
      let students = res.data.students;
      students.map(student => {
        student.courses.map(course => {
          course.sections = [];
          course.sections.push({
            year: course.year,
            semester: course.semester,
            grade: course.grade,
          });
        });
      })
      this.setState({ students: students });
    });
  }

  render = () => {    
    let courses = [];
    if (this.state.students.length) courses = this.state.students[this.state.studentIndex].courses;
    console.log(courses);

    return (
      <div className="row" style={{ height: '100%' }}>
        <div className="col-xs-4" style={{ overflow: 'scroll', height: '100%' }}>
          <SelectableList defaultValue={0}>
            <Subheader>Student List</Subheader>
            {
              this.state.students.map((student, index) => (
                <ListItem
                  key={index}
                  onClick={() => {
                    this.setState({ studentIndex: index })
                    console.log(index);
                  }}
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
              <Grade courses={courses} onReduce={true} />
            }
          </div>
        </div>
      </div>
    )
  };
}