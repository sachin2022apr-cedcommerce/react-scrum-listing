import { Button, Modal, Page, TextContainer, Toast } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import useFetch from '../../customHook/useFetch';

export default function SyncStatus() {
  var { getLookupSync } = useFetch()
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const [syncDataResult, setSyncDataResult] = useState();
  const [activeToast, setActiveToast] = useState(false);

  const fetchSync = () => {
    getLookupSync(`https://multi-account.sellernext.com/home/public/connector/product/matchProduct`)
      .then((syncData) => {
        setSyncDataResult(syncData.message);
        toggleActive();

      })
    handleChange();
  };

  const toggleActive = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );

  const toastMarkup = activeToast ? (
    <Toast content={syncDataResult} onDismiss={toggleActive} />
  ) : null;
  
  return (
    <>
      <Button onClick={() => setActive(!active)}>Sync Status</Button>
      <Modal
        open={active}
        onClose={handleChange}
        title="Reach more shoppers with Instagram product tags"
        primaryAction={{
          content: "Proceed",
          onAction: fetchSync,
        }}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              It will search sku(s) in your Amazon’s seller panel. For all the
              products with matching sku(s), status of main products will
              shown 
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
      <Page>{toastMarkup}</Page>
    </>
  )
}
