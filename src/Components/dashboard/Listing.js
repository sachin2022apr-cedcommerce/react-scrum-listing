import { Button, Card, Frame, Navigation } from '@shopify/polaris'
import {
    HomeMinor,
    OrdersMinor,
    ProductsMinor,
    CirclePlusOutlineMinor,
    CustomersMinor,
    AnalyticsMinor,
    MarketingMajor,
    DiscountsMinor,
    AppsMinor,
    OnlineStoreMajor,
    QuickSaleMajor

} from '@shopify/polaris-icons';
import React from 'react'

function Listing() {
    return (
        <Frame>
            <Navigation location="/">
                <Navigation.Section
                    items={[
                        {
                            label: 'Home',
                            icon: HomeMinor,
                        },
                        {
                            label: 'Orders',
                            icon: OrdersMinor,
                            badge: '15',
                        },
                        {
                            label: 'Products',
                            icon: ProductsMinor,
                        },
                        {
                            label: 'Customers',
                            icon: CustomersMinor,
                        },
                        {
                            label: 'Analytics',
                            icon: AnalyticsMinor,
                        },
                        {
                            label: 'Marketing',
                            icon: MarketingMajor,
                        },
                        {
                            label: 'Discounts',
                            icon: DiscountsMinor,
                        },
                        {
                            label: 'Apps',
                            icon: AppsMinor,
                        },
                    ]}
                />
                <Navigation.Section
                    title="Sales channels"
                    action={{
                        accessibilityLabel: 'Add sales channel',
                        icon: CirclePlusOutlineMinor,
                        onClick: () => { },
                    }}
                    items={[
                        {
                            label: 'Online store',
                            icon: OnlineStoreMajor,
                        },
                        {
                            label: ' Point of sale',
                            icon: QuickSaleMajor,
                        },
                    ]}
                    separator
                />
                <Navigation.Section
                    title="Overview"
                    items={[
                        {
                            label: 'Lisitngs',
                            icon: OnlineStoreMajor,
                            action: "d",
                            url:"/"
                        },
                        {
                            label: 'Product Linking',
                        },
                        {
                            label: 'Settings',
                        },
                        {
                            label: 'FAQ',
                        },
                    ]}
                    separator
                />
            </Navigation>
        </Frame>
    )
}

export default Listing