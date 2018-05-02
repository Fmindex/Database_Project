import React, { Component } from 'react';
import '../style/dashboard.css';

import Cookies from 'universal-cookie';
import axios from 'axios';

import { List, ListItem } from 'material-ui/List';
import ActionDescription from 'material-ui/svg-icons/action/description';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import ActionToc from 'material-ui/svg-icons/action/toc';
import SocialSchool from 'material-ui/svg-icons/social/school';
import SocialPerson from 'material-ui/svg-icons/social/person';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Grade from '../container/addGrade';
import HomePage from './HomePage';
import Request from '../container/request';
import Payment from '../container/payment';
import Students from '../container/students';
import SearchPanel from '../container/search_panel';
import Table from '../container/new_table';

class DashboardTeacher extends Component {

  cookies = new Cookies();

  changePage = (nextPage) => {
    this.setState({
      selectedPage: this.state.pages[nextPage],
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      pages: [
        { name: 'Schedule', detail: 'View your course table' },
        { name: 'Grade', detail: 'Update your advisees\' grade' },
        { name: 'Students', detail: 'View your advisees\' detail' },
      ],
      selectedPage: { name: 'Schedule', detail: 'View your course table' },
      classOnTable: [[], [], [], [], []],
      selectdSubject: [],
      subject: [],
      courses: [],
    };
    
    this.getInstructorCourses();
  };

  getInstructorCourses = () => {
    axios.get('http://localhost:3000/instructor/course/all?token=' + this.cookies.get('token')).then(res => {
      this.setState({
        courses: res.data.courses,
      });
    });
  }

  render() {
    return (
      <div className="row" style={{ height: '80%', fontSize: '24px', marginTop: '50px' }}>
        <div className="col-md-3 sidenav" style={{ height: '94vh', paddingLeft: '32px' }}>
          <div style={{ width: '100%', textAlign: 'center', paddingTop: '48px', paddingBottom: '32px' }}>Instructor Menu</div>
          <List>
            <ListItem primaryText="Schedule" leftIcon={<ActionSchedule />} onClick={() => this.changePage(0)} />
            <ListItem primaryText="Grade" leftIcon={<SocialSchool />} onClick={() => this.changePage(1)} />
            <ListItem primaryText="Students" leftIcon={<SocialPerson />} onClick={() => this.changePage(2)} />
          </List>
        </div>
        <div className="col-md-9" style={{ paddingTop: '16px', paddingRight: '32px' }}>
          <Card>
            <CardTitle title={this.state.selectedPage.name} subtitle={this.state.selectedPage.detail} />
            {
              this.state.selectedPage.name === 'Payment' ?
                <CardText style={{ width: '100%' }}>
                  <div className="row">
                    {this.state.selectedPage.name === 'Payment' && <Payment />}
                  </div>
                </CardText>
                :
                <CardText style={{ height: '78vh', width: '100%' }}>
                  {this.state.selectedPage.name === 'Schedule' && <Table year={2017} semester={2} courses={this.state.courses} instructorMode={true} />}
                  {this.state.selectedPage.name === 'Grade' && <Grade />}
                  {this.state.selectedPage.name === 'Students' && <Students />}
                </CardText>
            }
          </Card>
        </div>
      </div>
    );
  }
}

export default DashboardTeacher;
