import { Image, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'

const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.description}</p>,
};
const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';
const columns = [
  {
    title: 'Image',
    dataIndex: 'image',
  },
  {
    title: 'name',
    dataIndex: 'title',
    // sorter: (a, b) => a.age - b.age,
  },
];

export default function TabOptions() {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState('large');
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showfooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
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
    ellipsis,
  }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const tableProps = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showfooter ? defaultFooter : undefined,
    rowSelection,
    scroll,
    tableLayout,
  };

  useEffect(() => {
    fetch(`https://multi-account.sellernext.com/home/public/connector/product/getRefineProducts`, {
      method: 'GET',
      Payload:{
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
      headers:{
        "Ced-Source-Id": 500,
        "Ced-Source-Name": "shopify",
        "Ced-Target-Id": 530,
        "Ced-Target-Name": "amazon",
        appCode:
        "eyJzaG9waWZ5IjoiYW1hem9uX3NhbGVzX2NoYW5uZWwiLCJhbWF6b24iOiJhbWF6b24ifQ==",
        appTag: "amazon_sales_channel",
        Authorization:"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY3MjI1NTMwLCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzNWY5ZjdhMGI5YjIwMTVlNTQ0MjM2NyJ9.Tbaa3G1Jv8r7xAg6Y16fK2FTTso8j-NuI5IcMn9FJ8W4bd_k4uiNqJVMC__NC1OWn8ldrcmzJGwffop5rNQLRIdObWbIzr2TBxmDwtJKRSMh-4-amDO6wJQiJSe1rl6CIyZXMcZnAB3rPf9vka4JWhFfNntLgZlGfoLWYCnOsww_xygFyvxXKNrBEZic3XHBn3fnrlDahyrPwp0M3VQaE2lNJDZgSERvdkbLkL-Kkj9St7GT9nc01k8TcVGiKmy84a9MJd6VmeZqNXaamG-Fm-_ju1tvZfwO3O3Bln8BaCDvgpgqbYlLEEUBROJbccYFl46-z_GqIBVgKbdaCrl3KQ"
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        console.log(result.data.rows);
        var temp = [];
        result.data.rows.map((item, index) => {
          temp.push({image: (<Image  width={100} src={`${item.main_image}`} alt="" />), title:item.title})
        })
        setData([...temp]);
      })
  })
//   <Image
//   width={200}
//   src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
// />
  return (
    <>
      <Table
        {...tableProps}
        pagination={{
          position: [top, bottom],
        }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
      />
    </>
  )
}
