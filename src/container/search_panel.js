import 'react-select/dist/react-select.css';

import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import RaisedButton from 'material-ui/RaisedButton';

import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';
import Cookies from 'universal-cookie';
import Schedule from './new_table';

const cookies = new Cookies();

class SearchPanel extends Component {

	componentWillMount() {
		axios.get('http://localhost:3000/course/all').then(res => {

			this.setState({
				courses: res.data.courses
			}, () => {
				let pickSection = [];
				res.data.courses.map((course, index) => {
					pickSection.push(course.sections[0].section_id);
				});
				this.setState({
					pickSection: pickSection
				}, () => this.updateResult());
			});
		});

	}

	constructor(props) {
		super(props);

		let courses = [];
		props.studentCourses.map(course => {
			course.sections.map(section => {
				if (section.year == 2017 && section.semester == 2) {
					courses.push({
						courseId: course.course_id,
						courseName: course.name,
						section: section.section_id,
						year: section.year,
						semester: section.semester,
						grade: section.grade,
					});
				}
			});
		});

		this.state = {
			courses: [],
			results: [],
			day: '',
			courseId: '',
			courseName: '',
			pickSection: [],
			plan: 0,
			planTitle: 'REGISTER',
			studentCourses: courses,
			preCourses: [],
			tableCourses: [],
		};
	}

	transformRawCoursesToTableCourses = (courses) => {
		let tableCourses = [];
		courses.map(course => {
			course.sections.map(section => {
				if (section.year == 2017 && section.semester == 2) {
					tableCourses.push({
						courseId: course.course_id,
						courseName: course.name,
						section: section.section_id,
						year: section.year,
						semester: section.semester,
						grade: section.grade,
						plan_id: course.plan_id,
					});
				}
			});
		});

		return tableCourses;
	}

	updateStudentCourses = () => {
		let courses = [];
		this.props.studentCourses.map(course => {
			course.sections.map(section => {
				if (section.year == 2017 && section.semester == 2) {
					courses.push({
						courseId: course.course_id,
						courseName: course.name,
						section: section.section_id,
						year: section.year,
						semester: section.semester,
						grade: section.grade,
					});
				}
			});
		});

		this.setState({
			studentCourses: courses,
		});
	}

	updateResult = () => {
		let courses = [];
		courses = this.state.courses.filter(course => {
			let day = true;
			let courseId = true;
			let courseName = true;
			
			if(this.state.day != '') {
				day = false;
				course.sections.map(section => {
					section.time_slots.map(slot => {
						if(slot.day == this.state.day.value) day = true;
					});
				});
			}

			if(this.state.courseId != '') {
				courseId = false;
				if (course.course_id.toString().includes(this.state.courseId.toString())) courseId = true;
			}

			if (this.state.courseName != '') {
				courseName = false;
				if (course.name.includes(this.state.courseName)) courseName = true;
			}

			return day && courseId && courseName;
		});

		this.setState({
			results: courses,
		});
	}

	onDayChange = (day) => {
		this.setState({ day }, () => this.updateResult());
	}

	onCourseIdChange = (courseId) => {
		this.setState({ courseId }, () => this.updateResult());
	}

	onCourseNameChange = (courseName) => {
		this.setState({ courseName }, () => this.updateResult());
	}

	onSectionChange = (data, index) => {
		let pick = this.state.pickSection.slice(0);
		pick[index] = data;
		this.setState({
			pickSection: pick,
		});
	}

	onPlanChange = (plan) => {
		if (plan.value != 0) {
			axios.get(`http://localhost:3000/student/pre_courses/?token=${cookies.get('token')}&plan_id=${plan.value}`).then(res => {
				let courses = this.transformRawCoursesToTableCourses(res.data.courses);
				this.setState({
					tableCourses: courses,
					preCourses: res.data.courses,
					plan: plan.value,
					planTitle: plan.label,
				}, () => this.forceUpdate());
			});
		}
		else {
			this.setState({
				plan: plan.value,
				planTitle: plan.label,
			});
		}
	}

	addCourse = (course, section_id) => {
		if (confirm('Sure?')) {
			let section = course.sections.find(section => section.section_id == section_id);
			axios.post(`http://localhost:3000/student/register/add?token=${cookies.get('token')}`, {
				course_id: course.course_id,
				section_id: section.section_id,
				year: section.year,
				semester: section.semester,
			}).then(res => {
				if (res.data == 'OK') {
					alert('SUCCESS!');
					this.props.updateStudentCourses();
					setTimeout(() => {
						this.updateStudentCourses();
					}, 250);
				}
				else if (res.data == 'EXIST') alert('You already registered this course!');
				else if (res.data == 'SECTION FULL') alert('This section is full!')
			});
		}
	}

	addPreCourse = (course, section_id) => {
		if (confirm('Sure?')) {
			let section = course.sections.find(section => section.section_id == section_id);
			axios.post(`http://localhost:3000/student/register/pre_add?token=${cookies.get('token')}`, {
				course_id: course.course_id,
				section_id: section.section_id,
				year: section.year,
				semester: section.semester,
				plan_id: this.state.plan,
			}).then(res => {
				if (res.data == 'OK') {
					axios.get(`http://localhost:3000/student/pre_courses/?token=${cookies.get('token')}&plan_id=${this.state.plan}`).then(res => {
						alert('SUCCESS!');
						let courses = this.transformRawCoursesToTableCourses(res.data.courses);
						this.setState({
							tableCourses: courses,
							preCourses: res.data.courses,
						});
					});
				}
				else if (res.data == 'EXIST') alert('You already registered this course!');
				else if (res.data == 'SECTION FULL') alert('This section is full!')
			});
		}
	}

	removeCourse = (course) => {
		if (confirm('Sure?')) {
			axios.post(`http://localhost:3000/student/register/remove?token=${cookies.get('token')}`, {
				course_id: course.courseId,
				section_id: course.section,
				year: course.year,
				semester: course.semester,
			}).then(res => {
				if (res.data == 'OK') {
					alert('SUCCESS!');
					this.props.updateStudentCourses();
					setTimeout(() => {
						this.updateStudentCourses();
					}, 250);
				}
			});
		}
	}

	removePreCourse = (course) => {
		if(confirm('Sure?')) {
			axios.post(`http://localhost:3000/student/register/pre_remove?token=${cookies.get('token')}`, {
				course_id: course.courseId,
				section_id: course.section,
				year: course.year,
				semester: course.semester,
				plan_id: this.state.plan,
			}).then(res => {
				if (res.data == 'OK') {
					axios.get(`http://localhost:3000/student/pre_courses/?token=${cookies.get('token')}&plan_id=${this.state.plan}`).then(res => {
						alert('SUCCESS!');
						let courses = this.transformRawCoursesToTableCourses(res.data.courses);
						this.setState({
							tableCourses: courses,
							preCourses: res.data.courses,
						});
					});
				}
			});
		}
	}
	withdraw = (course) => {
		if (confirm('Sure?')) {
			axios.post(`http://localhost:3000/student/register/withdraw?token=${cookies.get('token')}`, {
				course_id: course.courseId,
				section_id: course.section,
				year: course.year,
				semester: course.semester,
			}).then(res => {
				if (res.data == 'OK') {
					alert('SUCCESS!');
					this.props.updateStudentCourses();
					this.updateStudentCourses();
				}
			});
		}
	}

	registerPreCourse = () => {
		if(confirm('Sure?')) {
			axios.post(`http://localhost:3000/student/register/pre_all?token=${cookies.get('token')}`, {
				plan_id: this.state.plan,
			}).then(res => {
				if(res.data == 'OK') {
					alert('SUCCESS!');
					this.onPlanChange({value: 0, label: 'REGISTER'}, () => {
						this.props.updateStudentCourses();
						this.updateStudentCourses();
					});
				}
				else alert('Something wrong!');
			});
		}
	}

	render() {

		return (
			<div style={{ overflow: 'scroll', height: '100%' }}>
				<div className="row">
					<div className="col-md-4">
						<div className="input-group" style={{ margin: 0 }}>
							<span className="input-group-addon"><i className="glyphicon glyphicon-calendar"></i></span>
							<Select
								options={[
									{ value: 'monday', label: 'Monday'.toLocaleUpperCase() },
									{ value: 'tuesday', label: 'Tuesday'.toLocaleUpperCase() },
									{ value: 'wednesday', label: 'Wednesday'.toLocaleUpperCase() },
									{ value: 'thursday', label: 'Thursday'.toLocaleUpperCase() },
									{ value: 'friday', label: 'Friday'.toLocaleUpperCase() },
									{ value: 'saturday', label: 'Saturday'.toLocaleUpperCase() },
									{ value: 'sunday', label: 'Sunday'.toLocaleUpperCase() }
								]}
								value={this.state.day}
								placeholder="Day"
								onChange={this.onDayChange}
								className="text-left selectstyle"
							/>
						</div>
					</div>

					<div className="col-md-4">
						<div className="input-group" style={{ margin: 0 }}>
							<span className="input-group-addon"><i className="glyphicon glyphicon-tag"></i></span>
							<input
								style={{ borderLeftTopRadius: 0, borderLeftBottomRadius: 0, }}
								type="text"
								className="form-control"
								ref="courseNo"
								placeholder="Course NO. : 88888888"
								value={this.state.courseNo}
								onChange={(data) => this.onCourseIdChange(data.target.value)}
							/>
						</div>
					</div>

					<div className="col-md-4">
						<div className="input-group" style={{ margin: 0 }}>
							<span className="input-group-addon"><i className="glyphicon glyphicon-book"></i></span>
							<input
								style={{ borderLeftTopRadius: 0, borderLeftBottomRadius: 0, }}
								type="text"
								className="form-control"
								ref="name"
								placeholder="Course Name : DB MGT SYS DESIGN"
								value={this.state.name}
								onChange={(data) => this.onCourseNameChange(data.target.value)}
							/>
						</div>
					</div>

				</div>

				<div style={{ marginTop: 20, fontSize: 20, }}>
					<div>Search Result</div>
					<div style={{ fontSize: 14, width: 200, marginTop: 12, marginBottom: 12, }} >
						<Select
							options={[
								{ value: 0, label: 'REGISTER' },
								{ value: 1, label: 'PLAN A' },
								{ value: 2, label: 'PLAN B' },
								{ value: 3, label: 'PLAN C' },
							]}
							value={this.state.plan}
							onChange={this.onPlanChange}
						/>
					</div>
					<Table>
						<TableBody displayRowCheckbox={false}>
							<TableRow>
								<TableRowColumn style={{ width: 60 }} ><div style={{ fontWeight: 'bold', }}>#</div></TableRowColumn>
								<TableRowColumn style={{ width: 200 }} ><div style={{ fontWeight: 'bold', }}>Name</div></TableRowColumn>
								<TableRowColumn style={{ width: 100 }} ><div style={{ fontWeight: 'bold', }}>Section</div></TableRowColumn>
								<TableRowColumn style={{ width: 150 }} ><div style={{ fontWeight: 'bold', }}>Class</div></TableRowColumn>
								{/*<TableRowColumn style={{ width: 200 }} ><div style={{ fontWeight: 'bold', }}>Seat</div></TableRowColumn>*/}
								<TableRowColumn style={{ width: 100 }} ><div style={{ fontWeight: 'bold', }}></div></TableRowColumn>
							</TableRow>
						</TableBody>
					</Table>
					<div style={{ overflow: 'scroll', height: 300, }}>
						<Table>
							<TableBody displayRowCheckbox={false}>
								{
									this.state.results.map((result, index) => {
										let section = result.sections.find(section => section.section_id == this.state.pickSection[index]);

										return (
											<TableRow key={index}>
												<TableRowColumn style={{ width: 60 }} >{result.course_id}</TableRowColumn>
												<TableRowColumn style={{ width: 200 }} >{result.name}</TableRowColumn>
												<TableRowColumn style={{ width: 100 }} >
													<input
														style={{ borderLeftTopRadius: 0, borderLeftBottomRadius: 0, }}
														type="text"
														className="form-control"
														ref="name"
														value={this.state.pickSection[index]}
														onChange={(data) => this.onSectionChange(data.target.value, index)}
													/>
												</TableRowColumn>
												<TableRowColumn style={{ width: 150 }} >
													{
														!section ? 'SECTION NOT EXTIST' : section.time_slots.map((slot, index) => (
															<div key={index}>
																<span style={{ marginRight: 4 }} >{slot.day.toLocaleUpperCase()}: </span>
																{slot.start_time} - {slot.end_time}
															</div>
														))
													}
												</TableRowColumn>
												{/*<TableRowColumn style={{ width: 200 }} >
												{
													section ? section.amount + '/' + section.capacity : 'SECTION NOT EXTIST'
												}
											</TableRowColumn>*/}
												<TableRowColumn style={{ width: 100 }} >
													<RaisedButton label="ADD" primary={true} onClick={() => {
														if (this.state.plan == 0) this.addCourse(result, this.state.pickSection[index]);
														else this.addPreCourse(result, this.state.pickSection[index]);
													}} />
												</TableRowColumn>
											</TableRow>
										);
									})
								}
							</TableBody>
						</Table>
					</div>
				</div>

				<div style={{ marginTop: 20, }}>
					<div style={{ fontSize: 20 }} >
						{this.state.planTitle}
						{this.state.plan != 0 && <RaisedButton label="REGISTER ALL" primary={true} style={{ marginLeft: 20 }} onClick={() => this.registerPreCourse()} />}
					</div>
					<div style={{ marginTop: 20, marginBottom: 20, }} >
						{
							this.state.plan == 0 &&
							<Schedule year={2017} semester={2} courses={this.props.studentCourses} />
						}
						{
							this.state.plan != 0 &&
							<Schedule year={2017} semester={2} courses={this.state.preCourses} />
						}
					</div>
					<Table>
						<TableBody displayRowCheckbox={false}>
							<TableRow>
								<TableRowColumn style={{ fontWeight: 'bold', width: '20%' }}>#</TableRowColumn>
								<TableRowColumn style={{ fontWeight: 'bold', width: '30%' }}>Course</TableRowColumn>
								<TableRowColumn style={{ fontWeight: 'bold', width: '20%' }}>Section</TableRowColumn>
								<TableRowColumn style={{ fontWeight: 'bold', }}></TableRowColumn>
							</TableRow>
							{
								this.state.plan == 0 &&
								this.state.studentCourses.map((course, index) => {

									return (
										<TableRow key={index} >
											<TableRowColumn style={{ width: '20%' }}>{course.courseId}</TableRowColumn>
											<TableRowColumn style={{ width: '30%' }}>{course.courseName}</TableRowColumn>
											<TableRowColumn style={{ width: '20%' }}>{course.section}</TableRowColumn>
											<TableRowColumn style={{}}>
												<RaisedButton label="REMOVE" style={{ marginRight: 8 }} primary={true} onClick={() => this.removeCourse(course)} />
												<RaisedButton disabled={course.grade == 'W'} label="WITHDRAW" primary={true} onClick={() => this.withdraw(course)} />
											</TableRowColumn>
										</TableRow>
									)
								})
							}
							{
								this.state.plan != 0 &&
								this.state.tableCourses.map((course, index) => {

									return (
										<TableRow key={index} >
											<TableRowColumn style={{ width: '20%' }}>{course.courseId}</TableRowColumn>
											<TableRowColumn style={{ width: '30%' }}>{course.courseName}</TableRowColumn>
											<TableRowColumn style={{ width: '20%' }}>{course.section}</TableRowColumn>
											<TableRowColumn style={{}}>
												{course.plan_id != undefined && <RaisedButton label="REMOVE" primary={true} onClick={() => this.removePreCourse(course) } />}
											</TableRowColumn>
										</TableRow>
									)
								})
							}
						</TableBody>
					</Table>
				</div>
			</div>
		);
	}
}

export default SearchPanel;