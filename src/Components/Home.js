import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormLayout, TextField, TextStyle } from '@shopify/polaris';
import { connect } from 'react-redux';
import { getUser } from '../actions';

function Home({ successToken, setSuccessToken, userData, userLogin }) {
    // states for username and password
    var [name, setName] = useState("")
    var [username, setUsername] = useState("");
    var [password, setPassword] = useState("");
    var [error, setError] = useState("")
    // satate for loader
    var [isLoading, setIsLoading] = useState(false)
    // state for login error
    // var [failed, setFailed] = useState("");
    // navigation for login
    var loginN = useNavigate();
    var fetchOperation = {
        method: 'POST', headers: {
            'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA'
        }
    }

    // Authorizing user
    var handleSubmit = (event) => {
        event.preventDefault();
        // start loader
        setIsLoading(true)
        // if username and password is not blank
        if (username !== "" && password !== "") {
            setError("")
            // setFailed("Login Failed")
            // get user authorized
            fetch(`https://fbapi.sellernext.com/user/login?username=${username}&password=${password}`, fetchOperation)
                .then((res) => res.json())
                .then((temp) => {
                    // if user token is valid
                    if (temp.success) {
                        sessionStorage.clear();
                        // set token in session storage
                        var sessionDetails = {
                            name: name,
                            token: temp.data.token,
                            password: password,
                            userName: username
                        }
                        sessionStorage.setItem("UserLogin", JSON.stringify(sessionDetails));
                        setError("")
                        userLogin()
                        loginN('/dashboard')
                    }
                    // if not authorized 
                    else { setError("Login Failed") }
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setError("All fields are required")
            setIsLoading(false)
        }
    }
    return (
        <div className='home'>
            <Form onSubmit={(event) => handleSubmit(event)}>
                <FormLayout >
                    <TextField type="text" label="Username" value={name}
                        onChange={(value) => setName(value)}
                        // error={error}
                        autoComplete="email" />

                    <TextField type="text" label="Username" value={username} onChange={(value) => setUsername(value)} autoComplete="email"
                        // error={error}
                    />
                    <TextField type="password" label="Account email" value={password}
                        onChange={(value) => setPassword(value)} autoComplete="email"
                        // error={error}
                    />
                    <Button loading={isLoading} submit primary>Submit</Button>
                </FormLayout>
            </Form>

            {/* Error Message  */}
            <TextStyle variation="negative">{error}</TextStyle>
        </div>
    )
}

const MapStateToProps = (state) => {
    return {
        userData: state
    }
}
const MapDispatchToProps = (dispatch) => {
    return {
        userLogin: () => dispatch(getUser())
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(Home);