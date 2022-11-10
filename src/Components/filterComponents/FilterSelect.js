import { Select } from '@shopify/polaris';
import React from 'react'
import { connect } from 'react-redux';
import { tableFilter } from '../../Redux/actions';

function FilterSelect({ options, tableFilter, state, property, index, type }) {
    console.log(state);

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
        ],
    }

    return (
        <>
            <Select
                placeholder='-select-'
                options={options}
                onChange={(value) => {
                    console.log(value);
                    tableFilter({
                        property: property, 
                        type: type,
                        value: value,
                        index: index
                    })
                }}
            value= {
                type === 'value'? state.filter[index]?.value : state.filter[index]?.condition
            }
            />
        </>
    )
}

const MapStateToProps = (state) => {
    return {
        state: state.dataTable
    }
}
const MapDispatchToProps = (dispatch) => {
    return {
        tableFilter: (value) => dispatch(tableFilter(value))
    }
}
export default connect(MapStateToProps, MapDispatchToProps)(FilterSelect)