import { Badge, Card, Columns, Frame, Heading, Page, Select, Tabs, TextStyle, TopBar } from '@shopify/polaris';
import React, { useCallback, useState } from 'react'
import { ArrowLeftMinor } from '@shopify/polaris-icons';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogoutUser } from '../../Redux/actions';
import Listing from './Listing';
import TabOptions from '../tabs/TabOptions';

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


    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            content: (<span>All</span>)
        },
        {
            id: 'Not Listed',
            content: (
                <span>
                    Not Listed <span className='NotListedBadge'><Badge status="new">4</Badge></span>
                </span>
            ),
        },
        {
            id: 'Inactive',
            content: (
                <span>
                    Inactive <Badge status="critical">4</Badge>
                </span>
            ),
        },
        {
            id: 'Incomplete',
            content: (
                <span>
                    Incomplete <Badge status="warning">4</Badge>
                </span>
            ),
        },
        {
            id: 'Active',
            content: (
                <span>
                    Active <Badge status="success">4</Badge>
                </span>
            ),
        },
        {
            id: 'Error',
            content: (
                <span>
                    Error <span className='errorBadge'><Badge status="success">4</Badge></span>
                </span>
            ),
        },
    ];


    return (
        <>
            <div className='dashboard' style={{ height: '60px' }}>
                <Frame topBar={topBarMarkup} />
            </div>
            <Columns columns={{ xs: '2fr 10fr ' }}>
                <Listing />
                <Card sectioned>
                    <div className='listingAccount'>
                        <div>
                            <Heading>Listings</Heading>
                            <TextStyle variation="subdued">
                                You can manage your Shopify products here, which are enabled for Amazon by CedCommerce Sales Channel in your Shopify store.
                            </TextStyle>
                        </div>
                        <div className='sellerName'>
                            <Select
                                label="Seller Account"
                                options={
                                    [{ label: userDetails?.name }]
                                }
                            />
                        </div>
                    </div>
                    <div style={{ margin: "30px 2px" }} >
                        <>
                            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
                                <Card.Section>
                                    <p>Tab {selected} selected</p>
                                </Card.Section>
                            </Tabs>
                            <TabOptions />
                        </>
                    </div>
                </Card>
            </Columns>
        </>
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