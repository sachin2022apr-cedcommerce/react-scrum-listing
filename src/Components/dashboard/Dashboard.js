import { Badge, Card, Columns, Frame, Heading, Page, Select, Tabs, TextStyle, TopBar } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react'
import { ArrowLeftMinor } from '@shopify/polaris-icons';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogoutUser } from '../../Redux/actions';
import Listing from './Listing';
import TabOptions from '../tabs/TabOptions';
import useFetch from '../../customHook/useFetch';
import Filter from './Filter';

function Dashboard({ userLogout, userData }) {
    var [dataCount, setDataCount] = useState({
        NotListed: 0,
        Inactive: 0,
        Incomplete: 0,
        Active: 0
    })
    var { getListingData } = useFetch()
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
        { content: (<span>All</span>) },
        {
            id: 'Not Listed',
            content: (<span className='NotListedBadge'>
                Not Listed <Badge status="new">{dataCount.NotListed}</Badge>
            </span>),
        },
        {
            id: 'Inactive',
            content: (<span>
                Inactive <Badge status="critical">{dataCount.Inactive}</Badge>
            </span>),
        },
        {
            id: 'Incomplete',
            content: (<span>
                Incomplete <Badge status="warning">{dataCount.Incomplete}
                </Badge>
            </span>),
        },
        {
            id: 'Active',
            content: (<span>
                Active <Badge status="success">{dataCount.Active}</Badge>
            </span>),
        },
        {
            id: 'Error',
            content: (<span className='errorBadge'>
                Error
            </span>),
        }
    ];
    useEffect(() => {
        const url = `https://multi-account.sellernext.com/home/public/connector/product/getStatusWiseCount`
        getListingData(url).then((result) => {
            console.log(result.data)
            var tempCount = { NotListed: 0, Inactive: 0, Incomplete: 0, Active: 0 }
            result.data.forEach((item, index) => {
                if (item._id === "Inactive") tempCount.Inactive = item.total
                if (item._id === "Active") tempCount.Active = item.total
                if (item._id === null) tempCount.NotListed = item.total
                if (item._id === 'Incomplete') tempCount.Incomplete = item.total
            })
            setDataCount({ ...tempCount })
            /*Incomplete,null,Active,Inactive
            */
        })
    }, [])
    return (
        <Frame>
            <div className='dashboard' style={{ height: '60px' }}>
                <Frame topBar={topBarMarkup} />
            </div>
            <Columns columns={{   xs: '1fr 5fr',
          md: '1fr 5fr', }}>
                <Listing />
                <Frame>
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
                    <div style={{ margin: "30px 0px" }} >
                        <Card sectioned>
                        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted></Tabs>
                        <Filter/>
                        <TabOptions selected={selected}
                            setSelected={setSelected} />
                        </Card>
                    </div>
                </Frame>
            </Columns>
        </Frame>
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