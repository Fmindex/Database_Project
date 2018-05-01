import '../style/dashboard.css';

import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import ActionDescription from 'material-ui/svg-icons/action/description';
import ActionPayment from 'material-ui/svg-icons/action/payment';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import ActionUser from 'material-ui/svg-icons/action/face';
import ActionToc from 'material-ui/svg-icons/action/toc';
import Grade from '../container/grade';
import HomePage from './HomePage';
import Request from '../container/request';
import Payment from '../container/payment';
import UserProfile from '../container/profile';
import SearchPanel from '../container/search_panel';
import SocialSchool from 'material-ui/svg-icons/social/school';
import Table from '../container/new_table';
import Divider from 'material-ui/Divider/Divider';

class DashboardStudent extends Component {

  cookies = new Cookies();

  state = {
    pages: [
      { name: 'Profile', detail: 'View your student profile' },
      { name: 'Schedule', detail: 'View your course table' },
      { name: 'Course', detail: 'Add / Remove / Withdraw your courses' },
      { name: 'Grade', detail: 'View your grade' },
      { name: 'Request', detail: 'Request a transcript ans so on' },
      { name: 'Payment', detail: 'Manage your payment' },
    ],
    selectedPage: { name: 'Profile', detail: 'View your student profile' },
    userInfo: {},
    studentCourses: [],
  };

  componentWillMount() {
    this.getStudentCourses();
    this.getUserInfo();
  }

  changePage = (nextPage) => {
    this.setState({
      selectedPage: this.state.pages[nextPage],
    })
  }

  getStudentCourses = () => {
    axios.get('http://localhost:3000/student/course/all?token=' + this.cookies.get('token')).then(res => {
      this.setState({
        studentCourses: res.data.courses,
      });
    });
  };

  getUserInfo = () => {
    axios.get(`http://localhost:3000/student/info?token=${this.cookies.get('token')}`).then(res => {
      if(res.data.userInfo) {
        this.setState({
          userInfo: res.data.userInfo,
        });
      }
    });
  }

  render = () => {
    return (
      <div className="row" style={{ height: '80%', fontSize: '24px', marginTop: '50px' }}>
        <div className="col-md-3 sidenav" style={{ height: '94vh', paddingLeft: '32px' }}>
          <div style={{ width: '100%', textAlign: 'center', paddingTop: '48px', }}>Student Menu</div>
          <div style={{ width: '100%', textAlign: 'center', fontSize: 18, marginBottom: 16 }} >{this.state.userInfo.name}</div>
          <Divider />
          <List>
            <ListItem primaryText="Profile" leftIcon={<ActionUser />} onClick={() => this.changePage(0)} />
            <ListItem primaryText="Schedule" leftIcon={<ActionSchedule />} onClick={() => this.changePage(1)} />
            <ListItem primaryText="Course" leftIcon={<ActionToc />} onClick={() => this.changePage(2)} />
            <ListItem primaryText="Grade" leftIcon={<SocialSchool />} onClick={() => this.changePage(3)} />
            <ListItem primaryText="Request" leftIcon={<ActionDescription />} onClick={() => this.changePage(4)} />
            <ListItem primaryText="Payment" leftIcon={<ActionPayment />} onClick={() => this.changePage(5)} />
          </List>
        </div>
        <div className="col-md-9" style={{ paddingTop: '16px', paddingRight: '32px' }}>
          <Card>
            <CardTitle title={this.state.selectedPage.name.toUpperCase()} subtitle={this.state.selectedPage.detail} />
            {
              <CardText style={{ height: '78vh', width: '100%' }}>
                {this.state.selectedPage.name === 'Profile' && <UserProfile userInfo={this.state.userInfo} />}
                {this.state.selectedPage.name === 'Course' && <SearchPanel studentCourses={this.state.studentCourses} updateStudentCourses={() => this.getStudentCourses()} />}
                {this.state.selectedPage.name === 'Schedule' && <Table year={2017} semester={2} courses={this.state.studentCourses} />}
                {this.state.selectedPage.name === 'Grade' && <Grade courses={this.state.studentCourses} />}
                {this.state.selectedPage.name === 'Request' && <Request />}
                {this.state.selectedPage.name === 'Payment' && <Payment />}
              </CardText>
            }
          </Card>
        </div>
      </div>
    );
  }
}

export default DashboardStudent;
