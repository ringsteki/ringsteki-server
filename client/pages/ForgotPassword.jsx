import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../SiteComponents/AlertPanel';
import Form from '../FormComponents/Form';

import * as actions from '../actions';

class ForgotPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            captcha: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onCaptchaChange(value) {
        this.setState({ captcha: value });
    }

    onSubmit(state) {
        this.props.forgotPassword({ username: state.username, captcha: state.captcha });
    }

    render() {
        let errorBar = this.props.apiSuccess === false ? <AlertPanel type='error' message={ this.props.apiMessage } /> : null;
        let successBar = this.props.apiSuccess ? <AlertPanel type='success' message='Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.' /> : null;

        if(this.props.apiSuccess) {
            return <div className='col-sm-6 col-sm-offset-3'>{ successBar }</div>;
        }

        return (
            <div>
                <div className='col-sm-6 col-sm-offset-3'>
                    { errorBar }
                    { this.props.apiSuccess === false ? null : <AlertPanel type='info' message='To start the password recovery process, please enter your username and click the submit button.' /> }
                    <div className='panel-title'>
                        Forgot password
                    </div>
                    <div className='panel'>
                        <Form name='forgotpassword' buttonText='Submit' onSubmit={ this.onSubmit } apiLoading={ this.props.apiLoading }>
                            <div className='form-group'>
                                <div className='col-sm-offset-2 col-sm-3'>
                                    <ReCAPTCHA ref='recaptcha' sitekey='6LfELhMUAAAAAKbD2kLd6OtbsBbrZJFs7grwOREZ' theme='dark' onChange={ this.onCaptchaChange.bind(this) } />
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>);
    }
}

ForgotPassword.displayName = 'ForgotPassword';
ForgotPassword.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    forgotPassword: PropTypes.func,
    login: PropTypes.func,
    navigate: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.loading : undefined,
        apiMessage: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.message : undefined,
        apiSuccess: state.api.FORGOTPASSWORD_ACCOUNT ? state.api.FORGOTPASSWORD_ACCOUNT.success : undefined,
        socket: state.socket.socket
    };
}

export default connect(mapStateToProps, actions)(ForgotPassword);
