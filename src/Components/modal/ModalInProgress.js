import React from 'react'
import { Button, Heading, Icon, Modal, Stack, TextContainer } from '@shopify/polaris';
import {
    AnalyticsMinor
  } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export default function ModalInProgress({ activeProgressModal, setActiveProgressModal, modalProp, selected, setSelected  }) {
    //   const [activeProgressModal, setActiveProgressModal] = useState(false);

    const handleChange = useCallback(() => {
        setActiveProgressModal(!activeProgressModal)
        setSelected(selected)
    }, [activeProgressModal]);

    console.log(modalProp);
    return (
        <div>
            <Modal
                open={activeProgressModal}
                onClose={handleChange}
                title="Actions in progress"
                primaryAction={{
                    content: 'Refresh to update status',
                    onAction: handleChange,
                }}
                secondaryActions={[
                    {
                        content: 'Close',
                        onAction: handleChange,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        {modalProp.map((item, index) => {
                            return (
                                <Stack alignment="center">
                                    <span><Icon
                                        source={AnalyticsMinor}
                                        color="base"
                                    /></span>
                                    <Heading>{item}</Heading>
                                </Stack>)
                        })}
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </div>
    );
}
