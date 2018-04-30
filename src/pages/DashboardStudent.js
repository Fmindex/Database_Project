import '../style/dashboard.css';

import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import React, { Component } from 'react';
import axios from 'axios';

import Cookies from 'universal-cookie';

import ActionDescription from 'material-ui/svg-icons/action/description';
import ActionPayment from 'material-ui/svg-icons/action/payment';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import ActionToc from 'material-ui/svg-icons/action/toc';
import Grade from '../container/grade';
import HomePage from './HomePage';
import Request from '../container/request';
import Payment from '../container/payment';
import SearchPanel from '../container/search_panel';
import SocialSchool from 'material-ui/svg-icons/social/school';
import Table from '../container/table';

class DashboardStudent extends Component {

  cookies = new Cookies();
  
  state = {
    pages: [
        { name: 'Schedule', detail: 'View your course table' },
        { name: 'Course', detail: 'Add / Remove / Withdraw your courses' },
        { name: 'Grade', detail: 'View your grade' },
        { name: 'Request', detail: 'Request a transcript ans so on' },
        { name: 'Payment', detail: 'Manage your payment' },
    ],
    selectedPage: { name: 'Schedule', detail: 'View your table' },classOnTable: [[], [], [], [], []],
    subject: [
      { 
        courseNo: '0295101', 
        name: 'Intro to Data Sci', 
        time: [
          { start: 1300, end: 1600, day: 5 }, 
        ],
        index: 0,
        onList: false,
      },
      { 
        courseNo: '2301108', 
        name: 'Calculus II', 
        time: [
          { start: 800, end: 950, day: 1 }, 
          { start: 950, end: 1100, day: 3 }
        ],
        index: 1,
        onList: false,
      }, { 
        courseNo: '2304104',
        name: 'Gen Phy II ',
        time: [
          { start: 950, end: 1100, day: 1 },
          { start: 800, end: 950, day: 5 },
        ], 
        index: 2,
        onList: false,
      }, { 
        courseNo: '2304184', 
        name: 'Gen Phy Lab II',
        time: [
          { start: 1300, end: 1600, day: 1 },
        ],  
        index: 3,
        onList: false,
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
        onList: false,
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
    ],
    selectedSubject: [],
    oldSelectedSubject: [],
    allSubjects: [],
  };

  trueOnlist = (index) => {
    let copySubject = this.state.allSubjects[index];
    let copyAllSubject = this.state.allSubjects;
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
    let copy = this.state.selectedSubject;

    copyAllSubject[index].onList = available;

    let totalCredit = 0;
    this.state.selectedSubject.map(subject => {
      if (subject.grade != 'W') totalCredit += subject.credit;
    });
    totalCredit += copyAllSubject[index].credit;

    if(totalCredit > 22) alert('Your credits are running out!');
    else if(available) {
      let body = {
        course_id: copyAllSubject[index].courseNo,
        section_id: copyAllSubject[index].section_id,
        year: copyAllSubject[index].year,
        semester: copyAllSubject[index].semester,
      };
      axios.post('http://localhost:3000/student/register/add?token=' + this.cookies.get('token'), body).then((res) => {
        console.log(res.data);
        if(res.data == 'OK') {
          copy.push(copyAllSubject[index]);
          this.setState({
            selectedSubject: copy,
            allSubjects: copyAllSubject,
          }, this.createClass);
        }
        else if(res.data == 'EXIST') {
          alert('You registered this course!');
        }
        else if(res.data == 'SECTION FULL') {
          alert('This section full!');
        }
      });
    }
    else alert('Schedule is overlaping!');
  }

  falseOnlist = (index) => {
    let copySubject = this.state.selectedSubject;
    let copyAllSubject = this.state.allSubjects;
    copyAllSubject[index].onList = false;
    console.log(copySubject);
    let body = {
      course_id: copySubject[index].courseNo,
      section_id: copySubject[index].section_id,
      year: copySubject[index].year,
      semester: copySubject[index].semester,
    };
    axios.post('http://localhost:3000/student/register/remove?token=' + this.cookies.get('token'), body).then(() => {
      copySubject.splice(index, 1);
      this.setState({
        selectedSubject: copySubject,
        allSubjects: copyAllSubject,
      }, this.createClass);
    })
  }

  createClass = () => {
    let subj = [];
    let subSe = this.state.selectedSubject;
    subSe.map((sub) => {
      if(sub.grade != 'W') {
        subj.push(sub);
      }
    })
    console.log(subj)
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
    console.log(res)
    this.setState({
        classOnTable: res,
    });
  }

  changePage = (nextPage) => {
    this.setState({
        selectedPage: this.state.pages[nextPage],
    })
  }

  withdraw = (index) => {
    let copyAllSubject = this.state.selectedSubject;
    let body = {
      course_id: copyAllSubject[index].courseNo,
      section_id: copyAllSubject[index].section_id,
      year: copyAllSubject[index].year,
      semester: copyAllSubject[index].semester,
    };
    axios.post('http://localhost:3000/student/register/withdraw?token=' + this.cookies.get('token'), body).then((res) => {
      console.log(res.data);
      copyAllSubject[index].grade = 'W';
      this.setState({ selectedSubject: copyAllSubject }, this.createClass);
    });
  };

  componentDidMount() {
    let subjects = [];
    axios.get('http://localhost:3000/course/all').then(res => {
      console.log(res.data);
      let courses = res.data.courses;
      let subjects = [];
      courses.map((course, index) => {

        course.sections.map(section => {
          if(section.year == 2017 && section.semester == 2) {
            
            let subject = {
              courseNo: course.course_id,
              credit: course.credit,
              name: course.name + ' - ' + section.section_id,
              time: [],
              index: subjects.length,
              section_id: section.section_id,
              year: section.year,
              semester: section.semester,
              onList: false,
            };
            section.time_slots.map(slot => {
              let starts = slot.start_time.split(':');
              let ends = slot.end_time.split(':');
              let day = -1;
              if (slot.day === 'monday') day = 1;
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

            subjects.push(subject);
          }          
        });

        
      });
      this.setState({ allSubjects: subjects,  });
    });

    axios.get('http://localhost:3000/student/course/all?token=' + this.cookies.get('token')).then(res => {
      
      let courses = res.data.courses;
      let oldSubjects = [];
      let subjects = [];

      courses.map((course, index) => {
        
        course.sections.map(section => {

          let subject = {
            courseNo: course.course_id,
            name: course.name + ' - ' + section.section_id,
            time: [],
            index: index,
            onList: true,
            section_id: section.section_id,
            year: section.year,
            semester: section.semester,
            grade: section.grade,
            credit: course.credit,
          };
          section.time_slots.map(slot => {
            let starts = slot.start_time.split(':');
            let ends = slot.end_time.split(':');
            let day = -1;
            if (slot.day === 'monday') day = 1;
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


          if (section.year == '2017' && section.semester == 2) {
            subjects.push(subject);
          }
          oldSubjects.push(subject);
        });
      });

      let semesters = [];
      oldSubjects.map(course => {

        let sem = semesters.find(sem => sem.semester === course.semester && sem.year === course.year);
        if (sem === undefined) {
          sem = {
            year: course.year,
            semester: course.semester,
            grade: 0,
            credit: 0,
            subjects: [],
            verify: true
          }
          semesters.push(sem);
        }
        if(course.grade != 'W') {
          if(course.grade != '-') sem.grade += course.grade * course.credit;
          else sem.verify = false;
          sem.credit += course.credit;
        }
        sem.subjects.push(course);
      });

      semesters.sort((A, B) => {
        let a = '' + A.year + '' + A.semester;
        let b = '' + B.year + '' + B.semester;
        return a.localeCompare(b);
      });
      let gradeX = 0;
      let creditX = 0;
      semesters.map(sem => {
        gradeX += sem.grade;
        creditX += sem.credit;
        sem.gradeX = gradeX;
        sem.creditX = creditX;
      });
      this.setState({ selectedSubject: subjects, oldSelectedSubject: oldSubjects, semesters: semesters }, this.createClass);
    });
  }

  render() {
    console.log(this.state.selectedPage)
    return (
      <div className="row" style={{ height: '80%', fontSize: '24px', marginTop: '50px' }}>
        <div className="col-md-3 sidenav" style={{ height: '94vh', paddingLeft: '32px' }}>
            <div style={{ width: '100%', textAlign: 'center', paddingTop: '48px', paddingBottom: '32px' }}>Student Menu</div>
            <List>
                <ListItem primaryText="Schedule" leftIcon={<ActionSchedule />} onClick={() => this.changePage(0)} />
                <ListItem primaryText="Course" leftIcon={<ActionToc />} onClick={() => this.changePage(1)} />
                <ListItem primaryText="Grade" leftIcon={<SocialSchool />} onClick={() => this.changePage(2)} />
                <ListItem primaryText="Request" leftIcon={<ActionDescription />} onClick={() => this.changePage(3)} />
                <ListItem primaryText="Payment" leftIcon={<ActionPayment />} onClick={() => this.changePage(4)} />
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
                      {this.state.selectedPage.name === 'Course' && <SearchPanel withdraw={this.withdraw} subject={this.state.allSubjects} selectedSubject={this.state.selectedSubject} trueOnlist={this.trueOnlist} falseOnlist={this.falseOnlist} />}
                      {this.state.selectedPage.name === 'Schedule' && <Table falseOnlist={this.falseOnlist} classOnTable={this.state.classOnTable} />}
                      {this.state.selectedPage.name === 'Grade' && <Grade subject={this.state.selectedSubject} semesters={this.state.semesters} />}
                      {this.state.selectedPage.name === 'Request' && <Request />}
                  </CardText>
                }
                
             </Card>
        </div>
      </div>
    );
  }
}

export default DashboardStudent;
