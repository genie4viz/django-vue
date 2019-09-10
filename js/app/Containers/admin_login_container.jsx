import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import AdminLogin from '../Components/admin_components/admin_login.jsx'
import {loginAdminByEmail} from "../Actions/login_actions.jsx"

const mapStateToProps = state => {
    return {
        authed: state.authed,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginAdmin: formData => dispatch(loginAdminByEmail(formData))
    }
}

class AdminLoginContainer extends Component {
    static propTypes = {
        loginAdmin: PropTypes.func.isRequired,
    }

    render() {
        return <AdminLogin login={this.props.loginAdmin}/>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLoginContainer)