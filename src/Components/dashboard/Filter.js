import React, { useEffect, useMemo } from 'react'
import { SearchMinor } from '@shopify/polaris-icons';
import { TextField, Filters, Columns, Button, Autocomplete, Icon, ActionList, Popover, Image, Text, Heading, Stack, Tag, Card } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import useFetch from '../../customHook/useFetch';

export default function Filter({ selectedOptions, setSelectedOptions }) {
    const [appliedFilters, setAppliedFilters] = useState([
        {
            key: "input",
            label: "",
        },
        {
            key: "tag",
            label: "",
        },
    ]);
    const { getListingData } = useFetch()

    const [popoverActive, setPopoverActive] = useState(false);

    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([[{ value: "", label: <Heading>No Result Found</Heading> }]]);

    var removeTag = (removeKey) => {
        // // setAppliedFilters((previousTags) =>
        // //     previousTags.filter((previousTag) => previousTag.key !== removeKey))
        // console.log(removeKey);
    }

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            More actions
        </Button>
    );
    // console.log(appliedFilters);

    const updateText = useCallback((value) => { setInputValue(value) }, []);

    useEffect(() => {
        var _searchResult = [];
        getListingData(`https://multi-account.sellernext.com/home/public/connector/product/getSearchSuggestions?query=${inputValue}`).then((result) => {
            result.data.forEach((item, index) => {
                // console.log(result.data);
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
            // console.log("selected", selected)
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = options.find((option) => {
                    // console.log(option);
                    return option.value.title.match(selectedItem.title);
                });
                return matchedOption;
            });
            setSelectedOptions(selectedValue);
            console.log(selectedValue);
            // console.log(selectedValue[0]);
            var temp = appliedFilters;
            temp[0] = {
                key: "input",
                label: "Title Contains " + selectedValue[0].value.title,
                onRemove: removeTag("input"),
            }
            setAppliedFilters([...temp])
            setInputValue("")
        },
        [options],
    );
    // console.log(selectedOptions);
    // Math.floor(Date.now() * Math.random())
    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            value={inputValue}
            prefix={<Icon source={SearchMinor} color="base" />}
            placeholder="Search"
        />
    );

    //     var tagMarkup = <Tag key={111} onRemove={console.log("xx")}>
    //     Sachin
    // </Tag>
    var tagMarkup = appliedFilters.map((option) => {
        if (option.label !== "") {
            return (<Tag key={option.key} onRemove>
                {option.label}
            </Tag>)
        }
    });
    return (
        <div style={{ margin: "20px 0" }}>
            <Columns columns={{ md: '2.5fr 0.5fr 1fr 1fr 1fr' }}>

                <Autocomplete
                    options={options}
                    selected={selectedOptions}
                    onSelect={updateSelection}
                    textField={textField}
                />
                <Filters
                    // queryValue={queryValue}
                    filters={filters}
                    // appliedFilters={appliedFilters}
                    onQueryChange={handleFiltersQueryChange}
                    onQueryClear={handleQueryValueRemove}
                    onClearAll={handleFiltersClearAll}
                    hideQueryField
                />
                <Button>Sync Status</Button>
                <Button>Amazon Lookup</Button>
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
            </Columns>
            <Stack spacing="tight">{tagMarkup}</Stack>
        </div>
    );
}