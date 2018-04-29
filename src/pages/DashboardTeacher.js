import React, { Component } from 'react';
import '../style/dashboard.css';

import Cookies from 'universal-cookie';
import axios from 'axios';

import {List, ListItem} from 'material-ui/List';
import ActionDescription from 'material-ui/svg-icons/action/description';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import ActionToc from 'material-ui/svg-icons/action/toc';
import SocialSchool from 'material-ui/svg-icons/social/school';
import SocialPerson from 'material-ui/svg-icons/social/person';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Grade from '../container/addGrade';
import HomePage from './HomePage';
import Request from '../container/request';
import Payment from '../container/payment';
import Students from '../container/students';
import SearchPanel from '../container/search_panel';
import Table from '../container/table';

class DashboardTeacher extends Component {
  
  cookies = new Cookies();
    
  state = {
    pages: [
        { name: 'Schedule', detail: 'View your course table' },
        { name: 'Grade', detail: 'Update your advisees\' grade' },
        { name: 'Students', detail: 'View your advisees\' detail' },
    ],
    selectedPage: { name: 'Schedule', detail: 'View your table' },
    classOnTable: [[], [], [], [], []],
    selectdSubject: [],
    subject: [
      { 
        courseNo: '0295101', 
        name: 'Intro to Data Sci', 
        time: [
          { start: 1300, end: 1600, day: 5 }, 
        ],
        index: 0,
        onList: true,
      },
      { 
        courseNo: '2301108', 
        name: 'Calculus II', 
        time: [
          { start: 800, end: 950, day: 1 }, 
          { start: 950, end: 1100, day: 3 }
        ],
        index: 1,
        onList: true,
      }, { 
        courseNo: '2304104',
        name: 'Gen Phy II ',
        time: [
          { start: 950, end: 1100, day: 1 },
          { start: 800, end: 950, day: 5 },
        ], 
        index: 2,
        onList: true,
      }, { 
        courseNo: '2304184', 
        name: 'Gen Phy Lab II',
        time: [
          { start: 1300, end: 1600, day: 1 },
        ],  
        index: 3,
        onList: true,
      }, { 
        courseNo: '2109101', 
        name: 'Eng Materials',
        time: [
          { start: 1100, end: 1250, day: 2 },
          { start: 800, end: 950, day: 3 },
        ],  
        index: 4,
        onList: false,
      }, { 
        courseNo: '2110101', 
        name: 'Comp Prog', 
        time: [
          { start: 800, end: 1100, day: 2 },
        ],  
        index: 5,
        onList: true,
      }, { 
        courseNo: '5500112', 
        name: 'Exp Eng II', 
        time: [
          { start: 950, end: 1100, day: 3 },
        ], 
        index: 6,
        onList: false,
      }, { 
        courseNo: '2100111', 
        name: 'Expl Eng World', 
        time: [
          { start: 950, end: 1250, day: 5 },
        ], 
        index: 7,
        onList: false,
      }, { 
        courseNo: '2110594', 
        name: 'Adv Top Comp IV', 
        time: [
          { start: 900, end: 1200, day: 1 },
        ], 
        index: 8,
        onList: false,
      }, { 
        courseNo: '2110471', 
        name: 'Comp Network I', time: [
          { start: 1300, end: 1500, day: 2 },
          { start: 950, end: 1150, day: 3 },
        ], 
        index: 9,
        onList: false,
      }, { 
        courseNo: '2110332', 
        name: 'Sys Analysis Dsgn',
        time: [
          { start: 950, end: 1100, day: 2 },
          { start: 950, end: 1100, day: 4 },
        ], 
        index: 10,
        onList: false,
      }, { 
        courseNo: '2110422', 
        name: 'Db Mgt Sys Design', 
        time: [
          { start: 800, end: 950, day: 2 },
          { start: 800, end: 950, day: 4 },
        ], 
        index: 11,
        onList: false,
      }, { 
        courseNo: '2110318', 
        name: 'Dis Sys Essen', 
        time: [
          { start: 800, end: 900, day: 3 },
        ],  
        index: 12,
        onList: false,
      }, { 
        courseNo: '5500308', 
        name: 'Tech Writ Eng', 
        time: [
          { start: 900, end: 1200, day: 5 },
        ], 
        index: 13,
        onList: false,
      },
    ]
  };

  trueOnlist = (index) => {
    let copySubject = this.state.subject[index];
    let copyAllSubject = this.state.subject;
    let available = true;

    for(var i = 0; i < copySubject.time.length; i++){
      let day = copySubject.time[i].day-1;
      for(var j = 0; j < this.state.classOnTable[day].length; j++){
        let classNow = this.state.classOnTable[day][j];
        if( 
            classNow.courseNo != null && 
            ( classNow.start >= copySubject.time[i].start && classNow.start < copySubject.time[i].end) ||
            ( classNow.end > copySubject.time[i].start && classNow.end <= copySubject.time[i].end)
          ) {
            available = false;
        }
      }
    }

    copyAllSubject[index].onList = available;
    this.setState({
        subject: copyAllSubject,
    });
    this.createClass();
  }

  falseOnlist = (index) => {
    let copySubject = this.state.subject;
    copySubject[index].onList = false;
    this.setState({
        subject: copySubject,
    });
    this.createClass();
  }

  createClass = () => {
    let subj = this.state.selectdSubject;
    let copyClass = [[],[],[],[],[],[],[],[]];

    for(var day = 0; day < 8; day++){
      for(var time = 800; time < 1700; time+=50){
        var ansCount = 0;
        var selectedSubj;
        for(var i = 0; i < subj.length; i++) {
          var obj = subj[i].time;
          if(subj[i].onList){
            for(var j = 0; j < obj.length; j++) {
              if(time >= obj[j].start && obj[j].end > time && day==obj[j].day) {
                ansCount++;
                selectedSubj = {
                  courseNo: subj[i].courseNo,
                  name: subj[i].name,
                  index: subj[i].index,
                  start: obj[j].start,
                  end: obj[j].end,
                  period: (obj[j].end - obj[j].start)/50,
                };
              }
            }
          }
        }
        if(ansCount > 0) {
          copyClass[day].push(selectedSubj);
        } else if(ansCount == 0) {
          copyClass[day].push({ courseNo: '0' });
        }
      }
    }
    let res = [[], [], [], [], []];
    for(var day = 1; day < 6; day++) {
      for(var time = 800; time < 1700; time+=50) {
        var idx = (time - 800) / 50;
        var obj = copyClass[day][idx];
        if(obj.courseNo == '0') {
          res[day-1].push({ subject: null, period: 1 });  
        } else {
          res[day-1].push(obj);
          time += (obj.period*50) - 50;
        }
      }
    }
    this.setState({
        classOnTable: res,
    });
  }

  changePage = (nextPage) => {
    this.setState({
        selectedPage: this.state.pages[nextPage],
    })
  }
  
  constructor(props) {
    super(props);
    let backend = 'http://localhost:3000';
    axios.get(backend + '/instructor/course/all/?token=' + this.cookies.get('token')).then((res) => {
      console.log(res.data);
      let courses = res.data.courses;
      let subjects = [];
      courses.map((course, index) => {
        let subject = {
          courseNo: course.course_id,
          name: course.name,
          time: [],
          index: index,
          onList: true,
        };

        course.sections.map(section => {
          section.time_slots.map(slot => {
            let starts = slot.start_time.split(':');
            let ends = slot.end_time.split(':');
            let day = -1;
            if(slot.day === 'monday') day = 1;
            else if (slot.day === 'tuesday') day = 2;
            else if (slot.day === 'wednesday') day = 3;
            else if (slot.day === 'thursday') day = 4;
            else if (slot.day === 'friday') day = 5;
            subject.time.push({
              start: parseInt(starts[0]) * 100 + parseInt(starts[1]) / 30 * 50,
              end: parseInt(ends[0]) * 100 + parseInt(ends[1]) / 30 * 50,
              day: day,
            });
          });
        });

        subjects.push(subject);
      });
      this.setState({selectdSubject: subjects}, this.createClass);
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
                  {this.state.selectedPage.name === 'Schedule' && <Table falseOnlist={this.falseOnlist} classOnTable={this.state.classOnTable} />}
                  {this.state.selectedPage.name === 'Grade' && <Grade subject={this.state.subject} />}
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
