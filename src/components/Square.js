import React from 'react';

export default class Square extends React.Component{
    render (){
        return (
            <div className={`square num-${this.props.value || 0}`}>
                {this.props.value}
            </div>
        )
    }
}