import React, { useEffect } from 'react'
import { SearchMinor } from '@shopify/polaris-icons';
import { Button, Autocomplete, Icon, ActionList, Popover, Image, Text, Heading, Stack, Tag } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import useFetch from '../../customHook/useFetch';
import MoreFilter from './MoreFilter';
import SyncStatus from '../filterComponents/SyncStatus';
import AmazonLookup from '../filterComponents/AmazonLookup';

export default function Filter({ selectedOptions, setSelectedOptions }) {
    const [appliedFilters, setAppliedFilters] = useState([
        { key: "input", label: "" },
        { key: "tag", label: "" },
    ]);

    const { getListingData } = useFetch()
    
    const [popoverActive, setPopoverActive] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const [options, setOptions] = useState([[{ value: "", label: <Heading>No Result Found</Heading> }]]);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
           Bulk Update
        </Button>
    );

    const updateText = useCallback((value) => { setInputValue(value) }, []);

    useEffect(() => {
        var _searchResult = [];
        getListingData(`https://multi-account.sellernext.com/home/public/connector/product/getSearchSuggestions?query=${inputValue}`)
        .then((result) => {
            result.data.forEach((item, index) => {
                if (item.product_type.toLowerCase().includes(inputValue.toLowerCase()) ||
                    item.brand.toLowerCase().includes(inputValue.toLowerCase()) ||
                    item.title.toLowerCase().includes(inputValue.toLowerCase())) {
                    _searchResult.push({
                        key: index,
                        value: { id: item.container_id, title: item.title },
                        label: (<Stack wrap={false} alignment="center">
                            <Image width={70} src={item.main_image} />
                            <>
                                <Text><b>Title:</b> {item.title}</Text>
                                <Text><b>Brand: </b> {item.brand}</Text>
                                <Text><b>Product Type: </b> {item.product_type}</Text>
                            </>
                        </Stack>)
                    })
                }
            })
            if (_searchResult.length)
                setOptions([..._searchResult])
            else
                setOptions([
                    {
                        value: "d",
                        label: <Heading>No Result Found</Heading>
                    }])
        })
        if (inputValue === "")
            setOptions([{ value: "d", label: <Heading>No Result Found</Heading> }])
    }, [inputValue])

    const updateSelection = useCallback(
        (selected) => {
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = options.find((option) => {
                    return option.value.title.match(selectedItem.title);
                });
                return matchedOption;
            });
            setSelectedOptions(selectedValue);
            var temp = appliedFilters;
            temp[0] = {
                key: "input",
                label: "Title Contains " + selectedValue[0].value.title,
            }
            setAppliedFilters([...temp])
            setInputValue("")
        },
        [options],
    );
    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            value={inputValue}
            prefix={<Icon source={SearchMinor} color="base" />}
            placeholder="Search"
        />
    );

    
    var tagMarkup = appliedFilters.forEach((option) => {
        if (option.label !== "") {
            return (<Tag key={option.key} onRemove>
                {option.label}
            </Tag>)
        }
    });
    return (
        <div style={{ margin: "20px 0" }}>
            <Stack>
                <Autocomplete
                    options={options}
                    selected={selectedOptions}
                    onSelect={updateSelection}
                    textField={textField}
                />
                 <MoreFilter appliedFilters={appliedFilters} setAppliedFilters={setAppliedFilters} />
                
                <SyncStatus/>
                <AmazonLookup/>
                <Popover 
                    active={popoverActive}
                    activator={activator}
                    autofocusTarget="first-node"
                    onClose={togglePopoverActive}
                >
                    <ActionList
                        actionRole="menuitem"
                        items={[{ content: 'Import' }, { content: 'Export' }]}
                    />
                </Popover>
            </Stack>
            <Stack spacing="tight">{tagMarkup}</Stack>
        </div>
    );
}