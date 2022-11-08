import { TextField } from '@shopify/polaris'
import React from 'react'
import { connect } from 'react-redux';
import { tableFilter } from '../../Redux/actions';

function FilterInput({tableFilter, property, type, index}) {
    return (
        <>
            <TextField 
            onChange={(value) => {
                tableFilter({
                    property: property, 
                    type: type,
                    value: value,
                    index: index
                })
            }}
            />
        </>
    )
}

const MapStateToProps = (state) => {
    return {
        state: state
    }
}
const MapDispatchToProps = (dispatch) => {
    return {
        tableFilter: (value) => dispatch(tableFilter(value))
    }
}
export default connect(MapStateToProps, MapDispatchToProps)(FilterInput)
