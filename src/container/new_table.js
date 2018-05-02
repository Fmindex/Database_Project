import React, { Component } from 'react';

const standardWidth = 110;
const dayWordToInt = {
  'monday': 0,
  'tuesday': 1,
  'wednesday': 2,
  'thursday': 3,
  'friday': 4,
  'saturday': 5,
  'sunday': 6,
};
const dayIntToWord = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
];
const periods = [
  '8:00 - 9:00',
  '9:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
];

class Table extends Component {

  updateTable = () => {
    let slots = [[], [], [], [], []];
    this.props.courses.map(course => {

      course.sections.map(section => {

        if (section.year == this.props.year && section.semester == this.props.semester) {
          if(this.props.instructorMode || section.grade != 'W') {
            section.time_slots.map(slot => {

              let word = slot.start_time.split(':');
              let start = parseInt(word[0]) * standardWidth + (parseInt(word[1]) / 60 * standardWidth);
              word = slot.end_time.split(':');
              let end = parseInt(word[0]) * standardWidth + (parseInt(word[1]) / 60 * standardWidth);

              slots[dayWordToInt[slot.day]].push({
                courseId: course.course_id,
                courseName: course.name,
                section: section.section_id,
                start: start,
                end: end,
              });

            });
          }
        }

      });
    });

    slots.map(slot => {
      slot.sort((a, b) => {
        return a.start - b.start;
      });

      let prev = 8 * standardWidth;
      slot.map(cls => {
        cls.marginLeft = cls.start - prev;
        cls.width = cls.end - cls.start;
        prev = cls.end;
      });
    });

    return slots;
  }

  render = () => {

    let slots = this.updateTable();

    return (
      <div style={{ overflow: 'scroll', height: '100%' }}>
        <div style={{ borderColor: 'gray', borderRadius: 8, borderWidth: 2, borderStyle: 'solid', padding: 4, width: periods.length * standardWidth + 50 + 12 }}>
          <div style={{ width: periods.length * standardWidth, display: 'flex', flexDirection: 'row', fontSize: 15, fontWeight: 'bold', marginLeft: 50,  }} >
            {
              periods.map((period, index) => (
                <div key={index} style={{ width: standardWidth, display: 'flex', paddingLeft: 4, }} >
                  <div style={{ backgroundColor: 'rgb(233, 0, 255)', color: 'white', width: '100%', height: 50, paddingTop: 15, textAlign: 'center', borderRadius: 8, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, }}>{period}</div>
                </div>
              ))
            }
          </div>
          <div> 
            {
              slots.map((slot, index) => (
                <div key={index} style={{ height: 50, width: '100%', display: 'flex', flexDirection: 'row', marginTop: 4, }} >
                  <div style={{ width: 50, borderRadius: 8, borderTopRightRadius: 0, borderBottomRightRadius: 0, backgroundColor: 'rgb(233, 0, 255)', color: 'white', fontSize: 15, textAlign: 'center', paddingTop: 15, }} >
                    {dayIntToWord[index]}
                  </div>
                  {
                    slot.map((cls, index) => (
                      <div key={index} style={{ marginLeft: cls.marginLeft + 4, width: cls.width - 4, display: 'flex', backgroundColor: 'rgb(120, 120, 120)', color: 'white', borderRadius: 8, paddingTop: 15, }} >
                        <div style={{ width: '100%', textAlign: 'center' }}>{cls.courseName}</div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Table;

