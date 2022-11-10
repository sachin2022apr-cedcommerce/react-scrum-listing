import { Button, Modal, Page, TextContainer, Toast } from '@shopify/polaris'

import React, { useCallback, useState } from 'react'
import useFetch from '../../customHook/useFetch';

export default function AmazonLookup() {
    var { getLookupSync } = useFetch()
    const [active, setActive] = useState(false);
    const [lookupResult, setLookupResult] = useState();
    const [activeToast, setActiveToast] = useState(false);
    const toggleActive = useCallback(
        () => setActiveToast((activeToast) => !activeToast),
        []
    );
    const toastMarkup = activeToast ? (
        <Toast content={lookupResult} onDismiss={toggleActive} />
    ) : null;
    const fetchLookup = () => {
        getLookupSync(`https://multi-account.sellernext.com/home/public/connector/product/searchProduct`)
            .then((result) => {
                setLookupResult(result.message)
                toggleActive();
            })
        setActive(!active);
    };
    return (
        <div>
            <Button onClick={() => setActive(!active)}>Amazon Lookup</Button>
            <Modal
                open={active}
                onClose={() => setActive(!active)}
                title="Reach more shoppers with Instagram product tags"
                primaryAction={{
                    content: "Proceed",
                    onAction: fetchLookup,
                }}>
                <Modal.Section>
                    <TextContainer>
                        <p>
                            You can choose to run Amazon Lookup for any number of products
                            you want.
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
            <Page>{toastMarkup}</Page>
        </div>
    )
}
