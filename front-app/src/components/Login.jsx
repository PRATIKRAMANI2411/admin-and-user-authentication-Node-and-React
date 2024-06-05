import React, { useRef, useState } from 'react';
import "./login.css";
import axios from 'axios';
import { Form, Button, Alert } from "react-bootstrap";

const Login = () => {
    const [fname, setFname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [showerror, setShowerror] = useState("");
    const [showsuccess, setShowsuccess] = useState("");

    const formRef = useRef(null);

    const handleSubmit = (e) => {

        e.preventDefault();

        if (userType === "Admin" && secretKey !== "AdarshT") {
            setShowerror("Invalid Admin");
        } else {
            console.log(fname, email, password);

            axios.post("http://localhost:8003/api/auth/register-user", {
                fname,
                email,
                password,
                userType,
            })
                .then((response) => {
                    const data = response.data;
                    console.log(data, "userRegister");
                    if (data.status === true) {
                        setShowsuccess("Registration Successful");
                        if (formRef.current) {
                            formRef.current.reset();
                        }
                    } else {
                        setShowerror("Something went wrong");
                    }
                })
                .catch((error) => {
                    console.error("There was an error!", error);
                    setShowerror("Something went wrong");
                });
        }       
    };

    return (
        <div className="sign-in__wrapper">
            <div className="sign-in__backdrop"></div>
            <Form ref={formRef} className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                <div className="h4 mb-2 text-center">Sign In</div>
                {showerror && (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setShowerror(false)}
                        dismissible
                    >
                        {showerror}
                    </Alert>
                )}
                {showsuccess && (
                    <Alert
                        className="mb-2"
                        variant="success"
                        onClose={() => setShowsuccess(false)}
                        dismissible
                    >
                        {showsuccess}
                    </Alert>
                )}
                <div key="inline-radio" className="mb-3">
                    <Form.Check
                        inline
                        type="radio"
                        label="User"
                        name="UserType"
                        value="User"
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        label="Admin"
                        name="UserType"
                        value="Admin"
                        onChange={(e) => setUserType(e.target.value)}
                    />
                </div>
                {userType === "Admin" && (
                    <div className="mb-3">
                        <Form.Label>Secret Key</Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control"
                            placeholder="Secret Key"
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                    </div>
                )}
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setFname(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="checkbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button className="w-100" variant="primary" type="submit">
                    Log In
                </Button>
                <div className="d-grid justify-content-end">
                    <Button className="text-muted px-0" variant="link">
                        Forgot password?
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Login;
