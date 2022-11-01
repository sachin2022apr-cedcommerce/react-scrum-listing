import { Heading } from '@shopify/polaris';
import { Image, Space, Table, Tabs, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
const { Title, Text } = Typography;
const columns = [
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

]
export default function TabOptions() {
  // const [showTitle, setShowTitle] = useState(false);
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [top, setTop] = useState('none');
  const [bottom, setBottom] = useState('bottomRight');
  const [hasData, setHasData] = useState(true);
  const [data, setData] = useState([]);

  const scroll = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = '100vw';
  }
  const tableColumns = columns.map((item) => ({
    ...item,
  }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const tableProps = {
    rowSelection: true,
    tableLayout,
  };
  // /filter[cif_amazon_multi_inactive][1]=Not Listed
  // https://multi-account.sellernext.com/home/public/connector/product/getStatusWiseCount
  // fetch(`https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts?count=65&filter[cif_amazon_multi_inactive][1]=Not Listed`, {
  // https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts?count=50&filter[cif_amazon_multi_activity][1]=error
  useEffect(() => {
    // fetch(`https://multi-account.sellernext.com/home/public/connector/product/getStatusWiseCount?&target_marketplace=eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9`,{
    fetch(`https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts`, {
      method: 'GET',
      Payload: {
        "source": {
          "marketplace": "shopify",
          "shopId": "507"
        },
        "target": {
          "marketplace": "amazon",
          "shopId": "509"
        },
        "count": 1
      },
      headers: {
        "Ced-Source-Id": 500,
        "Ced-Source-Name": "shopify",
        "Ced-Target-Id": 530,
        "Ced-Target-Name": "amazon",
        appCode:
          "eyJzaG9waWZ5IjoiYW1hem9uX3NhbGVzX2NoYW5uZWwiLCJhbWF6b24iOiJhbWF6b24ifQ==",
        appTag: "amazon_sales_channel",
        Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjk4NzMxOTc2LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzNWY2NDQ4YzQxY2M2MjdhMzBjNmIyMiJ9.o0XvqNpmiAaXQgWC8LgaBrhx6Kjc6rwm0vi-aG-ezZHp3Ph1jcaBqKQq1u9PQSwiCjU6US8xiqMbN_l5JYEwmPOWWQF43Fdt8V2i_dYp2L4mj51rKn9pH7xCloNPAiqCAp7IlfdwXU2NL5cYlb8p4Ve9axRKuPaZ6FpEL49fP8zjlT5gsfR7lr5UD_iKmBH-F-R4ORgQC3vR0CfsW42XXebfTiKf5fh2qBAIrjtSPJyO0jgNxLCTppnT3ruBf3yDL7EcAOFXzUZn_G8NsOSaZp5AvMWIMDkpmBO0VvgkIqSuYOlICki6riprysfwhuwU1XAtpNwI6N571dfUTPhXsw"
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        console.log(result.data.rows);
        var tableData = [];
        var products = result.data.rows;

        for (var index = 0; index < products.length; index++) {
          var productClild = []
          var ProductDetails = <></>
          var children = products[index].items;

          var Quantity = 0;
          var ChildCount = 0;
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
              productClild.push({
                key: `${index}${idx}`,
                image: (<Image width={100} src={`${children[idx].main_image}`}
                  alt={children[idx].title} />),
                title: children[idx].title,
                ProductDetails: PDetails,
                inventory: children[idx].quantity,
                
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
          tableData.push({
            key: index,
            image: (<Image width={100} src={`${products[index].main_image}`} alt={products[index].title} />),
            title: products[index].title,
            ProductDetails: (<>{ProductDetails}<br />{parentDetails}</>),
            description: [...productClild],
            template: template,
            inventory: inventoryString,
            amazonStatus:"s"
          })

        }
        setData([...tableData]);
      })
  }, [])
  console.log(data);
  return (
    <>
      <Table
        {...tableProps}
        bordered
        pagination={false}
        columns={tableColumns}
        dataSource={data}
        scroll={scroll}
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
      />
    </>
  )
}