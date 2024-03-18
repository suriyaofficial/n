import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Col, Row, Button, Modal, Input, Space, Divider, Form, Tabs, Checkbox, notification, Switch, Card } from 'antd';
import { LoginOutlined, EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import Item from 'antd/es/list/Item';

const YourComponent = () => {
    const [data, setData] = useState();
    const [d, setD] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loginState, setLoginState] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('');
    // const [typingUsers, setTypingUsers] = useState([]);
    // const [typingStatus, setTypingStatus] = useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const { Search } = Input;
    const [api, contextHolder] = notification.useNotification();
    let jwt
    let port = "http://localhost:3100"
    let dat
    const socket = io(port);
    useEffect(() => {
        checkLoginState()
        fetchData();
        socket.on('message', (message) => {
            if (message === "send_Successfully") {
                console.log("🚀 ~ file: Dash.js:45 ~ socket.on ~ message:", message)
                fetchData();

            }
        });
        // socket.on('typing', (message) => {
        //     console.log("🚀 ~ file: Dash.js:36 ~ socket.on ~ message:", message)
        //     console.log("🚀 ~ file: Dash.js:36 ~ socket.on ~ message:", message.includes(userName))
        //     if (message.includes(userName) === false) {
        //         setTypingUsers(message);
        //         // Clear typing indicator after 3 seconds
        //         setTimeout(() => {
        //             setTypingUsers([]);
        //             setTypingStatus(false);

        //         }, 5000);
        //     }
        // });

    }, []);

    const fetchData = async () => {
        jwt = document.cookie.split("jwtToken=")[1]
        // Get an item from local storage
        setUserName(localStorage.getItem('username'));
        console.log("🚀 ~ file: Dash.js:18 ~ YourComponent ~ userName:", userName)


        console.log("🚀 ~ file: Dash.js:10 ~ fetchData ~ jwt:", jwt)
        setLoading(true);
        try {
            const response = await axios.get(`${port}/getStatus/`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            dat = response.data.chatRoom
            console.log("🚀 ~ file: Dash.js:16 ~ fetchData ~ response:", response.data)
            setData(response.data);
            // if (!data) {
            //     setD("hi")
            // }
            // console.log("🚀 ~ file: Dash.js:11 ~ YourComponent ~ dat:", dat)



        } catch (error) {
            console.log("🚀 ~ file: Dash.js:19 ~ fetchData ~ error:", error)
            setError(error);
        } finally {
            setLoading(false); // Set loading to false after the request completes (either success or error)
        }
    };
    const checkLoginState = async () => {
        try {
            jwt = document.cookie.split("jwtToken=")[1]
            console.log("🚀 ~ file: Dash.js:41 ~ checkLoginState ~ jwt:", jwt)
            if (jwt) {
                setLoginState(true)
            }
        } catch (error) {
            console.log("🚀 ~ file: Dash.js:56 ~ checkLoginState ~ error:", error)
        }
    }

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
    const time = (a, b) => {
        const timestampSeconds = a;
        const timestampNanoseconds = b;

        // Combine seconds and nanoseconds
        const totalMilliseconds = timestampSeconds * 1000 + Math.round(timestampNanoseconds / 1e6);

        // Create a new Date object
        const dateObj = new Date(totalMilliseconds);

        // Format the date
        const formattedDate = dateObj.toUTCString(); // or use other methods to format as needed
        console.log("Converted Time:", formattedDate);
        return formattedDate

    }
    const checkUserNameAvailability = async (value) => {
        console.log("🚀 ~ file: Login.js:14 ~ checkUserName")
        const data = JSON.stringify({
            "username": value
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${port}/userNameCheck/`,
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
            const response = await axios.post(`${port}/register/`, data);
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
            const response = await axios.post(`${port}/login/`, data);
            console.log("🚀 ~ file: Login.js:66 ~ onFinishLogin ~ response:", response.data.result)
            console.log("🚀 ~ file: Login.js:79 ~ onFinishLogin ~ response.data.JWT:", response.data.JWT)
            openNotificationWithIcon('success', 'Success', response.data.result, 'top')
            const now = new Date();
            // Expires in 1 minute
            const expiration1Min = new Date(now.getTime() + 15 * 60 * 1000);
            // return response.data.result
            // document.cookie = `jwtToken1Min=${response.data.JWT}; expires=${expiration1Min.toUTCString()}; path=/`;
            document.cookie = `jwtToken=${response.data.JWT};path=/`;
            // Set an item in local storage
            localStorage.setItem('username', response.data.username);

            setLoginState(true)
            window.location.reload();

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
    const onChange = async (checked, e) => {
        setLoading(true); // Set loading to false after the request completes (either success or error)
        console.log(`switch to ${checked}`);
        console.log("🚀 ~ file: Dash.js:190 ~ onChange ~ e:", e)
        jwt = document.cookie.split("jwtToken=")[1]
        console.log("🚀 ~ file: Dash.js:171 ~ change ~ jwt:", jwt)
        try {
            const data = JSON.stringify({
                "id": `${e}`,
                "status": checked
            });
            const config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: 'https://server-ag3p.onrender.com/control/device/',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            const response = await axios.request(config);
            console.log("🚀 ~ file: YourFileName.js:10 ~ fetchData ~ response:", response.data);
            fetchData();
        } catch (error) {
            console.error("🚀 ~ file: YourFileName.js:13 ~ fetchData ~ error:", error);
        } finally {
            setLoading(false); // Set loading to false after the request completes (either success or error)
        }

    };
    const logout = async (e) => {
        setLoading(false);
        document.cookie = "jwtToken" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();

    }
    const typing = async (e) => {
        try {
            setNewMessage(e.target.value)
            // if (typingStatus === false) {
            //     setTypingStatus(true);
            //     console.log("🚀 ~ file: Dash.js:259 ~ typing ~ typingStatus:", typingStatus)

            //     console.log("🚀 ~ file: Dash.js:244 ~ typing ~ e.target.value:", e.target.value)
            //     jwt = document.cookie.split("jwtToken=")[1]
            //     console.log("🚀 ~ file: Dash.js:249 ~ typing ~ jwt:", jwt)

            //     const response = await axios.get(`${port}/typing/`, {
            //         headers: {
            //             Authorization: `Bearer ${jwt}`
            //         }
            //     });
            //     console.log("🚀 ~ file: Dash.js:248 ~ typing ~ response:", response)
            // }
        } catch (error) {
            console.log("🚀 ~ file: Dash.js:260 ~ typing ~ error:", error)

        }
        console.log("🚀 ~ file: Dash.js:269 ~ typing ~ typingUsers:", typingUsers)
    }
    const sendMsg = async (e) => {
        console.log("🚀 ~ file: Dash.js:230 ~ sendMsg ~ e:", newMessage)
        let data = { "msg": newMessage };
        try {
            jwt = document.cookie.split("jwtToken=")[1]

            const response = await axios.post(`${port}/send/`, data, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            console.log("🚀 ~ file: Dash.js:236 ~ sendMsg ~ response:", response)
        } catch (error) {
            console.log("🚀 ~ file: Dash.js:238 ~ sendMsg ~ error:", error)

        }

    }
    // return (
    //     <h1>{dat}</h1>
    // )
    return (
        loginState ?
            <>
                <div style={{ position: 'relative', minHeight: '100vh' }}>
                    {loading && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                padding: '20px',
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}
                        >
                            Loading...
                        </div>
                    )}
                    {error && <p>Error: {error.message}</p>}
                    {data && (
                        <div >
                            <Button onClick={logout} >logout</Button>
                            <h1>Data from API:</h1>
                            <Card title="groupchat" style={{ width: 600, height: 700, marginTop: 16 }} actions={[
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input showCount maxLength="100" id="newMsg" onChange={typing} />
                                    <Button type="primary" onClick={sendMsg}>Submit</Button>
                                </Space.Compact>
                            ]} >
                                {typingUsers?.length > 0 && (
                                    <div>
                                        {typingUsers}
                                    </div>
                                )}

                                <div
                                    className="chat-container"
                                    style={{ maxHeight: '600px', overflowY: 'auto' }}
                                >
                                    {data.chatRoom.map(item => (<>
                                        {userName === item.user_name ? (
                                            <div className='right'>
                                                <p className='msg'>{item.msg}</p>
                                            </div>
                                        ) : (
                                            <div className='left'>
                                                <p><b>{item.user_name}</b></p>
                                                <p className='msg'>{item.msg}</p>
                                            </div>
                                        )}
                                    </>
                                    ))}
                                </div>
                            </Card>
                        </div >

                    )}
                </div ></> : (
                <>

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
                </>)
    );
};

export default YourComponent;
