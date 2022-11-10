import { Select } from '@shopify/polaris';
import React from 'react'
import { connect } from 'react-redux';
import { tableFilter } from '../../Redux/actions';

function FilterSelect({ options, tableFilter, state, property, index, type }) { 
    return (
        <>
            <Select
                placeholder='-select-'
                options={options}
                onChange={(value) => {
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