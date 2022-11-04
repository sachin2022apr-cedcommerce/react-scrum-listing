import { Badge, Button, ButtonGroup, Heading } from '@shopify/polaris';
import { Image, Space, Table, Tabs, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ClockMajor
} from '@shopify/polaris-icons';
import ModalInProgress from '../modal/ModalInProgress';
import useFetch from '../../customHook/useFetch';
// import tabcss from './TabOptions.module.css'
const { Text } = Typography;
const tabWiseUrl = [
  "",
  "&filter[cif_amazon_multi_inactive][1]={Not Listed}",
  "&filter[items.status][1]=Inactive",
  "&filter[items.status][1]=Incomplete",
  "&filter[items.status][1]=Active",
  "&filter[cif_amazon_multi_activity][1]=error"
]
const columns = [
  {
    title: <Text strong>Image</Text>,
    dataIndex: 'image',
  },
  {
    title: <Text strong>Name</Text>,
    dataIndex: 'title',
  },
  {
    title: <Heading>Product Details</Heading>,
    dataIndex: 'ProductDetails'
  },
  {
    title: <Heading>Template</Heading>,
    dataIndex: 'template'
  },
  {
    title: <Heading>Inventory</Heading>,
    dataIndex: 'inventory'
  },
  {
    title: <Heading>Amazon Status</Heading>,
    dataIndex: 'amazonStatus'
  },
  {
    title: <Heading>Activity</Heading>,
    dataIndex: 'activity'
  },
  {
    title: <Heading>Action</Heading>,
    dataIndex: 'action'
  }
];
const childTableColumns = [
  {
    title: <Heading>Image</Heading>,
    dataIndex: 'image',
  },
  {
    title: <Heading>Name</Heading>,
    dataIndex: 'title',

    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: <Heading>Product Details</Heading>,
    dataIndex: 'ProductDetails'
  },
  {
    title: <Heading>Inventory</Heading>,
    dataIndex: 'inventory'
  },
  {
    title: <Heading>Amazon Status</Heading>,
    dataIndex: 'amazonStatus'
  },
  {
    title: <Heading>Activity</Heading>,
    dataIndex: 'activity'
  }
]
export default function TabOptions({selected, setSelected}) {
  var { getListingData } = useFetch()

  const [activeProgressModal, setActiveProgressModal] = useState(false);
  const [modalProp, setModalProp] = useState([])
  const [tableLayout, setTableLayout] = useState(undefined);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);

  const handleChange = useCallback(() => {
    setActiveProgressModal(!activeProgressModal)
  },[activeProgressModal]);

  const tableColumns = columns.map((item) => ({
    ...item,
  }));
 

  const tableProps = {
    rowSelection: true,
    tableLayout,
  };

  useEffect(() => {
    setLoading(true)
    getListingData(`https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts?${tabWiseUrl[selected]}`)
      .then((result) => {
        console.log(result);
        // console.log(result.data.rows);
        setLoading(false)
        var tableData = [];
        var products = result.data.rows;
        for (var index = 0; index < products.length; index++) {
          var productClild = []
          var ProductDetails = <></>
          var parentAmazonStatus = <></>
          var children = products[index].items;
          var Quantity = 0;
          var ChildCount = 0;
          var ActivityStatus = "--"
          var parentActivity = "--";
          parentAmazonStatus = <span className='NotListedBadge'>
            <Badge status="new">Not Listed</Badge>
          </span>
          if (products[index].type === "variation") {

            if (children.every((item) => item.status === undefined)) {
              parentAmazonStatus = <span className='NotListedBadge'>
                <Badge status="new">Not Listed</Badge>
              </span>
            }
            else if (children.some((item) => item.status?.startsWith('Not Listed'))) {
              parentAmazonStatus = <span className='NotListedBadge'>
                <Badge status="new">Not Listed</Badge>
              </span>
            } else if (children.some((item) => item.status?.startsWith('Active'))) {
              parentAmazonStatus = <span className='badge'><Badge status="success">Active</Badge></span>
            }
            else if (children.some((item) => item.status?.startsWith('Inactive'))) {
              parentAmazonStatus = <span className='badge'><Badge status="critical">Inactive</Badge></span>
            }
            else if (children.some((item) => item.status?.includes('Incomplete'))) {
              parentAmazonStatus = <span className='badge'><Badge status="warning">
                Incomplete</Badge></span>
            }
            for (var idx = 1; idx < children.length; idx++) {
              var PDetails = (<span>
                <Text strong>Price:</Text>
                <Text type="secondary"> {children[idx].price}</Text>
                <br />
                <Text strong>Barcode:</Text>
                <Text type="secondary">{(children[idx].barcode === "") ?
                  <>N/A</> : <>{children[idx].barcode}</>}</Text><br />
                <Text strong>SKU:</Text>
                <Text type="secondary">{children[idx].sku}</Text><br />
                <Text strong>ASIN:</Text>
                <Text type="secondary">{(children[idx].asin === undefined) ? <>N/A</> : <>{children[idx].asin}</>}</Text>
              </span>)
              var childAmazonStatus = <span className='NotListedBadge'>
                <Badge status="new">Not Listed</Badge></span>;
              if (children[idx]["error"] !== undefined) {
                childAmazonStatus = <span className='errorBadge'><Badge status="success">Error</Badge></span>
                parentAmazonStatus = <span className='errorBadge'><Badge status="success">Error</Badge></span>
              } else if (children[idx]["status"] !== undefined) {
                if (children[idx].status.includes('Not Listed'))
                  childAmazonStatus = <span className='NotListedBadge'>
                    <Badge status="new">{children[idx].status}</Badge></span>

                if (children[idx].status.includes('Inactive')) {
                  childAmazonStatus = <Badge status="critical">
                    {children[idx].status}</Badge>
                }
                if (children[idx].status.includes('Incomplete')) {
                  childAmazonStatus = <Badge status="warning">{children[idx].status}</Badge>
                }
                if (children[idx].status.includes('Active')) {
                  childAmazonStatus = <Badge status="success">
                    {children[idx].status}
                  </Badge>
                }
              }
              
              if(children[idx]['process_tags'] !== undefined){
                ActivityStatus = <Button icon={ClockMajor} onClick={() => {
                  setModalProp("Sachin")
                  setActiveProgressModal(!activeProgressModal)
                }}  
                plain monochrome> In Progress</Button>
              }

              productClild.push({
                key: `${index}${idx}`,
                image: (<Image width={80} src={`${children[idx].main_image}`}
                  alt={children[idx].title} />),
                title: children[idx].title,
                ProductDetails: PDetails,
                inventory: children[idx].quantity,
                activity: ActivityStatus,
                amazonStatus: childAmazonStatus,
              })
              Quantity += children[idx].quantity;
              ChildCount += 1;
            }
          } else {
            
            ProductDetails = <span>
              <Text strong>Price:</Text>
              <Text type="secondary"> {children[0].price}</Text><br />
              <Text strong>Barcode:</Text>
              <Text type="secondary"> {(children[0].barcode === "") ?
                <>N/A</> : <>{children[0].barcode}</>}</Text>
            </span>
            Quantity = children[0].quantity;

            parentAmazonStatus = <span className='NotListedBadge'>
              <Badge status="new">Not Listed</Badge>
            </span>
            if (children[0]['error'] !== undefined) {
              parentAmazonStatus = <span className='errorBadge'><Badge status="success">Error</Badge></span>
            }
            else if (children[0]['status'] !== undefined && parentAmazonStatus !== 'error') {
              if (children[0].status.includes('Not Listed'))
                parentAmazonStatus = <span className='NotListedBadge'>
                  <Badge status="new">{children[0].status}</Badge></span>

              if (children[0].status.includes('Inactive')) {
                parentAmazonStatus = <span className='badge'><Badge status="critical">
                  {children[0].status}</Badge></span>
              }
              if (children[0].status.includes('Incomplete')) {
                parentAmazonStatus = <span className='badge'><Badge status="warning">
                  {children[0].status}</Badge></span>
              }
              if (children[0].status.includes('Active')) {
                parentAmazonStatus = <span className='badge'><Badge status="success">
                  {children[0].status}
                </Badge></span>
              }
            }
          }

          var parentDetails = <>
            <Text strong>SKU:</Text>
            <Text type="secondary">{products[index].container_id}</Text><br />
            <Text strong>ASIN:</Text>
            <Text type="secondary">{(products[index].asin === undefined) ? <>N/A</> : <>{products[index].asin}</>}</Text>
          </>
          var template = "N/A";
          if (products[index].profile !== undefined)
            template = (products[index].profile.profile_name)

          var inventoryString = ""
          if (ChildCount === 0) {
            inventoryString = `${Quantity} in stock`
          } else inventoryString = `${Quantity} in stock for ${ChildCount} variant`
          // ttt = children[0].process_tags[0].toString()
          if(children[0]?.process_tags){    
            console.log(children[0].process_tags);
            var  processTag = children[0].process_tags
            if(children[0].process_tags[0].includes("in progress")){
              parentActivity = <Button 
              icon={ClockMajor} 
              onClick={() => {
                  setModalProp([...processTag]);
                  setActiveProgressModal(!activeProgressModal)
                }}  
              plain monochrome> In Progress</Button>
            }
          }

          tableData.push({
            key: index,
            image: (<Image width={80} src={`${products[index].main_image}`} alt={products[index].title} />),
            title: products[index].title,
            ProductDetails: (<>{ProductDetails}<br />{parentDetails}</>),
            description: [...productClild],
            template: template,
            inventory: inventoryString,
            amazonStatus: parentAmazonStatus,
            activity: parentActivity,
            action: parentAmazonStatus.props.children.props.children
          })
        }
        setData([...tableData]);
      })

  }, [selected])
  console.log(data);
  return (
    <>
      <Table
        {...tableProps}
        bordered
        pagination={false}
        columns={tableColumns}
        dataSource={data}
        loading={loading}
        expandable={{
          expandedRowRender: record => <>
            <Table {...tableProps}
              bordered
              pagination={false}
              columns={childTableColumns} dataSource={record.description}
            />
          </>,
          rowExpandable: record => record.description.length !== 0,
        }}
        scroll={{ x: 900 }}
        />
      <ModalInProgress activeProgressModal = {activeProgressModal}
      setActiveProgressModal={setActiveProgressModal} 
      modalProp={modalProp}/>
    </>
  )
}