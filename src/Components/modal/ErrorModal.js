// import { Heading, Icon, Modal, Stack, Tabs, TextContainer } from '@shopify/polaris';
// import React, { useCallback } from 'react'
// import {
//     AnalyticsMinor
// } from '@shopify/polaris-icons';
// export default function ErrorModal({ props}) {

//     const handleChange = useCallback(() => {
//         setActiveErrorModal(!activeErrorModal)
//         // setSelected(selected)
//     }, [activeErrorModal]);

//     const tabs = [
//         {
//           id: "product",
//           content: (
//             <span>
//               Product Errors
//               <Badge status="new">
//                 {Object.keys(props.status.detail.parent).length}
//               </Badge>
//             </span>
//           ),
//           accessibilityLabel: "product",
//           panelID: "product-1",
//         },
//         {
//           id: "variant",
//           content: (
//             <span>
//               Variant Errors
//               <Badge>{Object.keys(props.status.detail.child).length}</Badge>
//             </span>
//           ),
//           accessibilityLabel: "varient",
//           panelID: "variant-content-1",
//         },
//       ];

//     return (
//         <div>
//             <Modal
//                 open={activeErrorModal}
//                 onClose={handleChange}
//                 title="Actions in progress"
//                 primaryAction={{
//                     content: 'Refresh to update status',
//                     onAction: handleChange,
//                 }}
//                 secondaryActions={[
//                     {
//                         content: 'Close',
//                         onAction: handleChange,
//                     },
//                 ]}
//             >
//                 <Modal.Section>
//                     <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
//                         <Card.Section>
//                             <>
//                                 {selected === 0 ? (
//                                     Object.keys(props.status.detail.parent).length === 0 ? (
//                                         <div className={Error.emptyImage}>
//                                             <img src="empty.png" alt="" />
//                                         </div>
//                                     ) : (
//                                         Object.entries(props.status.detail.parent).map((item) => {
//                                             return (
//                                                 <div className={Error.mainDiv}>
//                                                     <Heading>{item[0]}</Heading>
//                                                     {item[1].map((val) => {
//                                                         return (
//                                                             <>
//                                                                 <p>
//                                                                     <span>
//                                                                         <Icon
//                                                                             source={RiskMinor}
//                                                                             color="critical"
//                                                                             backdrop
//                                                                         />
//                                                                     </span>
//                                                                     {val}
//                                                                 </p>
//                                                             </>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             );
//                                         })
//                                     )
//                                 ) : Object.keys(props.status.detail.child).length === 0 ? (
//                                     <div className={Error.emptyImage}>
//                                         <img src="empty.png" alt="" />
//                                     </div>
//                                 ) : (
//                                     Object.entries(props.status.detail.child).map((item) => {
//                                         return (
//                                             <div className={Error.mainDiv}>
//                                                 <Heading>{item[0]}</Heading>
//                                                 {item[1].map((val) => {
//                                                     return (
//                                                         <>
//                                                             <p>
//                                                                 <span>
//                                                                     <Icon
//                                                                         source={RiskMinor}
//                                                                         color="critical"
//                                                                         backdrop
//                                                                     />
//                                                                 </span>
//                                                                 {val}
//                                                             </p>
//                                                         </>
//                                                     );
//                                                 })}
//                                             </div>
//                                         );
//                                     })
//                                 )}
//                             </>
//                         </Card.Section>
//                     </Tabs>
//                     <TextContainer>
//                         {status.detail.parent.map((item, index) => {
//                             return (
//                                 <Stack alignment="center">
//                                     <span><Icon
//                                         source={AnalyticsMinor}
//                                         color="base"
//                                     /></span>
//                                     <Heading>{item}</Heading>
//                                 </Stack>)
//                         })}
//                     </TextContainer>
//                 </Modal.Section>
//             </Modal>
//         </div>
//     )
// }
