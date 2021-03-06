import React from 'react'
import moment from 'moment'
import { Typography, Input, Form, Button, Radio, Select, DatePicker, message, InputNumber } from 'antd'
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

import '@/core/types'
import { addCourseMutation } from '@/core/graphql/mutations/coursesMutations'
import { addPlaceMutation } from '@/core/graphql/mutations/placesMutations'

///
/// Create course component
///
const CreateCourse = (props) => {
    const course = props.course
    const [courseType, setCourseType] = React.useState("online");
    const onRadioChange = e => {
        setCourseType(e.target.value);
    };
    const dateFormat = "YYYY-MM-DD HH:mm";
    const onFinish = async (values) => {
        // add Place
        const isVirtual = courseType == "online"
        const newPlace = {
            virtual: isVirtual,
            name: course?.place.name ?? isVirtual ? "Portal online kurzů" : "Sportovni hala",
            url: course?.place.url ?? isVirtual ? "https://www.youtube.com/" : "https://www.google.com/maps",
            address: isVirtual ? course?.place.address ?? "online" : values.address ?? "U Sportovni haly 552, 778 21",
            city: course?.place.city ?? isVirtual ? "online" : "Brno"
        }
        const placeRes = await addPlaceMutation(newPlace)
        const placeId = placeRes.addPlace.id

        // add course
        const newCourse = {
            name: values.name,
            photoUrl: values.photoUrl ?? "https://i.picsum.photos/id/368/502/500.jpg?hmac=vY6iCyqn_on8VlSekONKlKqZeFHWTVWBhbGwr36ZP4U",
            capacity: values.capacity ?? 100,
            type: values.category,
            difficulty: values.difficulty,
            date: moment(values.date).format(dateFormat),
            duration: values.duration,
            price: values.price,
            description: values.message,
            skills: course?.skills ?? ["Residual Neural Networks", "Get many customers by using the best networking tool", "Set unbelievable goals for yourself"],
            content: course?.content ?? [{name: "Welcome to the Course", subchapters: ['Main Course Intro', 'Course Introduction and Best Practices', 'AI Superpowers', 'Key AI Components', 'Course Outline']}, {name: "Day 1: Develop an AI model to classify fashion elements using Google Teachable", subchapters: ['Introduction to Day 1', 'Task 1. Project Card and Demo', 'Task 2. AI Applications in Fashion', 'Quiz: AI Applications in Fashion', 'Task 3. Data Exploration', 'Task 4. Model Training and Testing in Google Teachable Machines']}],
            instructorId: values.instructorId,
            placeId: placeId
        }
        const res = await addCourseMutation(newCourse)
        if (res.addCourse) {
            message.success('Nový kurz byl úspěšně vytvořen')
            //clear field
            form.resetFields()
            setCourseType("online");
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();

    return (
        <div className="flex flex-col w-full h-full">
            <div className="mt-10 mb-5 border-b w-full text-center">
                <Title level={3}>Nový kurz</Title>
            </div>
            <div className="flex flex-col w-3/4 pl-26">
                <Form
                    form={form}
                    name="addCourse"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 32 }}
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={ course ? {
                        name: course.name,
                        date: moment(course.date, dateFormat),
                        duration: course.duration,
                        price: course.price,
                        category: course.type,
                        instructorId: course.instructor.id,
                        difficulty: course.difficulty,
                        message: course.description,
                        capacity: course.capacity,
                        photoUrl: course.photoUrl,
                        address: course.place.address
                    } : { type: "online"}}
                >
                    <Form.Item
                        label="Název"
                        name="name"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <Input placeholder="Název kurzu" />
                    </Form.Item>

                    <Form.Item
                        label="Datum"
                        name="date"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <DatePicker
                            placeholder="Začátek kurzu"
                            showTime={{ format: 'HH:mm' }}
                            format={dateFormat}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Délka trvání"
                        name="duration"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <Input type="number" placeholder="Počet minut" />
                    </Form.Item>

                    <Form.Item
                        label="Cena"
                        name="price"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <Input type="number" placeholder="Počet bodů"/>
                    </Form.Item>

                    <Form.Item
                        label="Kategorie"
                        name="category"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <Select
                            placeholder="Kategorie kurzu"
                        >
                            <Option value="IT">IT</Option>
                            <Option value="sport">Sport</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Lektor"
                        name="instructorId"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <Select
                            placeholder="Lektor"
                        >
                            {props.instructors.map((instructor) =>
                                <Option value={instructor.id}>{instructor.name} {instructor.surname}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Obtížnost"
                        name="difficulty"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <Select
                            placeholder="Obtížnost kurzu"
                        >
                            <Option value="BEGINNER">Začátečník</Option>
                            <Option value="INTERMEDIATE">Středně pokročilý</Option>
                            <Option value="ADVANCED">Pokročilý</Option>
                            <Option value="EXPERT">Expert</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Typ"
                        name="type"
                        valuePropName={courseType}
                    >
                        <Radio.Group onChange={onRadioChange} value={courseType}>
                            <Radio value="online">Online</Radio>
                            <Radio value="present">Prezenční</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Místo konání"
                        name="address"
                        rules={[{ required: false}]}
                    >
                        <Input placeholder="Vyplňte pouze pro prezenční kurz" />
                    </Form.Item>

                    <Form.Item
                        label="Zpráva"
                        name="message"
                        rules={[{ required: true, message: 'Toto pole je povinné!' }]}
                    >
                        <TextArea placeholder="Minimum je 10 znaku." autoSize={true} />
                    </Form.Item>

                    <Form.Item
                        label="Kapacita"
                        name="capacity"
                        rules={[{ required: false }]}
                    >
                        <InputNumber min={10} max={100} />
                    </Form.Item>

                    <Form.Item
                        label="URL obrázku"
                        name="photoUrl"
                        rules={[{ required: false }]}
                    >
                        <TextArea placeholder="Zde mužete vložit url obrazku kurzu" autoSize={true} />
                    </Form.Item>
                    {/* TODO - miss input for place - adress, city, url */}
                    {/* TODO - miss input for skills, content */}
                    <Form.Item wrapperCol={{ offset: 21, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Vytvořit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default CreateCourse