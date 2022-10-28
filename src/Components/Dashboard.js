import { Frame, TopBar }
    from '@shopify/polaris';

import React, { useCallback, useState } from 'react'
import { ArrowLeftMinor } from '@shopify/polaris-icons';
import { connect } from 'react-redux';
import { LogoutUser } from '../actions';
import { useNavigate } from 'react-router-dom';

function Dashboard({ userLogout, userData }) {

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    var [userDetails, setUserDetails] = useState(JSON.parse(sessionStorage.getItem('UserLogin')))
    
    console.log(userDetails);
    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
        [],
    );
    
    const home = useNavigate();
    var logout = () => {
        sessionStorage.clear();
        userLogout();
        home('/');
    }

    if (sessionStorage.getItem('UserLogin') === null) { home('/') }
    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[
                {
                    items: [{
                        content: 'logout', icon: ArrowLeftMinor,
                        onAction: logout
                    }]
                }
            ]}
            name={userDetails?.name}
            detail={userDetails?.userName}
            initials={userDetails?.name.charAt(0).toUpperCase()}
            open={isUserMenuOpen}
            onToggle={toggleIsUserMenuOpen}
        />
    );
    const topBarMarkup = (<TopBar userMenu={userMenuMarkup} />);
    return (
        <div className='dashboard' style={{ height: '50px' }}>
            <Frame topBar={topBarMarkup} />
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
        userLogout: () => dispatch(LogoutUser())
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(Dashboard)