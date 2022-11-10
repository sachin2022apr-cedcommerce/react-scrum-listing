import { Badge, Button, Heading, Pagination, Stack } from '@shopify/polaris';
import { Image, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

import {
  ClockMajor
} from '@shopify/polaris-icons';
import ModalInProgress from '../modal/ModalInProgress';
import useFetch from '../../customHook/useFetch';
import { connect } from 'react-redux';
import { tableFilter } from '../../Redux/actions';

const { Text } = Typography;
const tabWiseUrl = [
  "",
  "&filter[cif_amazon_multi_inactive][1]={Not Listed}",
  "&filter[items.status][1]=Inactive",
  "&filter[items.status][1]=Incomplete",
  "&filter[items.status][1]=Active",
  "&filter[cif_amazon_multi_activity][1]=error"
]

function TabOptions({ state, selected, setSelected, selectedOptions, setSelectedOptions }) {
  var { getListingData } = useFetch()
  const [activeProgressModal, setActiveProgressModal] = useState(false);
  const [modalProp, setModalProp] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(1)
  const [pagination, setPagination] = useState({
    next: null,
    prev: null
  })

  var amazonStatusRender = (record) => {
    return (
      <div>
        {record.key === "error" ? (
          <Stack>
            <span className='errorBadge'><Badge status="success">
              {record.key}
            </Badge></span>
            <Button plain>View Error</Button>
          </Stack>
        ) : (
          (record.key.includes('Not Listed') ?
            <span className='NotListedBadge'>
              <Badge status="new">{record.key}</Badge>
            </span> :
            record.key.includes('Active') ?
              <span className='badge'><Badge status="success">Active</Badge></span> :
              record.key.includes('Inactive') ?
                <Badge status="critical">Inactive</Badge> :
                record.key.includes('Incomplete') ?
                  <span className='badge'><Badge status="warning">
                    Incomplete</Badge></span> :
                  <></>
          )
        )}
      </div>
    );
  }

  const columns = [
    { title: <Text strong>Image</Text>, dataIndex: 'image' },
    { title: <Text strong>Name</Text>, dataIndex: 'title' },
    { title: <Heading>Product Details</Heading>, dataIndex: 'ProductDetails' },
    { title: <Heading>Template</Heading>, dataIndex: 'template' },
    { title: <Heading>Inventory</Heading>, dataIndex: 'inventory' },
    {
      title: <Heading>Amazon Status</Heading>, dataIndex: 'amazonStatus',
      render: (record) => {
        return amazonStatusRender(record)
      },
    },
    {
      title: <Heading>Activity</Heading>, dataIndex: 'activity',
      render: (record) => {
        if (record.length) {
          return (<Button
            icon={ClockMajor}
            onClick={() => {
              setModalProp([...record]);
              setActiveProgressModal(!activeProgressModal)
            }}
            plain monochrome> In Progress</Button>)
        } else
          return (<Text strong>--</Text>)
      }

    },
    { title: <Heading>Action</Heading>, dataIndex: 'action' }
  ];


  const childTableColumns = [
    { title: <Heading>Image</Heading>, dataIndex: 'image' },
    { title: <Heading>Name</Heading>, dataIndex: 'title' },
    { title: <Heading>Product Details</Heading>, dataIndex: 'ProductDetails' },
    { title: <Heading>Inventory</Heading>, dataIndex: 'inventory' },
    {
      title: <Heading>Amazon Status</Heading>, dataIndex: 'amazonStatus',

      render: (record) => {
        return amazonStatusRender(record)

      },
    },
    { title: <Heading>Activity</Heading>, dataIndex: 'activity' }
  ]

  const tableColumns = columns.map((item) => ({
    ...item,
  }));

  var tableData = (result) => {
    setLoading(false)
    setPagination({
      next: result.data.next,
      prev: result.data.prev
    })
    var tableData = [];
    if (result.success === true) {
      var products = result.data.rows;
      for (var index = 0; index < products.length; index++) {
        var productClild = []
        var ProductDetails = <></>
        var parentAmazonStatus = {}
        var children = products[index].items;
        var Quantity = 0;
        var ChildCount = 0;
        var ActivityStatus = <Heading alignment="center">--</Heading>
        var parentActivity = []
        if (
          Object.keys(products[index]).includes("error") ||
          Object.keys(products[index].items[0]).includes("error")
        ) {
          parentAmazonStatus = {
            key: "error",
            detail: {
              parent: { ...products[index].items[0]?.error },
              child: {},
            },
          };
        }


        
        if (products[index].type === "variation") {

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
            var childAmazonStatus = {};
          

            if (children[idx]["error"] !== undefined) {
              childAmazonStatus = {
                key: "error",
                detail: {
                  parent: {},
                  child: { ...products[index].items[idx].error },
                },
              };
              parentAmazonStatus.detail.child = { ...products[index].items[idx].error };
            } else {
              childAmazonStatus.key =
                products[index].items[idx]?.status ?? "Not Listed";
            }


            if (!Object.keys(parentAmazonStatus).length) {
              if (products[index].type !== "simple") {
                let notListed = children.every((item) =>
                  item.status.includes("Not Listed")
                );
                if (notListed) {
                  parentAmazonStatus.key = "Not Listed";
                }
                // INACTIVE
                if (
                  children.every((item) =>
                    item.status.includes("Inactive")
                  )
                ) {
                  parentAmazonStatus.key = "Inactive";
                }
                // INCOMPLETE
                if (
                  children.every((item) =>
                    item.status.includes("Incomplete")
                  )
                ) {
                  parentAmazonStatus.key = "Incomplete";
                }
                // ACTIVE
                let active = children.every(
                  (item) => item.status === "Active"
                );
                if (active) {
                  parentAmazonStatus.key = "Active";
                }
                // some varient listed
                let variantListed = children.some(
                  (item) =>
                    item.status === "Incomplete" ||
                    item.status === "Inactive" ||
                    item.status === "Active"
                );
                if (variantListed) {
                  parentAmazonStatus.key = "Some Varient Listed";
                }
                let error = children.every(
                  (item) => item.status === "error"
                );
                if (error) {
                  parentAmazonStatus.key = "error";
                }
              } else {
                parentAmazonStatus.key = products[index].items[0]?.parentAmazonStatus ?? "Not Listed";
              }
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
          if (products[index].items[0]['error'] === undefined)
            parentAmazonStatus.key = products[index].items[0]?.status ?? "Not Listed";

        }
        var parentDetails = <>
          <Text strong>SKU:</Text>
          <Text type="secondary">{products[index].container_id}</Text><br/>
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


        if (children[0]?.process_tags) {
          var processTag = children[0].process_tags
          if (children[0].process_tags !== undefined) {
            parentActivity = [...processTag]
          }
        }

        // if (children[0]?.process_tags) {
        //   var processTag = children[0].process_tags
        //   if (children[0].process_tags !== undefined) {
        //     parentActivity = [...processTag]
        //   }
        // }

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
          action:  (
            <Button> :
            </Button>
          ),
        })
      }
    }
    setData([...tableData]);
  }
  useEffect(() => {
    var Appliedfilter = JSON.parse(sessionStorage.getItem("fiterData"))
    var filterString = "";
    Appliedfilter?.forEach((item, index) => {
      if (item?.condition !== undefined && item.value !== undefined) {
        filterString += `&filter[${item.property}][${item.condition}]=${item.value}`
      }
    });

    var search;
    if (selectedOptions.length)
      search = `&filter[container_id][1]=${selectedOptions[0].value.id}`
    else search = ""

    if (selectedOptions.length)
      search = `&filter[container_id][1]=${selectedOptions[0].value.id}`
    else search = ""

    setLoading(true)
    getListingData(`https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts?${search}${tabWiseUrl[selected]}${filterString}&count=50`)
      .then((result) => {
        tableData(result)
      })
  }, [selected, selectedOptions, state.dataTable])

  var getPaginationData = (paginationValue) => {
    var url = ""
    if (paginationValue === "next")
      url = `https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts?next=${pagination.next}&count=50`
    if (paginationValue === "prev")
      url = `https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts?prev=${pagination.prev}&count=50`
    setLoading(true)
    getListingData(url)
      .then((result) => {
        tableData(result)
      })
  }
  return (
    <>
      <Table
        rowSelection={true}
        bordered
        pagination={false}
        columns={tableColumns}
        dataSource={data}
        loading={loading}
        expandable={{
          expandedRowRender: record => <>
            <Table rowSelection={true}
              bordered
              pagination={false}
              columns={childTableColumns} dataSource={record.description}
            />
          </>,
          rowExpandable: record => record.description.length !== 0,
        }}
        scroll={{ x: 900 }}
      />
      <Stack distribution="center">
        <Pagination
          label={(<><Button disabled>{pageCount}</Button> /7 page(s)</>)}
          hasPrevious={(pagination.prev === null) ? false : true}
          onPrevious={() => {
            getPaginationData("prev")
            setPageCount(pageCount - 1)
          }}
          hasNext={(pagination.next === null) ? false : true}
          onNext={() => {
            getPaginationData("next")
            setPageCount(pageCount + 1)
          }}
        />
      </Stack>

      <ModalInProgress activeProgressModal={activeProgressModal}
        setActiveProgressModal={setActiveProgressModal}
        modalProp={modalProp} selected={selected} setSelected={setSelected} />
    </>

  )
}

const MapStateToProps = (state) => {
  return {
    state: state
  }
}
const MapDispatchToProps = (dispatch) => {
  return {
    tableFilter: (value) => dispatch(tableFilter(value))
  }
}

export default connect(MapStateToProps, MapDispatchToProps)(TabOptions)