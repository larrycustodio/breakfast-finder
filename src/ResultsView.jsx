import React, { Component } from 'react';
import LoadingContainer from './LoadingView';
import axios from 'axios';

class ResultsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFilters: {
                category_filter: this.props.search.categories,
                limit: '10',
                location: this.props.search.location,
                name: this.props.search.name,
                sort: '1',
            },
            yelpResults: {},
            isSearchDone: false
        }
    }
    onClickHandler(e) {
        //todo on toggle
    }
    componentWillMount() {
        const search = this.state.searchFilters;
        const requestUrl = 'http://localhost:3002/api/yelp/search/' + search.category_filter + '/location/' + search.location; 
        console.log(requestUrl);
        axios.get(requestUrl)
            .then(res => res.data)
            .then(results => {
                this.setState({
                    yelpResults: results,
                    isSearchDone: true
                });
            });
    }
    render() {
        if(!this.state.isSearchDone){
            console.log('loading...');
            return (
                <LoadingContainer />
            );
        } else {
            console.log('done!');
            return (
                    <div className='view-container view-search-results'>
                        <ResultsContainer
                            businesses={this.state.yelpResults.businesses}
                            categories={this.props.categories}
                            onClick={this.onClickHandler} />
                        <MapContainer />
                    </div>
                );
            }
    }
}

const ResultsContainer = (props) => {
    return (
        <div className='display-list-results'>
            <div className='results-nearby'>
                Found {props.businesses.length} places nearby!
            </div>
            <div className='results-list'>
                {props.businesses.map((place,index) => {
                    return (
                        <BusinessList className='list'
                        key={'list-'+index}
                        businessInfo={place} />
                    );
                })}
            </div>
            <div className='toggle-cat'>
                {props.categories.map((icon, index) => {
                    return (
                        <CategorySprite className='cat-icon'
                            key={'sprite-' + index}
                            index={index}
                            onClick={props.onClick}
                            icon={icon} />
                    );
                })}
            </div>
        </div>
    );
}
const BusinessList = (props) => {
    const info = props.businessInfo;
    const backgroundImage = {
        background: 'linear-gradient(rgba(87,87,87,0.61),rgba(87,87,87,0.61)), url(' + props.businessInfo.image_url + ')',
        backgroundSize: 'cover',
    }
    const ratingStars = Math.trunc(info.rating) !== info.rating ? Math.trunc(info.rating) + '_half' : info.rating; 
    return (
        <div className='result-list-card' style={backgroundImage}>
            <p className='list-name'>{info.name}</p>
            <img className='list-rating'
                src=  {'./assets/yelp_stars/small/small_' + ratingStars + '.png' } />
            <p className='list-distance'>{'~'+ (info.distance * 0.622 * 0.001).toFixed(1) + ' miles away'}</p>
        </div>
    );
}
const CategorySprite = (props) => {
    return (
        <div className='cat-icon'
            onClick={props.onClick}
            data-category-value={props.index} >
            <img className='cat-icon-svg'
                data-category-value={props.index}
                src={props.icon.spriteSrc} />
            <p className='cat-icon-name'>
                {props.icon.name.toUpperCase()}
            </p>
        </div>
    );
}
const MapContainer = (props) => {
    return (
        <div className='display-map-results'>
            Map Goes here!
        </div>
    )
}

export default ResultsView;