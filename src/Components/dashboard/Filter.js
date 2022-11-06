import React, { useEffect, useMemo } from 'react'
import { SearchMinor } from '@shopify/polaris-icons';
import { ChoiceList, TextField, RangeSlider, Filters, Columns, Button, Autocomplete, Icon, ActionList, Popover, Image, Text, Heading, Stack, Card } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import useFetch from '../../customHook/useFetch';
import Element from 'antd/lib/skeleton/Element';
// import { Card } from 'antd';

export default function Filter() {
    const {getListingData} = useFetch()
    const [accountStatus, setAccountStatus] = useState(null);
    const [moneySpent, setMoneySpent] = useState(null);
    const [taggedWith, setTaggedWith] = useState(null);
    const [queryValue, setQueryValue] = useState(null);
    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
      () => setPopoverActive((popoverActive) => !popoverActive),
      [],
    );
  
    const activator = (
      <Button onClick={togglePopoverActive} disclosure>
        More actions
      </Button>
    );

    const handleAccountStatusChange = useCallback(
        (value) => setAccountStatus(value),
        [],
    );
    const handleMoneySpentChange = useCallback(
        (value) => setMoneySpent(value),
        [],
    );
    const handleTaggedWithChange = useCallback(
        (value) => setTaggedWith(value),
        [],
    );
    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleAccountStatusRemove = useCallback(
        () => setAccountStatus(null),
        [],
    );
    const handleMoneySpentRemove = useCallback(() => setMoneySpent(null), []);
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleFiltersClearAll = useCallback(() => {
        handleAccountStatusRemove();
        handleMoneySpentRemove();
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [
        handleAccountStatusRemove,
        handleMoneySpentRemove,
        handleQueryValueRemove,
        handleTaggedWithRemove,
    ]);

    const filters = [
        {
            key: 'accountStatus',
            label: 'Account status',
            filter: (
                <ChoiceList
                    title="Account status"
                    titleHidden
                    choices={[
                        { label: 'Enabled', value: 'enabled' },
                        { label: 'Not invited', value: 'not invited' },
                        { label: 'Invited', value: 'invited' },
                        { label: 'Declined', value: 'declined' },
                    ]}
                    selected={accountStatus || []}
                    onChange={handleAccountStatusChange}
                    allowMultiple
                />
            ),
            shortcut: true,
        },
        {
            key: 'taggedWith',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    value={taggedWith}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
        {
            key: 'moneySpent',
            label: 'Money spent',
            filter: (
                <RangeSlider
                    label="Money spent is between"
                    labelHidden
                    value={moneySpent || [0, 500]}
                    prefix="$"
                    output
                    min={0}
                    max={2000}
                    step={1}
                    onChange={handleMoneySpentChange}
                />
            ),
        },
    ];

    const appliedFilters = [];
    if (!isEmpty(accountStatus)) {
        const key = 'accountStatus';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, accountStatus),
            onRemove: handleAccountStatusRemove,
        });
    }
    if (!isEmpty(moneySpent)) {
        const key = 'moneySpent';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, moneySpent),
            onRemove: handleMoneySpentRemove,
        });
    }
    if (!isEmpty(taggedWith)) {
        const key = 'taggedWith';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, taggedWith),
            onRemove: handleTaggedWithRemove,
        });
    }

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([[{value:"",label:<Heading>No Result Found</Heading>}]]);

    const updateText = useCallback(
        (value) => {
            setInputValue(value);
           
        },
        [],
    );

    useEffect(() => {
        var _searchResult = [];
            getListingData(`https://multi-account.sellernext.com/home/public/connector/product/getSearchSuggestions?query=${inputValue}`).then((result) => {
                result.data.forEach((item, index) => {
                    console.log(result.data);
                    if(item.product_type.toLowerCase().includes(inputValue.toLowerCase()) ||
                    item.brand.toLowerCase().includes(inputValue.toLowerCase()) || 
                    item.title.toLowerCase().includes(inputValue.toLowerCase())){
                        _searchResult.push({
                            value:item.container_id,
                            label:(<Columns
                            columns={{xs: '1fr 10fr'}}>
                                <Image  width={70} src = {item.main_image}/>
                                <Card sectioned>
                                    <Text><b>Title:</b> {item.title}</Text>
                                    <Text><b>Brand: </b> {item.brand}</Text>
                                    <Text><b>Product Type: </b> {item.product_type}</Text>
                                </Card>
                            </Columns>)
                        })
                    }
                })
                if(_searchResult.length)
                    setOptions([..._searchResult])
                else
                    setOptions([
                        {value:"d",
                        label:<Heading>No Result Found</Heading>}])
            })
            if(inputValue === "")
                setOptions([{value:"d",label:<Heading>No Result Found</Heading>}])
    },[inputValue])

    const updateSelection = useCallback(
        (selected) => {
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = options.find((option) => {
                    console.log(option.value);
                    return option.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });

            setSelectedOptions(selected);
            setInputValue(selectedValue[0]);
        },
        [options],
    );
    console.log(options);

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            value={inputValue}
            prefix={<Icon source={SearchMinor} color="base" />}
            placeholder="Search"
        />
    );


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
                    appliedFilters={appliedFilters}
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

        </div>
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'moneySpent':
                return `Money spent is between $${value[0]} and $${value[1]}`;
            case 'taggedWith':
                return `Tagged with ${value}`;
            case 'accountStatus':
                return value.map((val) => `Customer ${val}`).join(', ');
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
}

