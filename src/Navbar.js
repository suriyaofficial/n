import React, { useState } from 'react'
import axios from 'axios';
import { Col, Row, Button, Modal, Input, Space, Divider, Form, Tabs, Checkbox, notification } from 'antd';
import { LoginOutlined, EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
// import { Button, Divider, Flex, Radio } from 'antd';
import './App.css';



function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const { Search } = Input;
    const [api, contextHolder] = notification.useNotification();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const openNotificationWithIcon = (type, msg, des, placement) => {
        try {
            api[type]({ message: msg, description: des, placement });
        } catch (error) {
            console.log("🚀 ~ file: Home.js:90 ~ openNotificationWithIcon ~ error:", error)

        }
    };
    const handleOk = (value, _e, info) => {
        console.log("🚀 ~ file: Navbar.js:18 ~ handleOk ~ value,", value)
        console.log("🚀 ~ file: Navbar.js:18 ~ handleOk ~  _e,:", _e)
        console.log("🚀 ~ file: Navbar.js:18 ~ handleOk ~  info:", info)
        setIsModalOpen(false);
        // console.log("🚀 ~ file: Navbar.js:20 ~ handleOk ~ e:", e.value)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const checkUserNameAvailability = async (value) => {
        console.log("🚀 ~ file: Login.js:14 ~ checkUserName")
        const data = JSON.stringify({
            "username": value
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://server-ag3p.onrender.com/userNameCheck/',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cml5YV9PZmZpY2lhbCIsImlhdCI6MTcwNzk3NTU3OH0.GCTBrqdmVpXXVde65s573FIOhV2n415Mu0euEM3jDJM',
                'Content-Type': 'application/json'
            },
            data: data
        };

        try {
            const response = await axios.request(config);
            console.log("🚀 ~ file: Login.js:19 ~ checkUserNameAvailability ~ response.data.result:", response.data);

            return response.data.result;
        } catch (error) {
            console.log("🚀 ~ file: Login.js:22 ~ checkUserNameAvailability ~ error.response.data.result:", error.response.data);
            return error.response.data.result;
        }

    }
    const onFinishSignUp = async (values) => {
        console.log('🚀Success:', values);
        let data = {
            "username": values.username,
            "password": values.signinconfirmPassword
        };

        try {
            const response = await axios.post('https://server-ag3p.onrender.com/register/', data);
            console.log("🚀 ~ file: Login.js:35 ~ onFinish ~  response.data.result:", response)
            openNotificationWithIcon('success', 'Success', response.data.result, 'top')
            let login = {
                "loginUserName": values.username,
                "loginPassword": values.signinconfirmPassword
            }
            // onFinishLogin(login)
            return response.data.result
        } catch (error) {
            console.log("🚀 ~ file: Login.js:38 ~ onFinish ~ error.response.data.result:", error)
            openNotificationWithIcon('error', 'Error', `${error.response.data.result}`, 'top')
            return error.response.data.result
        }
    };
    const onFinishLogin = async (values) => {
        console.log('🚀Success:', values);
        let data = {
            "username": values.loginUserName,
            "password": values.loginPassword
        };

        try {
            const response = await axios.post('https://server-ag3p.onrender.com/login/', data);
            console.log("🚀 ~ file: Login.js:66 ~ onFinishLogin ~ response:", response.data.result)
            console.log("🚀 ~ file: Login.js:79 ~ onFinishLogin ~ response.data.JWT:", response.data.JWT)
            openNotificationWithIcon('success', 'Success', response.data.result, 'top')
            const now = new Date();
            // Expires in 1 minute
            const expiration1Min = new Date(now.getTime() + 15 * 60 * 1000);
            // return response.data.result
            // document.cookie = `jwtToken1Min=${response.data.JWT}; expires=${expiration1Min.toUTCString()}; path=/`;
            document.cookie = `jwtToken=${response.data.JWT};path=/`;
            // window.location.reload();
        } catch (error) {
            console.log("🚀 ~ file: Login.js:38 ~ onFinish ~ error.response.data.result:", error.response.data.result)
            openNotificationWithIcon('error', 'Error', `${error.response.data.result}`, 'top')
            return error.response.data.result
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('🚀Failed:', errorInfo);
    };
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (<>

        <Row className='navbar' justify="space-between" align="center"  >
            <Col span={2}><h1>-----</h1></Col><Col span={2}><Button type="primary" onClick={showModal} icon={<LoginOutlined />}>sign In</Button></Col>
        </Row>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={500}>
            <Row>
                <Tabs type="card">
                    <Tabs.TabPane tab="SIGN UP" key="sign-up">
                        <Col span={12}>
                            <h1>sign up</h1>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                style={{
                                    maxWidth: 600,
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinishSignUp}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                        { whitespace: true },
                                        { min: 5 },
                                        ({ getFieldValue }) => ({
                                            async validator(_, value) {
                                                console.log("🚀 ~ file: Login.js:80 ~ validator ~ value:", value)
                                                if (value.length > 4) {
                                                    let res = await checkUserNameAvailability(value)
                                                    console.log("🚀 ~ file: Login.js:89 ~ validator ~ resultt:", res)
                                                    if (res === "username availble") {
                                                        return Promise.resolve();
                                                    } else {
                                                        return Promise.reject(new Error('username not availble'));
                                                    }
                                                }
                                                // else {
                                                //     return Promise.reject(new Error('username must be 5 charachter'));
                                                // }
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                >
                                    <Input prefix={<UserOutlined />}
                                        placeholder="input search text"
                                        allowClear
                                        // enterButton="Check availblity"
                                        size="large"
                                        // onSearch={onSearch}
                                        style={{ width: 350, }} />
                                    {/* <Input /> */}
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="signinpassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password style={{ width: 350, }} prefix={<LockOutlined />} placeholder="enter password" />
                                </Form.Item>
                                <Form.Item
                                    label="Confirm password"
                                    name="signinconfirmPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        }, ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('signinpassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The new password that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password style={{ width: 350, }} prefix={<LockOutlined />} placeholder="enter password" />
                                </Form.Item>

                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="LOGIN" key="login">
                        <Col span={12}>
                            <h1>login</h1>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                style={{
                                    maxWidth: 600,
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinishLogin}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Username"
                                    name="loginUserName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                    ]}
                                >
                                    {/* <Search prefix={<UserOutlined />}
                                    placeholder="input search text"
                                    allowClear
                                    enterButton="Check availblity"
                                    size="large"
                                    onSearch={onSearch}
                                    style={{ width: 350, }} /> */}
                                    <Input style={{ width: 300 }} />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="loginPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password style={{ width: 300 }} />
                                </Form.Item>
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Tabs.TabPane>

                </Tabs>





            </Row>
        </Modal>
    </>

    )
}

export default Navbar