import { Filters, Heading, Select, Stack, TextField } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'
import useFetch from '../../customHook/useFetch';
import FilterInput from '../filterComponents/FilterInput';
import FilterSelect from '../filterComponents/FilterSelect';

var selectOptions = {
    "Sku": [
        { label: "Equals", value: "1" },
        { label: "Not Equals", value: "2" },
        { label: "Contains", value: "3" },
        { label: "Does Not Contain", value: "4" },
        { label: "Starts With", value: "5" },
        { label: "Ends With", value: "6" },
    ],
    "Vendor": [
        { label: "Equals", value: "1" },
        { label: "Not Equals", value: "2" }
    ],
    "Quantity": [
        { label: "Equals", value: "1" },
        { label: "Not Equals", value: "2" },
        { label: "Greater than equal to", value: "8" },
        { label: "Less than equal to", value: "9" },
    ]
}

export default function MoreFilter({ appliedFilters, setAppliedFilters }) {
    const [moneySpent, setMoneySpent] = useState(null);
    const [taggedWith, setTaggedWith] = useState(null);
    const [queryValue, setQueryValue] = useState(null);
    const [filterValues, setFilterValues] = useState([])
    const [filters, setFilters] = useState([])
    const { getFilters } = useFetch();
    const handleMoneySpentRemove = useCallback(() => setMoneySpent(null), []);

    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);

    const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);

    var removeTag = () => {

    }

    console.log(filterValues);
    var filterOptions = (data, index) => {
        if (data.title === "Vendor") {
            return <Stack vertical>

                <FilterSelect
                    property={data.code}
                    options={selectOptions.Vendor}
                    index={index}
                    type={"condition"} />

                <FilterSelect
                    property={data.code}
                    options={data.options}
                    type={"value"}
                    index={index} />

            </Stack>
        }
        else return <FilterSelect
            property={data.code}
            options={data.options}
            type={"value"}
            index={index} />
    }

    var filterWithOutOptions = (data, index) => {
        if (data.title === "Sku")
            return <Stack vertical>

                <FilterSelect
                    property={data.code}
                    options={selectOptions.Sku}
                    type={"condition"}
                    index={index} />

                <FilterInput
                    property={data.code}
                    type={"value"}
                    index={index} />

            </Stack>
        else if (data.title === "Quantity")
            return <Stack vertical>

                <FilterSelect
                    property={data.code}
                    type={"condition"}
                    options={selectOptions.Quantity}
                    index={index} />

                <FilterInput
                    property={data.code}
                    type={"value"}
                    index={index} />

            </Stack>
        else {
            return <FilterInput
                property={data.code}
                type={"value"}
                index={index} 
                />
        }
    }
    useEffect(() => {
        getFilters(`https://multi-account.sellernext.com/home/public/connector/source/getFilterAttributes`)
            .then((result) => {
                console.log(result.data);
                var _drawerFilter = []
                var _filterValueObject = filterValues;
                result.data.forEach((item, index) => {
                    if (item.title !== "Title" && item.title !== "Price" && item.title !== "Collections") {
                        _drawerFilter.push({
                            key: item.code,
                            label: item.title,
                            filter: ((item['options'] !== undefined) ? filterOptions(item, index) : filterWithOutOptions(item, index))
                            ,
                            shortcut: true
                        })
                        _filterValueObject.push({
                            property: item.code,
                            condition: "",
                            value: ""
                        })
                    }
                })
                setFilters([..._drawerFilter])
                setFilterValues([..._filterValueObject])
            })
    }, [])
    return (
        <>
            <Filters
                // queryValue={queryValue}
                filters={filters}
                // appliedFilters={appliedFilters}
                onQueryChange={handleFiltersQueryChange}
                onQueryClear={handleQueryValueRemove}
                // onClearAll={handleFiltersClearAll}
                hideQueryField
            />
        </>
    )
}
